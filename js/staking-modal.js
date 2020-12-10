let depositModel;
let displayWithdrawWarning = false;

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == document.getElementById("stakeModal")) {
        closeStakeModal();
    }
}

// open stake modal
function openStakeModal(deposit) {
    document.getElementById("stakeModal").style.display = "block";

    if (deposit) {
        depositModel = true;
        document.getElementById("modal-title").innerHTML = "Deposit Vybe Stake";
        document.getElementById("modal-subtitle").innerHTML = "Enter the amount that you want to deposit into VybeStake";
        document.getElementById("modal-button").innerHTML = "Deposit";
    } else {
        depositModel = false;
        document.getElementById("modal-title").innerHTML = "Withdraw Vybe Stake";
        document.getElementById("modal-subtitle").innerHTML = "Enter the amount that you want to withdraw from VybeStake";
        document.getElementById("modal-button").innerHTML = "Withdraw";
    }
}

// close stake modal
function closeStakeModal() {
    document.getElementById("stakeModal").style.display = "none";
    document.getElementById("stake-rewards-warning").innerHTML = '';
    document.getElementById("stake-number").value = 0;
    displayWithdrawWarning = false;
}

async function updateStake() {
	const vybeStakeBalance = await formatValue(await getStakedVYBE());
	let stakeChange = document.getElementById("stake-number").value;

	if (stakeChange == 0) {
		return;
	}

	stakeChange = stakeChange.toString();

	if ((displayWithdrawWarning) || (vybeStakeBalance == 0)) {
		if (depositModel) {
			// increaseStake
			increaseStake(stakeChange);
            closeStakeModal();
		} else {
			// decreaseStake
			decreaseStake(stakeChange);
            closeStakeModal();
		}
	} else {
		displayWithdrawWarning = true;
		if (depositModel) {
			// increaseStake
			document.getElementById("stake-rewards-warning").innerHTML = `If you have rewards, increasing your stake will remove them. Would you like to proceed?`;
			document.getElementById("modal-button").innerHTML = "Confirm Deposit";
		} else {
			// decreaseStake
			document.getElementById("stake-rewards-warning").innerHTML = `If you have rewards, decreasing your stake will remove them. Would you like to proceed?`;
			document.getElementById("modal-button").innerHTML = "Confirm Withdraw";
		}
	}
}
