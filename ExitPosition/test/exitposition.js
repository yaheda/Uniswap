const UniswapExitPosition = artifacts.require('UniswapExitPosition.sol');

const { expectRevert } = require('@openzeppelin/test-helpers');

contract('Uniswap Exit Position', ([owner, random_user]) => {
  let instance;
  let positionId = '47806'; /// Insert the psoition ID you would like to text with

  beforeEach(async () => {
    instance = await UniswapExitPosition.deployed();
  });

  context('Exit Position', () => {
    it('Should not exit if not the owner', async () => {
      await expectRevert(
        instance.exitPosition(positionId, { from: random_user }),
        'Not the owner'
      );
    });

    it('Should exit position', async () => {

      var balanceBefore = await web3.eth.getBalance(owner);
      
      var tx = await instance.exitPosition(positionId, { 
        from: owner,
        gasPrice: 1
      });

      var deposit = await instance.deposits(positionId);
      assert(deposit[0] == owner);
      assert(deposit[1] == 0);

      var gas = web3.utils.toBN(tx.receipt.gasUsed);

      var balanceAfter = await web3.eth.getBalance(owner);

      var balanceResult = balanceBefore.eq(
        balanceAfter
          .add(gas)
        );
      
      assert(balanceResult == true);
    });
  })
});