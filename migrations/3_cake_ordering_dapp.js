var Deployer = artifacts.require("./Deployer.sol");

var StdDaoToken = artifacts.require("./StdDaoToken.sol");
var DaoStorage = artifacts.require("./DaoStorage.sol");
var DaoBase = artifacts.require("./DaoBase.sol");

module.exports = function(deployer, network, accounts) {
	return deployer.then(async () => {	
		let token = await StdDaoToken.new("CakeTokenb","CAKE",18, true, true, 1000000000);
		let store = await DaoStorage.new([token.address]);
		let daoBase = await DaoBase.new(store.address);

		await token.transferOwnership(daoBase.address);
		await store.transferOwnership(daoBase.address);

		let deployer = await Deployer.new();
		await daoBase.allowActionByAddress(await daoBase.MANAGE_GROUPS(), deployer.address);
		await deployer.deploy(daoBase.address, accounts[0], accounts[1], accounts[2]);
		
		await daoBase.renounceOwnership();
	});
};
