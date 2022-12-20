const UniswapExitPosition = artifacts.require('UniswapExitPosition.sol');

let tokenAddress = '0x4134aa5373acafc36337bf515713a943927b06e5' // Demo Token contract address

let toAddress = ''// where to send it

let fromAddress = '0x326C977E6efc84E512bB9C30f76E30c160eD06FB'// Your address

let contractABI = [{ 'constant': false, 'inputs': [ { 'name': '_to', 'type': 'address' }, { 'name': '_value', 'type': 'uint256' } ], 'name': 'transfer', 'outputs': [ { 'name': '', 'type': 'bool' } ], }]

const { expectRevert } = require('@openzeppelin/test-helpers');

contract('Uniswap Exit Position', ([owner, random_user]) => {
  let instance;
  let positionId = '47806'; /// Insert the psoition ID you would like to text with

  beforeEach(async () => {
    instance = await UniswapExitPosition.deployed();
  });

  context('Mint position', () => {
    it.only('Should mint new posistion', async () => {
      // await expectRevert(
      //   instance.mintNewPosition({ from: owner }),
      //   'Not the owner'
      // );

      var tx = await instance.mintNewPosition();
      console.log(tx);
    })
  })

  context('Exit Position', () => {
    it('Should not exit if not approved', async () => {
      console.log('Owner;;;')
      console.log(owner);
      var deposit = await instance.deposits(positionId);
      console.log(deposit[0]);
      await expectRevert(
        instance.exitPosition(positionId, { from: owner }),
        'Not the owner'
      );
    });

    it('Should not exit if not the owner', async () => {
      await expectRevert(
        instance.exitPosition(positionId, { from: owner }),
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