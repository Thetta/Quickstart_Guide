
var ImpersonationCaller = artifacts.require("./ImpersonationCaller");
var DaoBaseImpersonated = artifacts.require("./DaoBaseImpersonated");
var DaoBaseLib = artifacts.require("./DaoBaseLib");
var DaoBase = artifacts.require("./DaoBase");
var DaoBaseWithUnpackers = artifacts.require("./DaoBaseWithUnpackers");
var DaoBaseWithUnpackersMock = artifacts.require("./DaoBaseWithUnpackersMock");
var DaoBaseMock = artifacts.require("./DaoBaseMock");

module.exports = function (deployer) {
	deployer.deploy(DaoBaseLib).then(() => {
		deployer.link(DaoBaseLib, ImpersonationCaller);
		deployer.link(DaoBaseLib, DaoBaseImpersonated);
		deployer.link(DaoBaseLib, DaoBase);
		deployer.link(DaoBaseLib, DaoBaseWithUnpackers);
		deployer.link(DaoBaseLib, DaoBaseWithUnpackersMock);
		deployer.link(DaoBaseLib, DaoBaseMock);	
	});
};

