function api(method, url, data) {
    data = data || {};
    var req = {
        method: method,
        headers: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        timeout: 2 * 1000
    };

    if (method === 'post') {
        req.body = objToQuery(data);
    }

    return fetch(url, req)
        .then(function(res) {
            return res.json().then(function(data) {
                return data;
            });
        })
}

async function getVYBEPriceData() {
    api('get', 'https://api.vybe.finance/api/data')
        .then((data) => {
            vybeUSD = new web3.BigNumber(data.usd);
            vybeETH = new web3.BigNumber(data.eth);
            if (typeof displayUserBalance === "function") {
                displayUserBalance();
                displayVybeStakeBalance();
                displayVybeRewardsBalance();
            }
    });
}

async function getVybeContractAddresses() {
	const VYBE_ABI = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}];

	const STAKE_ABI = [{"inputs":[{"internalType":"address","name":"vybe","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"melody","type":"address"}],"name":"MelodyAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"melody","type":"address"}],"name":"MelodyRemoved","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"staker","type":"address"},{"indexed":false,"internalType":"uint256","name":"mintage","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"developerFund","type":"uint256"}],"name":"Rewards","type":"event"},{"inputs":[{"internalType":"address","name":"melody","type":"address"}],"name":"addMelody","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"staker","type":"address"}],"name":"calculateRewards","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"claimRewards","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"decreaseStake","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"increaseStake","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"pause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"melody","type":"address"}],"name":"removeMelody","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"staker","type":"address"}],"name":"staked","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalStaked","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"unpause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owned","type":"address"},{"internalType":"address","name":"upgraded","type":"address"}],"name":"upgrade","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"fund","type":"address"}],"name":"upgradeDevelopmentFund","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"vybe","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"}];

    const DAO_ABI = [{"inputs":[{"internalType":"address","name":"stake","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint64","name":"proposal","type":"uint64"},{"indexed":false,"internalType":"address","name":"newDAO","type":"address"}],"name":"DAOUpgradeProposed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint64","name":"proposal","type":"uint64"},{"indexed":true,"internalType":"address","name":"destination","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"FundProposed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint64","name":"proposal","type":"uint64"},{"indexed":false,"internalType":"address","name":"melody","type":"address"}],"name":"MelodyAdditionProposed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint64","name":"proposal","type":"uint64"},{"indexed":false,"internalType":"address","name":"melody","type":"address"}],"name":"MelodyRemovalProposed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint64","name":"proposal","type":"uint64"}],"name":"NewProposal","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint64","name":"proposal","type":"uint64"}],"name":"ProposalPassed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint64","name":"proposal","type":"uint64"}],"name":"ProposalRemoved","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint64","name":"proposal","type":"uint64"},{"indexed":true,"internalType":"address","name":"staker","type":"address"}],"name":"ProposalVoteAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint64","name":"proposal","type":"uint64"},{"indexed":true,"internalType":"address","name":"staker","type":"address"}],"name":"ProposalVoteRemoved","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint64","name":"proposal","type":"uint64"},{"indexed":false,"internalType":"address","name":"newStake","type":"address"}],"name":"StakeUpgradeProposed","type":"event"},{"inputs":[{"internalType":"uint64","name":"","type":"uint64"}],"name":"_daoUpgradeProposals","outputs":[{"internalType":"address","name":"newDAO","type":"address"},{"internalType":"string","name":"info","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint64","name":"","type":"uint64"}],"name":"_fundProposals","outputs":[{"internalType":"address","name":"destination","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"string","name":"info","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint64","name":"","type":"uint64"}],"name":"_melodyAdditionProposals","outputs":[{"internalType":"address","name":"melody","type":"address"},{"internalType":"string","name":"info","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint64","name":"","type":"uint64"}],"name":"_melodyRemovalProposals","outputs":[{"internalType":"address","name":"melody","type":"address"},{"internalType":"string","name":"info","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint64","name":"","type":"uint64"}],"name":"_stakeUpgradeProposals","outputs":[{"internalType":"address","name":"newStake","type":"address"},{"internalType":"string","name":"info","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint64","name":"proposalID","type":"uint64"}],"name":"addVote","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint64","name":"proposalID","type":"uint64"},{"internalType":"address[]","name":"stakers","type":"address[]"}],"name":"completeProposal","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"forwardVYBE","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint64","name":"","type":"uint64"}],"name":"proposals","outputs":[{"internalType":"enum VybeDAO.ProposalType","name":"pType","type":"uint8"},{"internalType":"address","name":"creator","type":"address"},{"internalType":"uint256","name":"submitted","type":"uint256"},{"internalType":"bool","name":"completed","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newDAO","type":"address"},{"internalType":"string","name":"info","type":"string"}],"name":"proposeDAOUpgrade","outputs":[{"internalType":"uint64","name":"","type":"uint64"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"destination","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"string","name":"info","type":"string"}],"name":"proposeFund","outputs":[{"internalType":"uint64","name":"","type":"uint64"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"melody","type":"address"},{"internalType":"string","name":"info","type":"string"}],"name":"proposeMelodyAddition","outputs":[{"internalType":"uint64","name":"","type":"uint64"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"melody","type":"address"},{"internalType":"string","name":"info","type":"string"}],"name":"proposeMelodyRemoval","outputs":[{"internalType":"uint64","name":"","type":"uint64"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newStake","type":"address"},{"internalType":"address[]","name":"owned","type":"address[]"},{"internalType":"string","name":"info","type":"string"}],"name":"proposeStakeUpgrade","outputs":[{"internalType":"uint64","name":"","type":"uint64"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint64","name":"proposalID","type":"uint64"}],"name":"removeVote","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"stake","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"upgrade","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"upgraded","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint64","name":"","type":"uint64"},{"internalType":"address","name":"","type":"address"}],"name":"used","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint64","name":"proposalID","type":"uint64"}],"name":"withdrawProposal","outputs":[],"stateMutability":"nonpayable","type":"function"}];

	const MAIN_NET = {
        explorer: "https://etherscan.io",
		vybe: "0x3A1c1d1c06bE03cDDC4d3332F7C20e1B37c97CE9",
		vybeABI: VYBE_ABI,
		stake: "0x1Bcc32Ac1C994CE7e9526FbaF95f37AbC0B2EC39",
		stakeABI: STAKE_ABI,
        dao: "0x0aBcbddEAB37ad535Ffa1eDfA8af04731c317Be3",
        daoABI: DAO_ABI
	}

	const GOERLI_TEST_NET = {
        explorer: "https://goerli.etherscan.io",
		vybe: "0x0c272eF49bB983bDbD86DaC1c89759C9C331A308",
		vybeABI: VYBE_ABI,
		stake: "0x21a44231D24813F881c873C141aE6e157d7Ec14F",
		stakeABI: STAKE_ABI,
        dao: "0x6413fBB36C4990FDAEbf3c315b2f5140c828707F",
        daoABI: DAO_ABI
	}

	const networkInfo = await provider.getNetwork();

	if (networkInfo.chainId === 1) {
		return MAIN_NET;
	} else {
        // default to goerli test net if not main net
		return GOERLI_TEST_NET;
	}
}
