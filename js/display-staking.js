// HTML ELEMENTS
// USER BALANCE
let vybeUserBalanceElement;
let usdUserBalanceElement;
let ethUserBalanceElement;

// STAKED BALANCE
const vybeStakedBalanceElement = document.getElementById("stake-balance-vybe");
const usdStakedBalanceElement = document.getElementById("stake-balance-usd");
const ethStakedBalanceElement = document.getElementById("stake-balance-eth");

// USER REWARDS
const vybeRewardsBalanceElement = document.getElementById("vybe-rewards-balance");
const usdRewardsBalanceElement = document.getElementById("vybe-rewards-balance-usd");
const ethRewardsBalanceElement = document.getElementById("vybe-rewards-balance-eth");

// NETWORK STAKE
const vybeNetworkStakeElement = document.getElementById("vybe-network-stake");

const migrate20Button = document.getElementById("migrate-20");
const mobileStakeButton = document.getElementById("mobile-stake-button");
const mobileStakeWithdrawButton = document.getElementById("mobile-stake-withdraw-button");

// USER BALANCE
async function displayUserBalance() {
	if (!vybeUserBalanceElement) {
		return;
	}
	const vybeBalance = await getVYBEBalance();
    vybeUserBalanceElement.innerHTML = await formatValue(vybeBalance);

    if (vybeUSD && vybeETH) {
        const usdBalance = await formatUSD(vybeBalance * vybeUSD);
        const ethBalance = await formatValue(vybeBalance * vybeETH);
        usdUserBalanceElement.innerHTML = `${ usdBalance } USD`;
        ethUserBalanceElement.innerHTML = `${ ethBalance } ETH`;
    }
}

// STAKED BALANCE
async function displayVybeStakeBalance() {
	const vybeStakeBalance = await getStakedVYBE();
    vybeStakedBalanceElement.innerHTML = await formatValue(vybeStakeBalance);

    if (vybeUSD && vybeETH) {
        const usdBalance = await formatUSD(vybeStakeBalance * vybeUSD);
        const ethBalance = await formatValue(vybeStakeBalance * vybeETH);
        usdStakedBalanceElement.innerHTML = `${ usdBalance } USD`;
        ethStakedBalanceElement.innerHTML = `${ ethBalance } ETH`;
    }
}

// USER REWARDS BALANCE
async function displayVybeRewardsBalance() {
	const vybeRewardsBalance = await getCurrentRewardsAmount();
	vybeRewardsBalanceElement.innerHTML = await formatValue(vybeRewardsBalance);

    if (vybeUSD && vybeETH) {
        const usdRewardsBalance = await formatUSD(vybeRewardsBalance * vybeUSD);
        const ethRewardsBalance = await formatValue(vybeRewardsBalance * vybeETH);
        usdRewardsBalanceElement.innerHTML = `${ usdRewardsBalance } USD`;
        ethRewardsBalanceElement.innerHTML = `${ ethRewardsBalance } ETH`;
    }
}

// NETWORK STATS
async function displayVybeNetworkStake() {
	const vybeStakeBalance = await getStakedVYBE();
	const vybeStakeBalanceFormatted = await formatValue(vybeStakeBalance);
	const totalStakedBalance = await getTotalStakedVYBE();
	const vybeStakeTotalBalanceFormatted = await formatValue(totalStakedBalance);
	const percent = (vybeStakeBalance / totalStakedBalance * 100).toFixed(4);

    vybeNetworkStakeElement.innerHTML = `Network Stake: ${vybeStakeTotalBalanceFormatted}`;
	tippy('#vybe-network-stake', {
	  content: `Your Stake: ${ vybeStakeBalanceFormatted } / ${ vybeStakeTotalBalanceFormatted } (${ percent }%)`,
	});
}

// MIGRATE 2.0
async function migrate20() {
	const legacyStakeABI = [{"inputs":[{"internalType":"address","name":"vybe","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"melody","type":"address"}],"name":"MelodyAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"melody","type":"address"}],"name":"MelodyRemoved","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"staker","type":"address"},{"indexed":false,"internalType":"uint256","name":"mintage","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"developerFund","type":"uint256"}],"name":"Rewards","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"staker","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"StakeDecreased","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"staker","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"StakeIncreased","type":"event"},{"inputs":[{"internalType":"address","name":"melody","type":"address"}],"name":"addMelody","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"staker","type":"address"}],"name":"calculateRewards","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"calculateSupplyDivisor","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"claimRewards","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"decreaseStake","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"increaseStake","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"staker","type":"address"}],"name":"lastClaim","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"previous","type":"address"},{"internalType":"address[]","name":"people","type":"address[]"},{"internalType":"uint256[]","name":"lastClaims","type":"uint256[]"}],"name":"migrate","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"melody","type":"address"}],"name":"removeMelody","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"staker","type":"address"}],"name":"staked","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalStaked","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owned","type":"address"},{"internalType":"address","name":"upgraded","type":"address"}],"name":"upgrade","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"fund","type":"address"}],"name":"upgradeDevelopmentFund","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"vybe","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"}];

	const oldStakeContract = new ethers.Contract(`0x1Bcc32Ac1C994CE7e9526FbaF95f37AbC0B2EC39`, legacyStakeABI, signer);
	const oldStakedBalance = await oldStakeContract.staked(userAddress);
	const migrated = await stakeContract.migratedFunds(userAddress);

	if (!oldStakedBalance.isZero() && !migrated) {
		// SHOW MIGRATE BUTTONS
		migrate20Button.innerHTML = `<div class="card"><div class="card-body"><h4 class="card-title">Migrate to Staking 2.0</h4><button type="button" class="btn btn-gradient-primary btn-rounded btn-fw" onclick="migrate()">Migrate</button></div></div>`;
		mobileStakeWithdrawButton.innerHTML = `<button type="button" class="btn btn-gradient-light btn-rounded btn-fw btn-mobile" onclick="migrate()">Migrate</button>`;

		// FORCE HIDE ACTIONS
		vybeStakedBalanceElement.innerHTML = `MIGRATE`;
		usdStakedBalanceElement.innerHTML = ``;
		ethStakedBalanceElement.innerHTML = ``;
		vybeRewardsBalanceElement.innerHTML = `MIGRATE`;
		usdRewardsBalanceElement.innerHTML = ``;
		ethRewardsBalanceElement.innerHTML = ``;
		document.getElementById("claim-button-mobile").innerHTML = ``;
		document.getElementById("claim-button").innerHTML = ``;

	} else {
		// DISPLAY FULL UI
		console.log(`Using Stake 2.0`);
		vybeUserBalanceElement = document.getElementById("user-balance-vybe");
		usdUserBalanceElement = document.getElementById("user-balance-usd");
		ethUserBalanceElement = document.getElementById("user-balance-eth");
		migrate20Button.innerHTML = `<div class="card"><div class="card-body"><h4 class="card-title">Withdraw Vybe Stake</h4><button type="button" class="btn btn-gradient-primary btn-rounded btn-fw" onclick="openStakeModal(false)">Withdraw</button></div></div>`;
		mobileStakeButton.innerHTML = `<button type="button" class="btn btn-gradient-light btn-rounded btn-fw btn-mobile" onclick="openStakeModal(true)">Stake</button>`;
		mobileStakeWithdrawButton.innerHTML = `<button type="button" class="btn btn-gradient-light btn-rounded btn-fw btn-mobile" onclick="openStakeModal(false)">Withdraw</button>`;

		// refresh stats on changes
		refreshStats();
		setInterval(refreshStats, 5000);
		setInterval(getVYBEPriceData, 60 * 1000);

	}
}
