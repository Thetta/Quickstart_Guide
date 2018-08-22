var CakeOrderingOrganizaion = artifacts.require("./CakeOrderingOrganizaion");
var MintableToken = artifacts.require("./MintableToken");

var StdDaoToken = artifacts.require("./StdDaoToken");
var DaoStorage = artifacts.require("./DaoStorage");
var DaoBase = artifacts.require("./DaoBase");

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(web3.BigNumber))
  .should();

contract('CakeOrderingOrganizaion', (accounts) => {
	const creator = accounts[0];
	const acc1 = accounts[1];
	let cake;

	beforeEach(async()=> {
		// create contracts
		token = await StdDaoToken.new("CakeTokenb","CAKE",18, true, true, 1000000000);
		store = await DaoStorage.new([token.address],{from: creator});
		daoBase = await DaoBase.new(store.address,{ from: creator });
		cake = await CakeOrderingOrganizaion.new(daoBase.address, token.address);

		const issueTokens = await daoBase.ISSUE_TOKENS();
		const buySomeCake = await cake.BUY_SOME_CAKE();

		// set permissions
		await daoBase.allowActionByAddress(issueTokens, cake.address);
		await daoBase.allowActionByAddress(creator, buySomeCake);

		// transfer ownership
		await token.transferOwnership(daoBase.address);
		await store.transferOwnership(daoBase.address);
		await daoBase.renounceOwnership();
	});

	describe('buySomeCake()', () => {
		it('should be callable by owner', async () => {
			await cake.buySomeCake().should.be.fulfilled;
		});

		it('should not be callable by non-owner', async () => {
			await cake.buySomeCake({from: acc1}).should.be.rejectedWith('revert');
		});

		it('should set x to 1', async () => {
			await cake.buySomeCake();
			assert.equal((await cake.x()).toNumber(10), 1);
		});

		it('should mint 100 tokens', async () => {
			await cake.buySomeCake();
			let cakeToken = MintableToken.at(await cake.cakeToken());
			assert.equal((await cakeToken.balanceOf(creator)).toNumber(10), 100);
		});
	});
});
