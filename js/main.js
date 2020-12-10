const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
let contractData;
let userAddress;
let vybeUSD;
let vybeETH;
let vybeContract;
let stakeContract;
let daoContract;
let lastBlock;
let activeProposals;
const overrideGasLimit = { gasLimit: 300000 };
const UINT256_MAX = "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF";

async function refreshStats() {
	// pull price data
	getVYBEPriceData();
	if (typeof displayUserBalance === "function") {
		// user balance
		displayUserBalance();
		// user stake
		displayVybeStakeBalance();
		// network stats
		displayVybeNetworkStake();
		// rewards
		displayVybeRewardsBalance();
		// refresh stats on changes
		setInterval(refreshStats, 5000);
	}

	if (typeof displayNetworkProposalCount === "function") {
		// load proposals
		await displayProposals();
		// proposal count
		await displayNetworkProposalCount();
	}
}

async function init() {
	userAddress = await signer.getAddress();
	contractData = await getVybeContractAddresses();
	vybeContract = new ethers.Contract(contractData.vybe, contractData.vybeABI, signer);
	stakeContract = new ethers.Contract(contractData.stake, contractData.stakeABI, signer);
	daoContract = new ethers.Contract(contractData.dao, contractData.daoABI, signer);
	lastBlock = await provider.getBlockNumber() || 0;

	await refreshStats();
}

// initialize
init();
