// HTML ELEMENTS
// USER BALANCE
const vybeUserBalanceElement = document.getElementById("user-balance-vybe");
const usdUserBalanceElement = document.getElementById("user-balance-usd");
const ethUserBalanceElement = document.getElementById("user-balance-eth");

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

// USER BALANCE
async function displayUserBalance() {
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
	const vybeStakeTotalBalance = await getTotalStakedVYBE();
	const vybeStakeTotalBalanceFormatted = await formatValue(vybeStakeTotalBalance);
	const percent = (vybeStakeBalance / vybeStakeTotalBalance * 100).toFixed(4);

    vybeNetworkStakeElement.innerHTML = `Network Stake: ${vybeStakeTotalBalanceFormatted}`;
	tippy('#vybe-network-stake', {
	  content: `Your Stake: ${ vybeStakeBalanceFormatted } / ${ vybeStakeTotalBalanceFormatted } (${ percent }%)`,
	});
}
