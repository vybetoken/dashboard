// HTML ELEMENTS
// USER BALANCE
const uniUserBalanceElement = document.getElementById("user-balance-uni");

// STAKED BALANCE
const uniStakedBalanceElement = document.getElementById("stake-balance-uni");

// USER REWARDS
const vybeRewardsBalanceElement = document.getElementById("vybe-rewards-balance");

// NETWORK STAKE
const uniNetworkStakeElement = document.getElementById("uni-network-stake");

// USER BALANCE
async function displayUserUNIBalance() {
	const uniBalance = await getUNIBalance();
    uniUserBalanceElement.innerHTML = await formatValue(uniBalance);
}

// STAKED BALANCE
async function displayUNIStakeBalance() {
	const uniStakeBalance = await getStakedUNI();
    uniStakedBalanceElement.innerHTML = await formatValue(uniStakeBalance);
}

// USER REWARDS BALANCE
async function displayVybeRewardsBalance() {
	// const vybeRewardsBalance = await getCurrentRewardsAmount();
    vybeRewardsBalanceElement.innerHTML = `-`;//await formatValue(vybeRewardsBalance);
}

// NETWORK STATS
async function displayUNINetworkStake() {
	const uniStakeBalance = await getStakedUNI();
	const uniStakeBalanceFormatted = await formatValue(uniStakeBalance);
	const totalStakedBalance = await getTotalStakedLP();
	const uniStakeTotalBalanceFormatted = await formatValue(totalStakedBalance);
	const percent = (uniStakeBalance / totalStakedBalance * 100).toFixed(4);

    uniNetworkStakeElement.innerHTML = `Network Stake: ${uniStakeTotalBalanceFormatted}`;

	tippy('#uni-network-stake', {
	  content: `Your Stake: ${ uniStakeBalanceFormatted } / ${ uniStakeTotalBalanceFormatted } (${ percent }%)`,
	});
}
