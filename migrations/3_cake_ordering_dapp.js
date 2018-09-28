var CakeOrderingDapp = artifacts.require("./CakeOrderingDapp.sol");

module.exports = function(deployer) {
  deployer.deploy(CakeOrderingDapp);
};
