require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();
const { PRIVATE_KEY } = process.env;

/// https://github.com/daulathussain/defi-uniswap/blob/main/test/Liqudity.js
/// https://github.com/stakewithus/defi-by-example/tree/main/uni-v3

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.7.6",
    settings: {
      evmVersion: "istanbul",
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
  
  networks: {
    hardhat: {
      forking: {
        url: `https://eth-mainnet.g.alchemy.com/v2/AVgV_AgGM5kvIgQ_VRh2wshqWOy_p6U4`
      }
    }
    // goerli: {
    //   url: `https://goerli.infura.io/v3/840994ee89b5433e87463df368896c27`,
    //   accounts: [PRIVATE_KEY]
    // },
    // main: {
    //   url: `https://mainnet.infura.io/v3/ac1ea77d531044d0b1e0de2b2c073400`,
    //   accounts: [PRIVATE_KEY]
    // }
  }
};
