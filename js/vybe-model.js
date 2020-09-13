let depositModel;
let displayWithdrawWarning = false;

// open the modal
function openStakeModal(deposit) {
    document.getElementById("stakeModal").style.display = "block";

    if (deposit) {
        depositModel = true;
        document.getElementById("modal-title").innerHTML = "Deposit Vybe Stake";
        document.getElementById("model-subtitle").innerHTML = "Enter the amount that you want to deposit into VybeStake";
        document.getElementById("model-button").innerHTML = "Deposit";
    } else {
        depositModel = false;
        document.getElementById("modal-title").innerHTML = "Withdraw Vybe Stake";
        document.getElementById("model-subtitle").innerHTML = "Enter the amount that you want to withdraw from VybeStake";
        document.getElementById("model-button").innerHTML = "Withdraw";
    }
}

// close the modal
function closeModal() {
    document.getElementById("stakeModal").style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == document.getElementById("stakeModal")) {
        document.getElementById("stakeModal").style.display = "none";
    }
}
