async function getTotalStakedVYBE() {
	try {
		const staked = await stakeContract.totalStaked();
		return ethers.utils.formatUnits(staked, 18);
	} catch (err) {
		console.log(`Failed to determine total staked vybe`);
		return ethers.utils.formatUnits(0, 18);
	}
}

async function getVYBEBalance() {
	try {
		const balance = await vybeContract.balanceOf(userAddress);
		return ethers.utils.formatUnits(balance, 18);
	} catch (err) {
		console.log(`Failed to determine vybe balance`);
		return ethers.utils.formatUnits(0, 18);
	}
}

async function getVYBESupply() {
	try {
		const totalSupply = await vybeContract.totalSupply();
		return ethers.utils.formatUnits(totalSupply, 18);
	} catch (err) {
		console.log(`Failed to determine Vybe total supply`);
		return ethers.utils.formatUnits(0, 18);
	}
}

async function getStakedVYBE() {
	try {
		const staked = await stakeContract.staked(userAddress);
		return ethers.utils.formatUnits(staked, 18);
	} catch (err) {
		console.log(`Failed to determine vybe stake balance`);
		return ethers.utils.formatUnits(0, 18);
	}
}

async function getCurrentRewardsAmount() {
	try {
		const rewards = await stakeContract.calculateRewards(userAddress, overrideGasLimit);
		return ethers.utils.formatUnits(rewards, 18);
	} catch {
		// fail silently
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
					await vybeContract.allowance(userAddress, contractData.stake)
				)
			)
		) {
			await vybeContract.approve(contractData.stake, UINT256_MAX);
		}

		await stakeContract.increaseStake(amount);
		successAlert("Stake Increased!");
		return true;

	} catch (err) {
		console.log(err);
		return false
	}
}

async function decreaseStake(amount) {
	amount = handleAmount(amount);
	if (!amount) {
		return false;
	}

	try {
		await stakeContract.decreaseStake(amount);
		successAlert("Stake Decreased!");
		return true;

	} catch (err) {
		console.log(err);
		return false
	}
}

async function claimRewards() {
	try {
		await stakeContract.claimRewards();
		refreshStats();
		successAlert("Rewards Claimed!");
		return true;

	} catch (e) {
		console.log(`error: `, e);
		return false;
	}
}
