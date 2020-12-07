// <tr>
//   <td><a href="#">0x2402...Ex88</a></td>
//   <td><a href="#">github.com/vybe..</a></td>
//   <td> 100 VYBE ($2,732.11) </td>
//   <td> Mar 1, 2021 </td>
//   <td>
//     <div class="progress">
//       <div class="progress-bar bg-success" role="progressbar" style="width: 5.1%" aria-valuenow="5.1" aria-valuemin="0" aria-valuemax="100"></div>
//     </div>
//   </td>
//   <td>
//       <div class="btn-group" role="group" aria-label="Basic example">
//         <button type="button" class="btn btn-gradient-success btn-rounded mr-1">Approve</button>
//         <button type="button" class="btn btn-gradient-danger btn-rounded">Refuse</button>
//       </div>
//   </td>
// </tr>

async function getDAOBalance() {
    const balance = await vybeProvider.balanceOf(contractData.dao);
    return ethers.utils.formatUnits(balance, 18);
}

async function daoEvents(from, event, filter) {
    console.log(filter);
    let params = {
        address: contractData.dao,
        fromBlock: from,
        toBlock: 'latest',
        topics: [ filter ] || []
    }
    const walletProivder = new ethers.providers.Web3Provider(window.ethereum);
    const eventsProvider = new ethers.Contract(contractData.dao, contractData.daoABI, walletProivder);
    return await eventsProvider.queryFilter(params);
}

async function vote(id) {
  await daoSigner.addVote(id);
}

async function unvote(id) {
    await daoSigner.removeVote(id);
}

async function complete(proposal) {
    await daoSigner.completeProposal(proposal.id, proposal.voters);
}

async function proposeFund(amount, info) {
    if ((info.length > 80) || (/[^(a-zA-Z\d\s\/:.!@)]/.test(info))) {
        return false;
    }

    // Ensure this user can pay the proposal fee
    let balance = ethers.utils.formatUnits(await vybeProvider.balanceOf(userAddress), 18);
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
        // Allow the DAO to claim the proposal fee
        const UINT256_MAX = "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF";

        if (!(new ethers.BigNumber(UINT256_MAX)).equals(
            // new web3.BigNumber(await call(VYBE_ADDRESS, "allowance", [ethereum.selectedAddress, DAO_ADDRESS]))
            new ethers.BigNumber(await vybeProvider.allowance(userAddress, contractData.dao))
        )) {
            // await tx(VYBE_ADDRESS, "approve", [DAO_ADDRESS, UINT256_MAX]);
            // await approveSpender(contractData.dao, UINT256_MAX);
            await vybeSigner.approve(contractData.dao, UINT256_MAX);
        }
        // Propose
        // await tx(DAO_ADDRESS, "proposeFund", [ethereum.selectedAddress, amount, info]);
        await daoSigner.proposeFund(userAddress, amount, info);

    } catch (e) {
        return false;
    }
    return true;
}

// Global to enable caching
// Supposed to be used with lastBlock
// Not currently implemented
let proposals;
// This is built with a ton of ABI parsing
// Updating to the latest Web3 will allow us to remove it
async function listActiveProposals() {
    let proposals = await daoEvents(lastBlock, "NewProposal", null);

    let p = 0;
    while (p < proposals.length) {
        let proposal = proposals[p];
        proposals[p] = {
            id: parseInt(proposal.topics[1]),
            blockCreated: parseInt(proposal.blockNumber)
        };

        let meta = (
            // await call(DAO_ADDRESS, "proposals", [proposals[p].id])
            await daoProvider.proposals(proposals[p].id)).substr(2);
        meta = {
            type: parseInt("0x" + meta.substr(0, 64)),
            creator: "0x" + meta.substr(88, 40),
            submitted: parseInt("0x" + meta.substr(128, 64)),
            completed: parseInt("0x" + meta.substr(192, 64)) == 1
        }
        if (meta.completed || ((meta.submitted + 2629800) < Math.floor((+new Date) / 1000))) {
            proposals = proposals.splice(1);
            continue;
        }

        let threshold = new ethers.BigNumber(await stakeProvider.totalStaked());
        // let mapping;
        let info;
        let base;
        // The names of these mappings should've had their _ removed when they were made public.
        switch (meta.type) {
            case 1:
                proposals[p].type = "Fund";
                threshold = threshold.div(2);
                mapping = "_fundProposals";
                base = 192;
                proposals[p].amount = formatAtomic((new ethers.BigNumber("0x" + (

                    // await call(DAO_ADDRESS, mapping, [proposals[p].id])
                    await daoProvider.mapping(proposals[p].id)

            ).substr(66, 64))).toString(), 4);
                info = (await daoProvider._fundProposals(proposals[p].id)).substr(2);
                break;

            case 2:
                proposals[p].type = "MelodyAddition";
                threshold = threshold.div(3).times(2);
                // mapping = "_melodyAdditionProposals";
                proposals[p].address = (await daoProvider._melodyAdditionProposals(proposals[p].id)).substr(26, 40);
                info = (await daoProvider._melodyAdditionProposals(proposals[p].id)).substr(2);
                base = 128;
                break;

            case 3:
                proposals[p].type = "MelodyRemoval";
                threshold = threshold.div(2);
                // mapping = "_melodyRemovalProposals";
                proposals[p].address = (await daoProvider._melodyRemovalProposals(proposals[p].id)).substr(26, 40);
                info = (await daoProvider._melodyRemovalProposals(proposals[p].id)).substr(2);
                base = 128;
                break;

            case 4:
                proposals[p].type = "StakeUpgrade";
                threshold = threshold.div(5).times(4);
                // mapping = "_stakeUpgradeProposals";
                proposals[p].address = (await daoProvider._stakeUpgradeProposals(proposals[p].id)).substr(26, 40);
                info = (await daoProvider._stakeUpgradeProposals(proposals[p].id)).substr(2);
                base = -1;
                break;

            case 5:
                proposals[p].type = "DAOUpgrade";
                threshold = threshold.div(5).times(4);
                // mapping = "_daoUpgradeProposals";
                proposals[p].address = (await daoProvider._daoUpgradeProposals(proposals[p].id)).substr(26, 40);
                info = (await daoProvider._daoUpgradeProposals(proposals[p].id)).substr(2);
                base = 128;
                break;
        }

        // if (proposals[p].type != "Fund") {
        //     proposals[p].address = (await call(DAO_ADDRESS, mapping, [proposals[p].id])).substr(26, 40);
        // }

        threshold = threshold.plus(1);

        // let info = (
        //
        //     // await call(DAO_ADDRESS, mapping, [proposals[p].id])
        //     await daoProvider.
        //
        //
        // ).substr(2);
        if (base == -1) {
            proposals[p].info = "Unable to display proposal's info at this time.";
        } else {
            // Base currently points to the string length, yet that has problems with accurate usage
            // While it could be resolved with some debugging, skipping past it and removing trailing 0s works
            base += 64;
            proposals[p].info = ethers.toAscii(info.substr(base)).substr(0, 80);
            while (proposals[p].info.endsWith("\0")) {
                proposals[p].info = proposals[p].info.substr(0, proposals[p].info.length - 1);
            }
            if (/[^(a-zA-Z\d\s\/:.!@)]/.test(proposals[p].info)) {
                proposals[p].info = "Invalid info string.";
            }
        }

        proposals[p].voters = [];
        let added = await daoEvents(lastBlock, "ProposalVoteAdded", proposals[p].id);
        let removed = await daoEvents(lastBlock, "ProposalVoteRemoved", proposals[p].id);
        let addedBlock = {};
        let removedBlock = {};
        for (let event of added) {
            voter = "0x" + event.topics[2].substr(26, 40);
            proposals[p].voters.push(voter);
            addedBlock[voter] = parseInt(event.blockNumber);
        }
        for (let event of removed) {
            removedBlock["0x" + event.topics[2].substr(26, 40)] = parseInt(event.blockNumber);
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

        proposals[p].votes = new ethers.BigNumber(0);
        for (let voter of proposals[p].voters) {
            proposals[p].votes = proposals[p].votes.plus(new ethers.BigNumber(
                // await call(STAKE_ADDRESS, "staked", [voter]))
                await stakeProvider.staked(voter))
            );
        }
        proposals[p].completable = proposals[p].votes.gt(threshold);
        proposals[p].votes = formatAtomic(proposals[p].votes.toString(), 0);

        p++;
    }
    return proposals;
}
