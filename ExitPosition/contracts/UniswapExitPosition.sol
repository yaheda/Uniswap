// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@uniswap/v3-periphery/contracts/interfaces/INonfungiblePositionManager.sol";

contract UniswapExitPosition {

  function exitPosition(uint256 tokenId) external returns (uint256 amount0, uint256 amount1) {
        // caller must be the owner of the NFT
        require(msg.sender == deposits[tokenId].owner, 'Not the owner');
        // get liquidity data for tokenId
        uint128 liquidity = deposits[tokenId].liquidity;
        uint128 halfLiquidity = liquidity / 2;

        // amount0Min and amount1Min are price slippage checks
        // if the amount received after burning is not greater than these minimums, transaction will fail
        INonfungiblePositionManager.DecreaseLiquidityParams memory params =
            INonfungiblePositionManager.DecreaseLiquidityParams({
                tokenId: tokenId,
                liquidity: halfLiquidity,
                amount0Min: 0,
                amount1Min: 0,
                deadline: block.timestamp
            });

        (amount0, amount1) = nonfungiblePositionManager.decreaseLiquidity(params);

        //send liquidity back to owner
        _sendToOwner(tokenId, amount0, amount1);
    }

}