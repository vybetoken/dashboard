const VYBE_ABI = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}];

const STAKE_ABI = [{"inputs":[{"internalType":"address","name":"vybe","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"melody","type":"address"}],"name":"MelodyAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"melody","type":"address"}],"name":"MelodyRemoved","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"staker","type":"address"},{"indexed":false,"internalType":"uint256","name":"mintage","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"developerFund","type":"uint256"}],"name":"Rewards","type":"event"},{"inputs":[{"internalType":"address","name":"melody","type":"address"}],"name":"addMelody","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"staker","type":"address"}],"name":"calculateRewards","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"claimRewards","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"decreaseStake","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"increaseStake","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"pause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"melody","type":"address"}],"name":"removeMelody","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"staker","type":"address"}],"name":"staked","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalStaked","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"unpause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owned","type":"address"},{"internalType":"address","name":"upgraded","type":"address"}],"name":"upgrade","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"fund","type":"address"}],"name":"upgradeDevelopmentFund","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"vybe","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"}];

// RINKEBY NET
// const STAKE_ADDRESS = "0x62c042d223672cC4ada228D23CF64b8BBf880cEC";
// const VYBE_ADDRESS = "0xCAc4d8687Ebcc2470041F56a3586D67F56255369";

// MAIN NET
const VYBE_ADDRESS = "0x3A1c1d1c06bE03cDDC4d3332F7C20e1B37c97CE9";
const STAKE_ADDRESS = "0x1Bcc32Ac1C994CE7e9526FbaF95f37AbC0B2EC39";

let vybeUSD;
let vybeETH;

window.addEventListener("load", async () => {
	if (window.ethereum) {
		const web3 = new Web3(window.ethereum);
		try {
			await window.ethereum.enable();
			return web3;
		} catch (e) {
			console.error(e);
		}
	} else {
		alert("This site requires an up-to-date MetaMask or another service enabling Web3 to work.")
	}
});

async function vybeCall(method, args) {
	if (!Array.isArray(args)) {
		args = [];
	}

	return await ethereum.request({
		method: "eth_call",
		params: [{
			to: VYBE_ADDRESS,
			from: ethereum.selectedAddress,
			data: web3.eth.contract(VYBE_ABI).at(VYBE_ADDRESS)[method].getData(...args)
		}]
	});
};

async function vybeTx(method, args) {
	if (!Array.isArray(args)) {
		args = [];
	}

	return await ethereum.request({
		method: "eth_sendTransaction",
		params: [{
			to: VYBE_ADDRESS,
			from: ethereum.selectedAddress,
			data: web3.eth.contract(VYBE_ABI).at(VYBE_ADDRESS)[method].getData(...args)
		}]
	});
};

async function stakeCall(method, args) {
	if (!Array.isArray(args)) {
		args = [];
	}

	return await ethereum.request({
		method: "eth_call",
		params: [{
			to: STAKE_ADDRESS,
			from: ethereum.selectedAddress,
			data: web3.eth.contract(STAKE_ABI).at(STAKE_ADDRESS)[method].getData(...args)
		}]
	});
};

async function stakeTx(method, args) {
	if (!Array.isArray(args)) {
		args = [];
	}

	return await ethereum.request({
		method: "eth_sendTransaction",
		params: [{
			to: STAKE_ADDRESS,
			from: ethereum.selectedAddress,
			data: web3.eth.contract(STAKE_ABI).at(STAKE_ADDRESS)[method].getData(...args),
			gas: "0x30000"
		}]
	});
};

function formatAtomic(value, decimals) {
    if ((value.length == 0) || (value == "0x")) {
        value = "0x0";
    }
	value = (new web3.BigNumber(value)).toString(10, 19);
	while (value.length < 19) {
		value = "0" + value;
	}
	let left = "";
	while (value.length > 18) {
		left += value[0];
		value = value.substr(1);
	}
	value = value.substr(0, decimals);

	if (left.length == 0) {
		left = "0";
	}
	result = left;
	if (value.length != 0) {
		result += "." + value;
	}
	return result;
}


async function getTotalStakedVYBE() {
	return formatAtomic(await stakeCall("totalStaked"), 0);
}

async function getVYBEBalance() {
	return formatAtomic(await vybeCall("balanceOf", [ethereum.selectedAddress]), 4);
}

async function getVYBESupply() {
	return formatAtomic(await vybeCall("totalSupply"), 0);
}

async function getStakedVYBE() {
	return formatAtomic(await stakeCall("staked", [ethereum.selectedAddress]), 0);
}

async function getCurrentRewardsAmount() {
	return formatAtomic(await stakeCall("calculateRewards", [ethereum.selectedAddress]), 4);
}

function handleAmount(amount) {
	if (amount.indexOf(".") != -1) {
		return false;
	}
	for (var i = 0; i < 18; i++) {
		amount += "0";
	}
	return amount;
}

async function increaseStake(amount) {
	amount = handleAmount(amount);
	if (!amount) {
		return false;
	}

	try {
		const UINT256_MAX = "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF";
		if ((new web3.BigNumber(amount)).gt(
				new web3.BigNumber(await vybeCall("allowance", [ethereum.selectedAddress, STAKE_ADDRESS]))
			)) {
			await vybeTx("approve", [STAKE_ADDRESS, UINT256_MAX]);
		}
		await stakeTx("increaseStake", [amount]);
	} catch (e) {
		console.log(e);
        errorAlert("Stake Update Failed!");
		return false;
	}

    successAlert("Stake Increased!");
	document.getElementById("vybe-stake").value = 0;
	return true;
}

async function decreaseStake(amount) {
	amount = handleAmount(amount);
	if (!amount) {
		return false;
	}

	try {
		await stakeTx("decreaseStake", [amount]);
	} catch (e) {
        errorAlert("Stake Update Failed!");
		return false;
	}

    successAlert("Stake Decreased!");
	document.getElementById("vybe-stake").value = 0;
	return true;
}

async function claimRewards() {
	try {
		await stakeTx("claimRewards");
	} catch (e) {
        errorAlert("Rewards Claim Failed!");
		return false;
	}

    successAlert("Rewards Claimed!");
	refreshStats();
	return true;
}

async function getVYBEPriceUSD() {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var res = JSON.parse(this.responseText);
			vybeUSD = new web3.BigNumber(res.vybe.usd);
			displayVybeUSDValue();
			displayStakedUSDValue();
			displayVybeRewardsUSDBalance();
		}
	};
	xmlhttp.open('GET', 'https://api.coingecko.com/api/v3/simple/price?ids=VYBE&vs_currencies=usd', true);
	xmlhttp.send();
}

async function getVYBEPriceETH() {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var res = JSON.parse(this.responseText);
			vybeETH = new web3.BigNumber(res.vybe.eth);
			displayVybeETHValue();
			displayStakedETHValue();
			displayVybeRewardsETHBalance();
		}
	};
	xmlhttp.open('GET', 'https://api.coingecko.com/api/v3/simple/price?ids=VYBE&vs_currencies=eth', true);
	xmlhttp.send();
}

// USER BALANCE
async function displayVybeBalance() {
	let vybeBalance = await getVYBEBalance();
	$('#user-balance-vybe').text(formatValue(vybeBalance));
	// document.getElementById("user-balance-vybe").innerHTML = vybeBalance;
}

async function displayVybeUSDValue() {
	const vybeBalance = await getVYBEBalance();
	const usdBalance = formatUSD(vybeBalance * vybeUSD);
	document.getElementById("user-balance-usd").innerHTML = `${ usdBalance } USD`;
}

async function displayVybeETHValue() {
	const vybeBalance = await getVYBEBalance();
	const ethBalance = formatValue(vybeBalance * vybeETH);
	document.getElementById("user-balance-eth").innerHTML = `${ ethBalance } ETH`;
}

// STAKED BALANCE
async function displayVybeStakeBalance() {
	let vybeStakeBalance = await getStakedVYBE();
	vybeStakeBalance = formatValue(vybeStakeBalance);
	document.getElementById("stake-balance-vybe").innerHTML = vybeStakeBalance;
}

async function displayStakedUSDValue() {
	const vybeStakeBalance = await getStakedVYBE();
	const usdBalance = await formatUSD(vybeStakeBalance * vybeUSD);
	document.getElementById("stake-balance-usd").innerHTML = `${ usdBalance } USD`;
}

async function displayStakedETHValue() {
	const vybeStakeBalance = await getStakedVYBE();
	const ethBalance = formatValue(vybeStakeBalance * vybeETH);
	document.getElementById("stake-balance-eth").innerHTML = `${ ethBalance } ETH`;
}

// USER REWARDS BALANCE
async function displayVybeRewardsBalance() {
	let vybeRewardsBalance = await getCurrentRewardsAmount();
	vybeRewardsBalance = formatValue(vybeRewardsBalance);
	document.getElementById("vybe-rewards-balance").innerHTML = vybeRewardsBalance;
}

async function displayVybeRewardsUSDBalance() {
	let vybeRewardsBalance = await getCurrentRewardsAmount();
	vybeRewardsBalance = await formatUSD(vybeRewardsBalance * vybeUSD);
	document.getElementById("vybe-rewards-balance-usd").innerHTML = `${ vybeRewardsBalance } USD`;
}

async function displayVybeRewardsETHBalance() {
	let vybeRewardsBalance = await getCurrentRewardsAmount();
	vybeRewardsBalance = formatValue(vybeRewardsBalance * vybeETH);
	document.getElementById("vybe-rewards-balance-eth").innerHTML = `${ vybeRewardsBalance } ETH`;
}

// NETWORK STATS
async function displayVybeNetworkStake() {
	let vybeStakeBalance = await getTotalStakedVYBE();
	vybeStakeBalance = formatValue(vybeStakeBalance);
	document.getElementById("vybe-network-stake").innerHTML = `Global Staked: ${vybeStakeBalance}`;
}

async function updateStake() {
	const vybeStakeBalance = formatValue(await getStakedVYBE());
	let stakeChange = document.getElementById("vybe-stake").value;

	if (stakeChange == 0) {
		return;
	}

	stakeChange = stakeChange.toString();

	if ((displayWithdrawWarning) || (vybeStakeBalance == 0)) {
		if (depositModel) {
			// increaseStake
			closeModal();
			increaseStake(stakeChange);
		} else {
			// decreaseStake
			closeModal();
			decreaseStake(stakeChange);
		}
	} else {
		displayWithdrawWarning = true;
		if (depositModel) {
			// increaseStake
			document.getElementById("vybe-stake-rewards-warning").innerHTML = `Please claim your rewards before you deposit into staking`;
			document.getElementById("model-button").innerHTML = "Confirm Deposit";
		} else {
			// decreaseStake
			document.getElementById("vybe-stake-rewards-warning").innerHTML = `Please claim your rewards before you withdraw from staking`;
			document.getElementById("model-button").innerHTML = "Confirm Withdraw";
		}
	}
}


async function refreshStats() {
	// user balance
	displayVybeBalance();
	displayVybeStakeBalance();
	// rewards
	displayVybeRewardsBalance();
	// network stats
	displayVybeNetworkStake();

	// pull coingecko
	getVYBEPriceUSD();
	getVYBEPriceETH();
}

setInterval(function () {
	refreshStats();
}, 1000);

function formatValue(value) {
	return currency(value, {
		separator: ','
	}).format().replace('$', '');
}

async function formatUSD(value) {
	return currency(value, {
		separator: ','
	}).format();
}

async function successAlert(text) {
    Toastify({
        text: text,
        gravity: "top",
        destination: `https://etherscan.io/txsPending?a=${ethereum.selectedAddress}`,
        newWindow: true,
        position: "left",
        backgroundColor: "#fe7c96",
        duration: 3000
    }).showToast();
}

async function errorAlert(text) {
    Toastify({
        text: text,
        gravity: "top",
        position: "left",
        backgroundColor: "#fe7c96",
        duration: 3000
    }).showToast();
}

async function onlyNumbers(num){
   if ( /[^0-9]+/.test(num.value) ){
      num.value = num.value.replace(/[^0-9]*/g,"")
   }
}
