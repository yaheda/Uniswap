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
  return `pools(where: {id: ${poolId}}) {
    tick
    sqrtPrice
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
  return response.data["pools"][0];
}

async function getPoolInfo(url, poolId) {

}

async function getLoss(url, positionId) {
  
  var positionInfo = await getPositionInfo(url, positionId);
  
  debugger;
  return {
    hello: 'world'
  }
}

module.exports = imperamentLoss;