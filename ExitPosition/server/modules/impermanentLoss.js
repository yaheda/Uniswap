const axios = require('axios');

const imperamentLoss = {
  getLoss
}

let TICK_BASE = 1.0001;

function buildPositionQuery (positionId) {
  return `{
    positions(where: {id: ${positionId}}) {
      liquidity
      tickLower { tickIdx }
      tickUpper { tickIdx }
      pool { id }
      token0 {
        symbol
        decimals
      }
      token1 {
        symbol
        decimals
      }
    }
  }`;
}

function buildPoolQuery (poolId) {
  return `{
    pools(where: {id: "${poolId}"}) {
      tick
      sqrtPrice
    }
  }`;
}

function tickToPice(tick) {
  return TICK_BASE ** tick;
}

async function getPositionInfo(url, positionId) {
  const response = await axios.post(
    url,     
    { query: buildPositionQuery(positionId) }, 
    { headers: { "Accept-Encoding": "gzip,deflate,compress" } 
  });

  if (response.data.data["positions"] == 0)
    throw new Error('position not found');

  var position = response.data.data["positions"][0];

  return {
    liquidity: parseInt(position["liquidity"]),
    tick_lower: parseInt(position["tickLower"]["tickIdx"]),
    tick_upper: parseInt(position["tickUpper"]["tickIdx"]),
    pool_id: position["pool"]["id"],

    token0: position["token0"]["symbol"],
    token1: position["token1"]["symbol"],
    decimals0: parseInt(position["token0"]["decimals"]),
    decimals1: parseInt(position["token1"]["decimals"]),
  };
}

async function getPoolInfo(url, poolId) {
  const response = await axios.post(
    url,     
    { query: buildPoolQuery(poolId) }, 
    { headers: { "Accept-Encoding": "gzip,deflate,compress" } 
  });

  if (response.data.data["pools"] == 0)
    throw new Error('pool not found');
  
  var pool = response.data.data["pools"][0]
  
  return {
    current_tick: parseInt(pool["tick"]),
    current_sqrt_price: parseInt(pool["sqrtPrice"]) / (2 ** 96)
  };
}

async function getLoss(url, positionId) {

  var toString = '';
  
  var positionInfo = await getPositionInfo(url, positionId);
  var poolInfo = await getPoolInfo(url, positionInfo.pool_id)
  
  var current_price = tickToPice(poolInfo.current_tick);
  var adjusted_current_price = current_price / (10 ** (positionInfo.decimals1 - positionInfo.decimals0));
  
  var sa = tickToPice(positionInfo.tick_lower / 2);
  var sb = tickToPice(positionInfo.tick_upper / 2);

  var amount0, amount1;

  if (positionInfo.tick_upper <= poolInfo.current_tick) {
    amount0 = 0;
    amount1 = position.liquidity * (sb - sa);
  } else if (positionInfo.tick_lower < poolInfo.current_tick && current_tick < positionInfo.tick_upper) {
    amount0 = positionInfo.liquidity * (sb - poolInfo.current_sqrt_price) / (poolInfo.current_sqrt_price * sb);
    amount1 = positionInfo.liquidity * (poolInfo.current_sqrt_price - sa);
  } else {
    amount0 = positionInfo.liquidity * (sb - sa) / (sa * sb);
    amount1 = 0;
  }

  var adjusted_amount0 = amount0 / (10 ** positionInfo.decimals0);
  var adjusted_amount1 = amount1 / (10 ** positionInfo.decimals1);

  toString += 
    `Current price=${adjusted_current_price} ${positionInfo.token1} ` +
    `for ${positionInfo.token0} ` +
    `at tick ${poolInfo.current_tick}`;

  toString += 
    ` position ${positionId} ` +
    `in range [${positionInfo.tick_lower},${positionInfo.tick_upper}]: ` +
    `${adjusted_amount0} ${positionInfo.token0} ` +
    `and ${adjusted_amount1} ${positionInfo.token1} ` +
    `at the current price`;

  return {
    toString: toString
  }
}

module.exports = imperamentLoss;