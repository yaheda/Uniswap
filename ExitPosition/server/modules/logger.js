var winston = require('winston');
require('winston-daily-rotate-file');

// logger.setLevels({
//   debug:0,
//   info: 1,
//   silly:2,
//   warn: 3,
//   error:4,
// });

var colors = {
  debug: 'green',
  info:  'cyan',
  silly: 'magenta',
  warn:  'yellow',
  error: 'red'
};


// winston.remove(winston.transports.Console);
// winston.add(winston.transports.Console, { colorize:true });

var transport = new (winston.transports.DailyRotateFile)({
  filename: 'uniswapexitposition-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
  dirname: './logs'
});

winston.level = process.env.LOGGER_LEVEL; // || config.LOGGER.loglevel;


winston.addColors(colors);
var logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.errors({ stack: true }),
    winston.format.colorize(),
    winston.format.simple(),
    winston.format.printf(function(message) {

      var result = `${message.timestamp}-${message.level}: ${JSON.stringify(message.message, null, 4)}`;

      if (message.options) {
        result += `\n${JSON.stringify(message.options)}`
      }

      if (message.stack) {
        result += `\n${message.stack}`;
      }

      return result;
    }),
  ),
  transports: [
    new winston.transports.Console({
      json: true,
      prettyPrint: true,
      timestamp: true,
      depth:true,
      colorize:true
    }),
    //transport
  ]
});



// logger.info("127.0.0.1 - there's no place like home");
// logger.error(new Error('Error as info'));



module.exports = logger;