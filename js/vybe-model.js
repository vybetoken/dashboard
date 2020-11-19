let depositModel;
let displayWithdrawWarning = false;

// open stake modal
function openStakeModal(deposit) {
    document.getElementById("stakeModal").style.display = "block";

    if (deposit) {
        depositModel = true;
        document.getElementById("stake-modal-title").innerHTML = "Deposit Vybe Stake";
        document.getElementById("stake-modal-subtitle").innerHTML = "Enter the amount that you want to deposit into VybeStake";
        document.getElementById("stake-modal-button").innerHTML = "Deposit";
    } else {
        depositModel = false;
        document.getElementById("stake-modal-title").innerHTML = "Withdraw Vybe Stake";
        document.getElementById("stake-modal-subtitle").innerHTML = "Enter the amount that you want to withdraw from VybeStake";
        document.getElementById("stake-modal-button").innerHTML = "Withdraw";
    }
}

// close stake modal
function closeStakeModal() {
    document.getElementById("stakeModal").style.display = "none";
}

// open voting modal
function openVotingModal() {
    document.getElementById("votingModal").style.display = "block";
}

// close voting modal
function closeVotingModal() {
    document.getElementById("votingModal").style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == document.getElementById("stakeModal")) {
        document.getElementById("stakeModal").style.display = "none";
    }
    if (event.target == document.getElementById("votingModal")) {
        document.getElementById("votingModal").style.display = "none";
    }
}
