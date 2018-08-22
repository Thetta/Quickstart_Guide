var CakeOrderingDapp = artifacts.require("./CakeOrderingDapp");
var MintableToken = artifacts.require("./MintableToken");

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(web3.BigNumber))
  .should();

contract('CakeOrderingDapp', (accounts) => {
	const creator = accounts[0];
	const acc1 = accounts[1];
	let cake;

	beforeEach(async()=> {
		cake = await CakeOrderingDapp.new();
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
