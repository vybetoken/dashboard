async function proposalsCount() {
    let count = 0;

    for (let proposal of activeProposals) {
        if (proposal.type) {
            count++;
        }
    }

    return count;
}

async function getDAOBalance() {
    const balance = await vybeContract.balanceOf(contractData.dao);
    return ethers.utils.formatUnits(balance, 18);
}

async function getNewProposalEvents() {
    let params = {
        address: contractData.dao,
        fromBlock: lastBlock,
        toBlock: 'latest',
        topics: []
    }
    return await daoContract.queryFilter(params);
}

async function vote(id) {
    try {
        await daoContract.addVote(id);
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}

async function unvote(id) {
    try {
        await daoContract.removeVote(id);
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}

async function complete(proposal) {
    await daoContract.completeProposal(proposal.id, proposal.voters, overrideGasLimit);
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
    let proposals = await getNewProposalEvents();

    let p = 0;
    while (p < proposals.length) {
        let proposal = proposals[p];
        proposals[p] = {
            id: parseInt(proposal.topics[1]),
            blockCreated: parseInt(proposal.blockNumber)
        };

        let meta = await daoContract.proposals(p);

        // not working
        // if (meta.completed || ((meta.submitted.add(2629800)) < Math.floor((+new Date) / 1000))) {
        //     proposals = proposals.splice(1);
        //     console.log("splice");
        //     continue;
        // }

        let threshold = ethers.BigNumber.from(await stakeContract.totalStaked());
        let info;
        // The names of these mappings should've had their _ removed when they were made public.
        switch (meta.pType) {
            case 1:
                proposals[p].type = "Fund";
                threshold = threshold.div(2);
                const fundInfo = await daoContract._fundProposals(proposals[p].id);
                proposals[p].amount = ethers.utils.formatUnits(fundInfo.amount, 18);
                proposals[p].address = fundInfo.destination;
                info = fundInfo.info;
                break;

            case 2:
                proposals[p].type = "ModuleAddition";
                threshold = threshold.div(3).times(2);
                proposals[p].amount = ethers.utils.formatUnits(0, 18);
                proposals[p].address = (await daoContract._melodyAdditionProposals(proposals[p].id)).sub(26, 40);
                const additionInfo = await daoContract._melodyAdditionProposals(proposals[p].id);
                info = additionInfo.info;
                break;

            case 3:
                proposals[p].type = "ModuleRemoval";
                threshold = threshold.div(2);
                proposals[p].amount = ethers.utils.formatUnits(0, 18);
                proposals[p].address = (await daoContract._melodyRemovalProposals(proposals[p].id)).substr(26, 40);
                const removalInfo = await daoContract._melodyRemovalProposals(proposals[p].id);
                info = removalInfo.info;
                break;

            case 4:
                proposals[p].type = "StakeUpgrade";
                threshold = threshold.div(5).times(4);
                proposals[p].amount = ethers.utils.formatUnits(0, 18);
                proposals[p].address = (await daoContract._stakeUpgradeProposals(proposals[p].id)).substr(26, 40);
                const upgradeInfo = await daoContract._stakeUpgradeProposals(proposals[p].id);
                info = upgradeInfo.info;
                break;

            case 5:
                proposals[p].type = "DAOUpgrade";
                threshold = threshold.div(5).times(4);
                proposals[p].amount = ethers.utils.formatUnits(0, 18);
                proposals[p].address = (await daoContract._daoUpgradeProposals(proposals[p].id)).substr(26, 40);
                const daoInfo = await daoContract._daoUpgradeProposals(proposals[p].id);
                info = daoInfo.info;
                break;
        }

        threshold = threshold.add(1);
        proposals[p].info = info;
        if (/[^(a-zA-Z\d\s\/:.!@)]/.test(proposals[p].info)) {
            proposals[p].info = "Invalid info string.";
        }

        proposals[p].voters = [];
        let addedFilter = await daoContract.filters.ProposalVoteAdded(proposals[p].id);
        let added = await daoContract.queryFilter(addedFilter);
        let removedFilter = await daoContract.filters.ProposalVoteRemoved(proposals[p].id);
        let removed = await daoContract.queryFilter(removedFilter);
        let addedBlock = {};
        let removedBlock = {};

        for (let event of added) {
            const voter = "0x" + event.topics[2].substr(26, 40);
            proposals[p].voters.push(voter);
            addedBlock[voter] = parseInt(event.blockNumber);
        }
        for (let event of removed) {
            const voter = "0x" + event.topics[2].substr(26, 40);
            removedBlock[voter] = parseInt(event.blockNumber);
        }

        proposals[p].voters = Array.from(new Set(proposals[p].voters));
        let v = 0;
        while (v < proposals[p].voters.length) {
            if (removedBlock.hasOwnProperty(proposals[p].voters[v])) {
                // Has an edge case based on transaction order in block
                if (removedBlock[proposals[p].voters[v]] >= addedBlock[proposals[p].voters[v]]) {
                    proposals[p].voters.splice(v, 1);
                    continue;
                }
            }
            v++;
        }
        proposals[p].votes = ethers.BigNumber.from(0);
        for (let voter of proposals[p].voters) {
            proposals[p].votes = proposals[p].votes.add(ethers.BigNumber.from(
                await stakeContract.staked(voter))
            );
        }
        proposals[p].completable = proposals[p].votes.gt(threshold);
        proposals[p].votes = formatAtomic(proposals[p].votes.toString(), 0);
        p++;
    }

    return proposals;
}
