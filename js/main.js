let provider;
let signer;
let contractData;
let userAddress;
let vybeUSD;
let vybeETH;
let vybeContract;
let uniContract;
let stakeContract;
let daoContract;
let lastBlock;
let activeProposals;
let isStaking = true;
const overrideGasLimit = { gasLimit: 300000 };
const UINT256_MAX = "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF";

async function refreshStats() {
	if (typeof displayUserBalance === "function") {
		// user balance
		displayUserBalance();
		// user stake
		displayVybeStakeBalance();
		// network stats
		displayVybeNetworkStake();
		if (isStaking) {
			// rewards
			displayVybeRewardsBalance();
		}
	}

	if (typeof displayUserUNIBalance === "function") {
		// user balance
		displayUserUNIBalance();
		// user stake
		displayUNIStakeBalance();
		// network stats
		displayUNINetworkStake();
		if (isStaking) {
			// rewards
			displayVybeRewardsBalance();
		}
	}
}

async function init() {
	// enable ethereum
	await window.ethereum.enable();
	provider = new ethers.providers.Web3Provider(window.ethereum);
	signer = provider.getSigner();
	// get price data
	await getVYBEPriceData();
	// get user address
	userAddress = await signer.getAddress();
	contractData = await getVybeContractAddresses();
	vybeContract = new ethers.Contract(contractData.vybe, contractData.vybeABI, signer);
	uniContract = new ethers.Contract(contractData.uni, contractData.uniABI, signer);
	stakeContract = new ethers.Contract(contractData.stake, contractData.stakeABI, signer);
	daoContract = new ethers.Contract(contractData.dao, contractData.daoABI, signer);
	lastBlock = await provider.getBlockNumber() || 0;

	// attempt to load staking
	refreshStats();

	// load dao if on voting page
	if (typeof displayNetworkProposalCount === "function") {
		// load proposals
		await displayProposals();
		// proposal count
		await displayNetworkProposalCount();
	}
}

// initialize
init();
// refresh stats on changes
setInterval(refreshStats, 5000);
setInterval(getVYBEPriceData, 60 * 1000);
