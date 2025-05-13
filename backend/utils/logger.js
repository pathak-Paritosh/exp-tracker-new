const { createLogger, transports, format } = require('winston');

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.printf(({ level, message, timestamp }) => {
      return `${timestamp} | ${level.toUpperCase()} | ${message}`;
    })
  ),
  transports: [new transports.Console()],
});

module.exports = logger;
