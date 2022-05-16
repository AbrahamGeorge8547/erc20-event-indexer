import * as winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const transport: DailyRotateFile = new DailyRotateFile({
  filename: './logs/application-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
});

const format = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp(),
  winston.format.align(),
  winston.format.printf(
    info => `${info.timestamp} ${info.level}: ${info.message}`, //eslint-disable-line
  ),
);
const logger = winston.createLogger({
  format,
  transports: [
    transport,
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp(),
      winston.format.align(),
      winston.format.printf(
        info => `${info.timestamp} ${info.level}: ${info.message}`, //eslint-disable-line
      ),
    ),
  }));
}

/**
 * @description class for logger
 * @function entry to be called when entering a function
 * @function exit to be called just before exiting
 * @function info to be called for logging information
 * @function error to be called while encountering errors
 */

class Logger {
  public functionName!: string;

  constructor(functionName: string) {
    this.functionName = functionName;
    logger.info(`Entering ${functionName}`);
  }

  public exit() {
    logger.info(`Exiting ${this.functionName}`);
  }

  public info(log: string) {
    logger.info(`${this.functionName}|| ${log}`);
  }

  public error(log: string) {
    logger.error(`${this.functionName}|| ${log}`);
  }
}
export default Logger;
