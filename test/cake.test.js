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
    let cakeToken;
    let store;
    let daoBase;
    let cake;
    beforeEach(async()=> {
        // create contracts
        cakeToken = await StdDaoToken.new("CakeTokenb","CAKE",18, true, true, 1000000000);
        store = await DaoStorage.new([cakeToken.address],{from: creator});
        daoBase = await DaoBase.new(store.address,{ from: creator });
        cake = await CakeOrderingOrganizaion.new(daoBase.address, cakeToken.address);

        const issueTokens = await daoBase.ISSUE_TOKENS();
        const buySomeCake = await cake.BUY_SOME_CAKE();
        const manage_groups = await daoBase.MANAGE_GROUPS()
        // set permissions
        await store.allowActionByAddress(manage_groups, cake.address);
        await store.allowActionByAddress(issueTokens, cake.address);
        await store.allowActionByAddress(buySomeCake, creator);        
        //transfer Ownership
        await cakeToken.transferOwnership(daoBase.address);
        await store.transferOwnership(daoBase.address);
        await daoBase.renounceOwnership();
    });

    describe('buySomeCake()', async () => {
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
            let balance = await cakeToken.balanceOf(creator);
            assert.equal(balance.toNumber(10), 100);
        });
    });
});