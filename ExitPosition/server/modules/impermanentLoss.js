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
  }

  
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
  
  var positionInfo = await getPositionInfo(url, positionId);
  var poolPositionInfo = await getPoolInfo(url, positionInfo.pool.id)
  
  debugger;
  return {
    hello: 'world'
  }
}

module.exports = imperamentLoss;