const provider = new ethers.providers.JsonRpcProvider(`https://eth.vybe.finance`);
const signer = (new ethers.providers.Web3Provider(window.ethereum)).getSigner();
let contractData;
let userAddress;
let vybeUSD;
let vybeETH;
let vybeSigner;
let vybeProvider;
let stakeSigner;
let stakeProvider;
let daoSigner;
let daoProvider;
let lastBlock;

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
	}
}

async function init() {
	userAddress = await signer.getAddress();
	contractData = await getVybeContractAddresses();
	vybeSigner = new ethers.Contract(contractData.vybe, contractData.vybeABI, signer);
	vybeProvider = new ethers.Contract(contractData.vybe, contractData.vybeABI, provider);
	stakeSigner = new ethers.Contract(contractData.stake, contractData.stakeABI, signer);
	stakeProvider = new ethers.Contract(contractData.stake, contractData.stakeABI, provider);
	daoSigner = new ethers.Contract(contractData.dao, contractData.daoABI, signer);
	daoProvider = new ethers.Contract(contractData.dao, contractData.daoABI, provider);
	lastBlock = await provider.getBlockNumber() || 0;
	await refreshStats();
}

// initialize
init();
// refresh stats on changes
setInterval(refreshStats, 5000);
