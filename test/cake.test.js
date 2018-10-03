var CakeOrderingOrganizaion = artifacts.require("./CakeOrderingOrganizaion");
var MintableToken = artifacts.require("./MintableToken");

var StdDaoToken = artifacts.require("./StdDaoToken");
var DaoStorage = artifacts.require("./DaoStorage");
var DaoBase = artifacts.require("./DaoBase");
var Bakery = artifacts.require("./Bakery");

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(web3.BigNumber))
  .should();

contract('CakeOrderingOrganizaion', (accounts) => {
	const creator = accounts[0];
	const user1 = accounts[1];
	const user2 = accounts[2];
	const user3 = accounts[3];
	let cakeOrderingDAO;
	let token;
	let store;
	let daoBase;
	let bakery;

	beforeEach(async()=> {
		// create contracts
		token = await StdDaoToken.new("CakeTokenb","CAKE",18, true, true, 1000000000);
		store = await DaoStorage.new([token.address],{from: creator});
		daoBase = await DaoBase.new(store.address,{ from: creator });
		bakery = await Bakery.new();
		cakeOrderingDAO = await CakeOrderingOrganizaion.new(bakery.address, daoBase.address);

		const issueTokens = await daoBase.ISSUE_TOKENS();
		const manageGroups = await daoBase.MANAGE_GROUPS();
		const buySomeCake = await cakeOrderingDAO.BUY_SOME_CAKE();

		// // // transfer ownership		
		await token.transferOwnership(daoBase.address);
		await store.transferOwnership(daoBase.address);

		// // // set permissions
		await daoBase.allowActionByAddress(manageGroups, cakeOrderingDAO.address);
		await cakeOrderingDAO.setPermissions(creator, user3);
		await daoBase.allowActionByAddress(issueTokens, cakeOrderingDAO.address);
		await daoBase.allowActionByAddress(buySomeCake, creator);
		await daoBase.allowActionByAddress(buySomeCake, user2);
		await daoBase.allowActionByAddress(issueTokens, cakeOrderingDAO.address);

		await daoBase.renounceOwnership();
	});

	describe('buySomeCake()', () => {
		it('should be callable by owner', async () => {
			await cakeOrderingDAO.buySomeCake().should.be.fulfilled;
		});

		it('should not be callable by non-owner', async () => {
			await cakeOrderingDAO.buySomeCake({from: user1}).should.be.rejectedWith('revert');
		});

		it('should increase cakesOrdered', async () => {
			await cakeOrderingDAO.buySomeCake();
			assert.equal((await bakery.cakesOrdered()).toNumber(10), 1);
		});

		it('should increase cakesOrdered two times', async () => {
			await cakeOrderingDAO.buySomeCake();
			await cakeOrderingDAO.buySomeCake({from: user2});
			assert.equal((await bakery.cakesOrdered()).toNumber(10), 2);			
		});		

		it('should produce cake', async () => {
			await cakeOrderingDAO.buySomeCake();
			assert.equal((await bakery.isCakeProducedForAddress(creator)), true);
		});	
	});
});
