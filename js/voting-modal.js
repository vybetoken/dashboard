// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == document.getElementById("votingModal")) {
        closeVotingModal();
    }
}

// open voting modal
function openVotingModal() {
    document.getElementById("votingModal").style.display = "block";
}

// close voting modal
function closeVotingModal() {
    document.getElementById("votingModal").style.display = "none";
}

async function createDisplayProposal() {
    const proposalAmount = document.getElementById("proposal-amount").value;
    const proposalInfo = document.getElementById("proposalInfo").value;

    try {
        await proposeFund(proposalAmount, proposalInfo);
        closeVotingModal();
        successAlert("Proposal Submitted!");
        return false;
    } catch (err) {
        console.log(err);
        errorAlert("Propoal Creation Failed!");
        return false;
    }
}
