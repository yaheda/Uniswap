async function main() {
  const [deployer] = await ethers.getSigners();
  
  console.log("Deploying contracts with the account:", deployer.address);

  const Token = await ethers.getContractFactory("UniswapExitPosition");
  const token = await Token.deploy();

  console.log("UniswapExitPosition address:", token.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });