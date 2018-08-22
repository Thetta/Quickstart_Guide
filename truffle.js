const HDWalletProvider = require("truffle-hdwallet-provider");

const INFURA_API_KEY = "915933c8c46046169e9afadaac265823";
const MNEMONIC = "old deny elevator federal rib history bird squeeze emerge list multiply success";

require('dotenv').config();

module.exports = {
	networks: {
		development: {
			host: "localhost",
			port: 8555,
			network_id: "*",
			gas: 100000000
		},

		main: {
			provider: () => new HDWalletProvider(MNEMONIC, "https://mainnet.infura.io/v3/" + INFURA_API_KEY),
			network_id: 1
		},
		ropsten: {
			provider: () => new HDWalletProvider(MNEMONIC, "https://ropsten.infura.io/v3/" + INFURA_API_KEY),
			network_id: 3
		},
		kovan: {
			provider: () => new HDWalletProvider(MNEMONIC, "https://kovan.infura.io/v3/" + INFURA_API_KEY),
			network_id: 42
		},
		rinkeby: {
			provider: () => new HDWalletProvider(MNEMONIC, "https://rinkeby.infura.io/v3/" + INFURA_API_KEY),
			network_id: 4
		}
	}
};
