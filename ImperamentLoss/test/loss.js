const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");

//https://github.com/stakewithus/defi-by-example/tree/main/uni-v3

const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F"
const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"

const DAI_WHALE = "0x97f991971a37D4Ca58064e6a98FC563F03A71E5c"
const USDC_WHALE = "0x97f991971a37D4Ca58064e6a98FC563F03A71E5c"

describe("UniswapExitPosition contract", function () {
  let instance;
  let accounts;
  let dai
  let usdc

  before(async () => {
    accounts = await ethers.getSigners(1)

    // const MyContract = await ethers.getContractFactory("UniswapExitPosition");
    // instance = await MyContract.attach(
    //   "0x495a9A432bCe84460C39C2dE63F9dd07d904519a" // The deployed contract address
    // );

    const UniswapExitPosition = await ethers.getContractFactory("UniswapExitPosition")

    instance = await UniswapExitPosition.deploy();
    await instance.deployed();

    dai = await ethers.getContractAt("IERC20", DAI)
    usdc = await ethers.getContractAt("IERC20", USDC)

    // Unlock DAI and USDC whales
    await network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [DAI_WHALE],
    })
    await network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [USDC_WHALE],
    })

    const daiWhale = await ethers.getSigner(DAI_WHALE)
    const usdcWhale = await ethers.getSigner(USDC_WHALE)

    // Send DAI and USDC to accounts[0]
    const daiAmount = 1000n * 10n ** 18n
    const usdcAmount = 1000n * 10n ** 6n

    expect(await dai.balanceOf(daiWhale.address)).to.gte(daiAmount)
    expect(await usdc.balanceOf(usdcWhale.address)).to.gte(usdcAmount)

    await dai.connect(daiWhale).transfer(accounts[0].address, daiAmount)
    await usdc.connect(usdcWhale).transfer(accounts[0].address, usdcAmount)

    console.log(`dai initial ${await dai.balanceOf(instance.address)}`)
    console.log(`usdc initial ${await usdc.balanceOf(instance.address)}`)

  })

  describe('Exit Position', () => {
    it('Should mint new token', async () => {
      const daiAmount = 100n * 10n ** 18n;
      const usdcAmount = 100n * 10n ** 6n;

      //await dai.connect(accounts[0]).transfer(instance.address, daiAmount);
      //await usdc.connect(accounts[0]).transfer(instance.address, usdcAmount);

      await dai.connect(accounts[0]).approve(instance.address, daiAmount)
      await usdc.connect(accounts[0]).approve(instance.address, usdcAmount)

      var tx = await instance.mintNewPosition();

      //console.log(tx);

    });
    it("Should exit position", async () => {
      const tokenId = await instance.tokenId();

      console.log("--- Exit Position ---");

      var daiBefore = await dai.balanceOf(accounts[0].address);
      var usdBefore = await usdc.balanceOf(accounts[0].address);

      var liquidityBefore = await instance.getLiquidity(tokenId);
  
      await instance.exitPosition(tokenId);

      var liquidityAfter = await instance.getLiquidity(tokenId);

      var daiAfter = await dai.balanceOf(accounts[0].address);
      var usdAfter = await usdc.balanceOf(accounts[0].address);

      console.log(`dai before ${daiBefore}`);
      console.log(`usdc before ${usdBefore}`);
      console.log(`dai ${daiAfter}`);
      console.log(`usdc ${usdAfter}`);
      console.log(`liquidity before ${liquidityBefore}`);
      console.log(`liquidity after ${liquidityAfter}`);

      
      expect(daiAfter).to.be.greaterThan(daiBefore);
      expect(usdAfter).to.be.greaterThan(usdBefore);
      expect(liquidityAfter).to.be.lessThan(liquidityBefore);
      expect(liquidityAfter).to.be.equal(0);
      

    })
  });


});