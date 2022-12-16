const cron = require("node-cron");
const express = require("express");
require('dotenv').config()

const logger = require('./modules/logger');
const imperamentLoss = require('./modules/impermanentLoss');

const app = express();

cron.schedule("*/5 * * * * *", async function () {
  logger.info("---------------------");
  logger.info("running a task every 5 seconds");

  var url = process.env.UNISWAP_GRAPH_URL;
  var positionId = process.env.UNISWAP_POSITION_ID;

  try {
    var loss = await imperamentLoss.getLoss(url, positionId);
  } catch (error) {
    logger.error(error);
  }
});

process.on('uncaughtException', err => console.log('uncaught exception:', err));
process.on('unhandledRejection', error => console.log('unhandled rejection:', error));

var server = app.listen(3001, () => {
  console.log("application listening.....");
});

server.on('error', onError);

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      logger.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      logger.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

