// HTML ELEMENTS
// NETWORK PROPOSAL COUNT
const vybeProposalCount = document.getElementById("vybe-proposal-count");

async function displayNetworkProposalCount() {
    const networkCount = await proposalsCount();
    const balance = await getDAOBalance();
    const formattedBalance = await formatValue(balance);
    vybeProposalCount.innerHTML = `Network Proposals: ${networkCount}`;

    tippy('#vybe-proposal-count', {
        content: `DAO Balance: ${formattedBalance}`,
    });
}

async function displayProposals() {
    // enable loading
    document.getElementById("proposals-loading").style.display = "block";
    // fetch active proposals
    activeProposals = await getActiveProposals();

    // process active proposals
    if (await proposalsCount() !== 0) {

        let activeTable = ``;
        let inactiveTable = ``;

        for (let proposal of activeProposals) {
            // filter out events that are improperly formatted or outdated
            if (!proposal) {
                continue;
            } else if (typeof proposal.type !== "string") {
                continue;
            }

            let displayRow = await buildProposalRow(proposal);

            if (proposal.meta.completed) {
                inactiveTable = inactiveTable + displayRow;
            } else {
                activeTable = activeTable + displayRow;
            }
        }

        // set table contents
        document.getElementById("proposals-table-body").innerHTML = activeTable + inactiveTable;
        addTooltips();

        // hide loading and make table visible
        document.getElementById("proposals-loading").style.display = "none";
        document.getElementById("proposals-table").style.display = "block";

    } else {
        // end loading and notify the user that there aren't any active proposals
        document.getElementById("proposals-loading").style.display = "none";
        document.getElementById("proposals-empty").style.display = "block";
    }
}

async function buildProposalRow(proposal) {
    const vybeValueFormatted = await formatValue(proposal.amount);
    const firstPartAddress = proposal.address.substring(0, 6);
    const lastPartAddress = proposal.address.slice(-4);
    const formattedAddress = firstPartAddress + `...` + lastPartAddress;
    let info = proposal.info;
    if (await isValidURL(info)) {
        info = `<a href="${info}">${info}</a>`;
    }

    // only display proposal actions relevant to user
    let buttons = ``;
    let progress = `<div class="progress">
                <div class="progress-bar bg-success" role="progressbar" style="width: ${proposal.votePercent}%" aria-valuenow="${proposal.votePercent}" aria-valuemin="0" aria-valuemax="100"></div>
            </div>`;

    if (proposal.meta.completed) {
        progress = `<div>Completed</div>`;

    } else if (proposal.completable) {
        // show complete proposal button
        buttons = `
        <div class="btn-group" role="group" aria-label="Vote Buttons">
            <button type="button" class="btn btn-gradient-success btn-rounded mr-1" onclick="complete(${proposal.id})" id="complete-${proposal.id}">Complete</button>
        </div>`;

    } else if (proposal.voters.includes(userAddress)) {
        // show unvote button
        buttons = `
        <div class="btn-group" role="group" aria-label="Vote Buttons">
            <button type="button" class="btn btn-gradient-danger btn-rounded" onclick="unvote(${proposal.id})" id="refuse-${proposal.id}">Refuse</button>
        </div>`;

    } else {
        // show vote button
        buttons = `
        <div class="btn-group" role="group" aria-label="Vote Buttons">
            <button type="button" class="btn btn-gradient-success btn-rounded mr-1" onclick="vote(${proposal.id})" id="approve-${proposal.id}">Approve</button>
        </div>`;

    }

    // return complete proposal row
    return `<tr>
      <td><a href="${contractData.explorer}/address/${proposal.address}">${formattedAddress}</a></td>
      <td>${proposal.type}</td>
      <td>${info}</td>
      <td id="proposal-value-${proposal.id}">${vybeValueFormatted} VYBE</td>
      <td id="progress-${proposal.id}">${progress}</td>
      <td>${buttons}</td>
    </tr>`;
}

async function addTooltips() {
    for (let proposal of activeProposals) {
        // filter out events that are improperly formatted or outdated
        if (!proposal) {
            continue;
        } else if (typeof proposal.type !== "string") {
            continue;
        } else if (proposal.meta.completed) {
            continue;
        }

        const ethValue = await formatValue(proposal.amount * vybeETH);
        const usdValue = await formatUSD(proposal.amount * vybeUSD);
        // create tooltip for proposal value
        tippy(`#proposal-value-${proposal.id}`, {
            content: `${ethValue} ETH / ${usdValue}`,
        });

        // create tooltip for vote progress
        const currentVotesFormatted = await formatValue(ethers.utils.formatUnits(proposal.votes, 18));
        const requiredVotesFormatted = await formatValue(ethers.utils.formatUnits(proposal.requiedVotes, 18));
        tippy(`#progress-${proposal.id}`, {
            allowHTML: true,
            content: `Current Vote: ${currentVotesFormatted} (${proposal.votePercent}%)<br>Required Vote: ${requiredVotesFormatted}`,
        });
    }
}
