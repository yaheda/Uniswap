const cron = require("node-cron");
const express = require("express");
require('dotenv').config()
console.log(process.env)
const imperamentLoss = require('./modules/impermanentLoss');

const app = express();

cron.schedule("*/5 * * * * *", async function () {
  console.log("---------------------");
  console.log("running a task every 5 seconds");

  var url = process.env.UNISWAP_GRAPH_URL;
  var positionId = process.env.UNISWAP_POSITION_ID;

  var loss = await imperamentLoss.getLoss(url, positionId);

  console.log();
});

app.listen(3001, () => {
  console.log("application listening.....");
});

