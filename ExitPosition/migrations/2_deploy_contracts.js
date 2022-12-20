const UniswapExitPosition = artifacts.require("UniswapExitPosition");

module.exports = function(deployer) {
  deployer.deploy(UniswapExitPosition);
};
