import * as winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const transport: DailyRotateFile = new DailyRotateFile({
  filename: "./logs/application-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "14d",
});
const transportDebug: DailyRotateFile = new DailyRotateFile({
  filename: "./logs/debug-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "14d",
  level: "debug",
});

const format = winston.format.combine(
  winston.format.timestamp(),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}:${info.message}` //eslint-disable-line
  )
);
const logger = winston.createLogger({
  format,
  transports: [transport, transportDebug],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.align(),
        winston.format.printf(
          (info) => `${info.timestamp} ${info.level}: ${info.message}` //eslint-disable-line
        )
      ),
    })
  );
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
  public moduleName!: string;

  constructor(moduleName: string) {
    this.moduleName = moduleName;
  }
  public entry(functionName: string) {
    this.functionName = functionName;
    logger.info(`Entering ${this.moduleName} || ${this.functionName}`);
  }
  public exit() {
    logger.info(`Exiting ${this.moduleName} || ${this.functionName}`);
  }

  public info(log: string) {
    logger.info(`${this.moduleName} || ${this.functionName}|| ${log}`);
  }
  public debug(log: string) {
    logger.debug(`${this.moduleName} || ${this.functionName}|| ${log}`);
  }

  public error(log: Error) {
    logger.error(`${this.moduleName} || ${this.functionName}|| ${log}`);
  }
  public static general(log: string) {
    logger.info(log)
  }  
}
export default Logger;
