var migrateLibs = require('@thetta/core/scripts/migrateLibs');

module.exports = function (deployer, network, accounts) {
	let additionalContracts = ["./Deployer"];
	return migrateLibs(artifacts, additionalContracts, deployer, network, accounts);
};
