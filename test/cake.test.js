var CakeOrderingOrganizaion = artifacts.require("./CakeOrderingOrganizaion");
var Bakery = artifacts.require("./Bakery");

var StdDaoToken = artifacts.require("./StdDaoToken");
var DaoStorage = artifacts.require("./DaoStorage");
var DaoBase = artifacts.require("./DaoBase");
var Deployer = artifacts.require("./Deployer");

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
		let token = await StdDaoToken.new("CakeTokenb","CAKE",18, true, true, 1000000000);
		let store = await DaoStorage.new([token.address]);
		let daoBase = await DaoBase.new(store.address);

		await token.transferOwnership(daoBase.address);
		await store.transferOwnership(daoBase.address);

		let deployer = await Deployer.new();
		await daoBase.allowActionByAddress(await daoBase.MANAGE_GROUPS(), deployer.address);
		await deployer.deploy(daoBase.address, accounts[0], accounts[2], accounts[3]);
		
		await daoBase.renounceOwnership();

		cakeOrderingDAO = CakeOrderingOrganizaion.at(await deployer.cakeOrderingOrganizaion());
		bakery = Bakery.at(await deployer.bakery());
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
