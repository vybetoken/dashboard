async function getTotalStakedLP() {
	try {
		const staked = await stakeContract.totalLpStaked();
		return ethers.utils.formatUnits(staked, 18);
	} catch (err) {
		console.log(`Failed to determine total staked UNI-V2`);
		return ethers.utils.formatUnits(0, 18);
	}
}

async function getUNIBalance() {
	try {
		const balance = await uniContract.balanceOf(userAddress);
		return ethers.utils.formatUnits(balance, 18);
	} catch (err) {
		console.log(`Failed to determine UNI-V2 balance`);
		return ethers.utils.formatUnits(0, 18);
	}
}

async function getStakedUNI() {
	try {
		const staked = await stakeContract.lpBalanceOf(userAddress);
		return ethers.utils.formatUnits(staked, 18);
	} catch (err) {
		console.log(`Failed to determine UNI-V2 stake balance`);
		return ethers.utils.formatUnits(0, 18);
	}
}

async function getCurrentRewardsAmount() {
	try {
		const rewards = await stakeContract.calculateRewards(userAddress);
		return ethers.utils.formatUnits(rewards, 18);
	} catch {
		// fail silently
		isStaking = false;
		return ethers.utils.formatUnits(0, 18);
	}
}

async function increaseStake(amount) {
	amount = handleAmount(amount);
	if (!amount) {
		return false;
	}

	try {

		if (
			(ethers.BigNumber.from(amount)).gt(
				ethers.BigNumber.from(
					await uniContract.allowance(userAddress, contractData.stake)
				)
			)
		) {
			await uniContract.approve(contractData.stake, UINT256_MAX);
		}

		await stakeContract.increaseLpStake(amount, overrideGasLimit);
		successAlert("Stake Increased!");
		return true;

	} catch (err) {
		console.log(err);
		errorAlert("Stake increase failed!");
		return false
	}
}

async function decreaseStake(amount) {
	amount = handleAmount(amount);
	if (!amount) {
		return false;
	}

	try {
		await stakeContract.decreaseLpStake(amount, overrideGasLimit);
		successAlert("Stake Decreased!");
		return true;

	} catch (err) {
		console.log(err);
		errorAlert("Stake decrease failed!");
		return false
	}
}

async function claimRewards() {
	try {
		await stakeContract.claimLpRewards(overrideGasLimit);
		refreshStats();
		successAlert("Rewards Claimed!");
		return true;

	} catch (e) {
		console.log(`error: `, e);
		errorAlert("Reward claim failed!");
		return false;
	}
}
