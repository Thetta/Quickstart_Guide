var CakeOrderingDapp = artifacts.require("./CakeOrderingDapp.sol");
var CakeOrderingOrganizaion = artifacts.require("./CakeOrderingOrganizaion.sol");
var DaoBaseLib = artifacts.require("./DaoBaseLib");
var DaoBase = artifacts.require("./DaoBase");
var DaoStorage = artifacts.require("./DaoStorage");
var StdDaoToken = artifacts.require("./StdDaoToken");
var token, repToken, store, daoBase, cakeOrderingOrganizaion;

module.exports = function (deployer, network, accounts) { 
	deployer.then(function() {
		return StdDaoToken.new('cakeToken', 'ROBO', 18, true, true, 1000000000);
	}).then(function(instance) {
		token = instance;
		return StdDaoToken.new('repToken', 'REP', 18, true, true, 1000000000);
	}).then(function(instance) {
		repToken = instance;
		return DaoStorage.new([token.address, repToken.address]);
	}).then(function(instance) {
		store = instance;
		return DaoBase.new(store.address);
	}).then(function(instance) {
		daoBase = instance;
		return CakeOrderingOrganizaion.new(daoBase.address, token.address);
	}).then(function(instance) {
		cakeOrderingOrganizaion = instance;		
		store.allowActionByAddress(manage_groups, cakeOrderingOrganizaion.address);
	}).then(function() {
		store.allowActionByAddress(issueTokens, cakeOrderingOrganizaion.address);
	}).then(function() {
		store.allowActionByAddress(buySomeCake, creator);        
	}).then(function() {
		token.transferOwnership(cakeOrderingOrganizaion.address);
	}).then(function() {	
		repToken.transferOwnership(cakeOrderingOrganizaion.address);
	}).then(function() {
		store.transferOwnership(cakeOrderingOrganizaion.address);
	}).then(function() {
		daoBase.renounceOwnership();
	})
};
