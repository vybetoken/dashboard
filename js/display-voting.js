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
    document.getElementById("proposals-loading").style.display = "block";
    activeProposals = await getActiveProposals();
    if (activeProposals.length !== 0) {
        let displayTable = ``;
        for (let proposal of activeProposals) {
            if (!proposal.type) {
                continue;
            }
            let displayRow = await buildProposalRow(proposal);
            const ethValue = await formatValue(proposal.amount * vybeETH);
            const usdValue = await formatUSD(proposal.amount * vybeUSD);
            displayTable = displayTable + displayRow;
            document.getElementById("proposals-table-body").innerHTML = displayTable;
            tippy(`#proposal-value-${proposal.id}`, {
                content: `${ethValue} ETH / ${usdValue}`,
            });
            const currentVotesFormatted = await formatValue(proposal.votes);
            const requiredVotesFormatted = await formatValue(proposal.requiedVotes);
            tippy(`#progress-${proposal.id}`, {
                content: `${currentVotesFormatted} / ${requiredVotesFormatted} (${proposal.votePercent}%)`,
            });
        }
        document.getElementById("proposals-loading").style.display = "none";
        document.getElementById("proposals-table").style.display = "block";
    } else {
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

    return `<tr>
      <td><a href="${contractData.explorer}/address/${proposal.address}">${formattedAddress}</a></td>
      <td>${proposal.type}</td>
      <td>${info}</td>
      <td id="proposal-value-${proposal.id}">${vybeValueFormatted} VYBE</td>
      <td>
        <div class="progress" id="progress-${proposal.id}">
            <div class="progress-bar bg-success" role="progressbar" style="width: ${proposal.votePercent}%" aria-valuenow="${proposal.votePercent}" aria-valuemin="0" aria-valuemax="100"></div>
        </div>
      </td>
      <td>
        <div class="btn-group" role="group" aria-label="Vote Buttons">
            <button type="button" class="btn btn-gradient-success btn-rounded mr-1" onclick="vote(${proposal.id})" id="approve-${proposal.id}">Approve</button>
            <button type="button" class="btn btn-gradient-danger btn-rounded" onclick="unvote(${proposal.id})" id="refuse-${proposal.id}">Refuse</button>
        </div>
      </td>
    </tr>`;
}
