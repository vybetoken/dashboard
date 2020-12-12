async function proposalsCount() {
    let count = 0;
    for (let proposal of activeProposals) {
        if (!proposal) {
            continue;
        } else if (proposal.meta.completed === true) {
            continue;
        } else if (typeof proposal.type === "string") {
            // increase active proposal count
            count++;
        }
    }

    return count;
}

async function getDAOBalance() {
    try {
        const balance = await vybeContract.balanceOf(contractData.dao);
        return ethers.utils.formatUnits(balance, 18);
    } catch (err) {
        console.log(`Failed to determine DAO balance`);
        return ethers.utils.formatUnits(0, 18);
    }
}

async function getNewProposalEvents() {
    let params = {
        address: contractData.dao,
        fromBlock: lastBlock,
        toBlock: 'latest',
        topics: [ ]
    }
    return await daoContract.queryFilter(params);
}

async function vote(id) {
    try {
        await daoContract.addVote(id);
        successAlert("Vote Submitted!");
        return true;
    } catch (err) {
        console.log(err);
        errorAlert("Vote Failed!");
        return false;
    }
}

async function unvote(id) {
    try {
        await daoContract.removeVote(id);
        successAlert("Vote Removed!");
        return true;
    } catch (err) {
        console.log(err);
        errorAlert("Vote Failed!");
        return false;
    }
}

async function complete(id) {
    const proposal = await activeProposals.find(p => p.id === id);
    await daoContract.completeProposal(proposal.id, proposal.voters, overrideGasLimit);
    successAlert("Completion Requested!");
}

async function proposeFund(amount, info) {
    if ((info.length > 80) || (/[^(a-zA-Z\d\s\/:.!@)]/.test(info))) {
        return false;
    }

    // Ensure this user can pay the proposal fee
    let balance = ethers.utils.formatUnits(await vybeContract.balanceOf(userAddress), 18);
    balance = parseInt(balance.substr(0, balance.indexOf(".")));
    if (balance < 10) {
        return false;
    }

    // Format the number
    amount = handleAmount(amount);
    if (!amount) {
        return false;
    }

    try {
        if (!(ethers.BigNumber.from(UINT256_MAX)).eq(
                ethers.BigNumber.from(
                    await vybeContract.allowance(userAddress, contractData.dao)
                )
            )
        ) {
            await vybeContract.approve(contractData.dao, UINT256_MAX);
        }
        // Propose
        await daoContract.proposeFund(userAddress, amount, info, overrideGasLimit);

    } catch (err) {
        console.log(err);
        return false;
    }
    return true;
}

async function getActiveProposals() {
    // let proposals = await getNewProposalEvents();

    let proposalFilter = await daoContract.filters.ProposalVoteAdded();
    const proposals = await daoContract.queryFilter(proposalFilter);
    const totalStaked = await stakeContract.totalStaked();

    let newProposals = [];

    for (let proposal of proposals) {
        const pid = parseInt(proposal.topics[1]);
        const blockCreated = parseInt(proposal.blockNumber);
        newProposals[pid] = {
            id: pid,
            blockCreated
        };
        newProposals[pid].meta = await daoContract.proposals(pid);

        let threshold = await stakeContract.totalStaked();
        let info;
        // The names of these mappings should've had their _ removed when they were made public.
        switch (newProposals[pid].meta.pType) {
            case 1:
                newProposals[pid].type = "Fund";
                threshold = threshold.div(2);
                const fundInfo = await daoContract._fundProposals(newProposals[pid].id);
                newProposals[pid].amount = fundInfo.amount;
                newProposals[pid].address = fundInfo.destination;
                info = fundInfo.info;
                break;

            case 2:
                newProposals[pid].type = "Module Addition";
                threshold = threshold.div(3).mul(2);
                newProposals[pid].amount = ethers.BigNumber.from(0);
                const additionInfo = await daoContract._melodyAdditionProposals(newProposals[pid].id);
                newProposals[pid].address = additionInfo.module;
                info = additionInfo.info;
                break;

            case 3:
                newProposals[pid].type = "Module Removal";
                threshold = threshold.div(2);
                newProposals[pid].amount = ethers.BigNumber.from(0);
                const removalInfo = await daoContract._melodyRemovalProposals(newProposals[pid].id);
                newProposals[pid].address = removalInfo.module;
                info = removalInfo.info;
                break;

            case 4:
                newProposals[pid].type = "Stake Upgrade";
                threshold = threshold.div(5).mul(4);

                newProposals[pid].amount = ethers.BigNumber.from(0);
                const upgradeInfo = await daoContract._stakeUpgradeProposals(newProposals[pid].id);
                newProposals[pid].address = upgradeInfo.newStake;
                info = upgradeInfo.info;
                break;

            case 5:
                newProposals[pid].type = "DAO Upgrade";
                threshold = threshold.div(5).mul(4);
                newProposals[pid].amount = ethers.BigNumber.from(0);
                const daoInfo = await daoContract._daoUpgradeProposals(newProposals[pid].id);
                newProposals[pid].address = daoInfo.newDAO;
                info = daoInfo.info;
                break;
        }

        // set requiedVotes threshold
        threshold = threshold.add(1);
        newProposals[pid].requiedVotes = threshold;

        newProposals[pid].info = info;
        if (/[^(a-zA-Z\d\s\/:.!@)]/.test(newProposals[pid].info)) {
            newProposals[pid].info = "Invalid info string.";
        }

        newProposals[pid].voters = [];
        let addedFilter = await daoContract.filters.ProposalVoteAdded(newProposals[pid].id);
        let added = await daoContract.queryFilter(addedFilter);
        let removedFilter = await daoContract.filters.ProposalVoteRemoved(newProposals[pid].id);
        let removed = await daoContract.queryFilter(removedFilter);
        let addedBlock = {};
        let removedBlock = {};

        for (let event of added) {
            const voter = "0x" + event.topics[2].substr(26, 40);
            newProposals[pid].voters.push(voter);
            addedBlock[voter] = parseInt(event.blockNumber);
        }
        for (let event of removed) {
            const voter = "0x" + event.topics[2].substr(26, 40);
            removedBlock[voter] = parseInt(event.blockNumber);
        }
        newProposals[pid].voters = Array.from(new Set(newProposals[pid].voters));

        let v = 0;
        while (v < newProposals[pid].voters.length) {
            if (removedBlock.hasOwnProperty(newProposals[pid].voters[v])) {
                // Has an edge case based on transaction order in block
                if (removedBlock[newProposals[pid].voters[v]] >= addedBlock[newProposals[pid].voters[v]]) {
                    newProposals[pid].voters.splice(v, 1);
                    continue;
                }
            }
            v++;
        }
        newProposals[pid].votes = ethers.BigNumber.from(0);
        for (let voter of newProposals[pid].voters) {
            newProposals[pid].votes = newProposals[pid].votes.add(ethers.BigNumber.from(
                await stakeContract.staked(voter))
            );
        }

        newProposals[pid].completable = newProposals[pid].votes.gt(threshold);
        newProposals[pid].votePercent = (newProposals[pid].votes / newProposals[pid].requiedVotes * 100).toFixed(2);
    }

    return newProposals;
}
