async function getTotalStakedVYBE() {
	const staked = await stakeProvider.totalStaked();
	return ethers.utils.formatUnits(staked, 18);
}

async function getVYBEBalance() {
	const balance = await vybeProvider.balanceOf(userAddress);
	return ethers.utils.formatUnits(balance, 18);
}

async function getVYBESupply() {
	const totalSupply = await vybeProvider.totalSupply();
	return ethers.utils.formatUnits(totalSupply, 18);
}

async function getStakedVYBE() {
	const staked = await stakeProvider.staked(userAddress);
	return ethers.utils.formatUnits(staked, 18);
}

async function getCurrentRewardsAmount() {
	const rewards = await stakeProvider.calculateRewards(userAddress);
	return ethers.utils.formatUnits(rewards, 18);
}

async function increaseStake(amount) {
	amount = handleAmount(amount);
	if (!amount) {
		return false;
	}

	await stakeSigner.increaseStake(amount);
    successAlert("Stake Increased!");
	return true;
}

async function decreaseStake(amount) {
	amount = handleAmount(amount);
	if (!amount) {
		return false;
	}

	await stakeSigner.decreaseStake(amount);
    successAlert("Stake Decreased!");
	return true;
}

async function claimRewards() {
	await stakeSigner.claimRewards();
    successAlert("Rewards Claimed!");
	refreshStats();
	return true;
}
