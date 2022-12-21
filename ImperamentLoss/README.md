Exit Uniswap v3 liquidity pool when impermanent loss is greater than 50%.

The project is split into two parts.

1. The smart contract

Here we wrap Uniswap's V3 liquidity functions. When minting a new token the tokenID is stored in the smart contract for the purpose
of this exersise. This can be stored onchain or offchain, depends on the specific requirements really. To store them offchain you can do so by emiting an event in the smart contract and get the values.

Do note the contract needs to be approved in order to call TransHelper.safeTransferFrom.

Then when exiting the position we get all the liquity by calling nonfungiblePositionManager.decreaseLiquidity.

To wrap up we send the tokens back to the user by calling nonfungiblePositionManager.collect then transfering the amounts back to the wallet

To test:
npx hardhat test

2. The server

Here we have a cron job that pings our imperament loss function.

This function fetches token information from the subgraph and calulcates the imperament loss which is the difference between the current amounts in the pool and the amounts if the tokens were held. I'm using ethers.providers.AlchemyProvider but feel free to swap it with your desired provider. 

You'll need an .env file to store the following: <br/>
LOGGER_LEVEL='debug' <br/>
UNISWAP_GRAPH_URL='[the subgrapgh url]' <br/>
UNISWAP_POSITION_ID='[the position id]' <br/>
PRIVATE_KEY='[the wallet private key]' <br/>
CONTRACT_ADDRESS='[the smartcontract address]' <br/>
API_KEY='[alchemy api key]' <br/>
