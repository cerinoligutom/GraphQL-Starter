import { createLogger, transports, format } from 'winston';

const logFormat = format.combine(format.timestamp(), format.json());

const consoleLogFormat = format.combine(
  format.timestamp(),
  format.printf(info => {
    const header = `${info.level.toLocaleUpperCase()} - ${info.timestamp}`;
    const footer = '-'.repeat(header.length);

    return `[${header}]\n${info.message}\n[${footer}]`;
  }),
  format.colorize({
    all: true,
  }),
);

export const logger = createLogger({
  format: logFormat,
  transports: [
    new transports.File({
      filename: './logs/combined.log',
      level: 'info',
      maxsize: 5242880,
      maxFiles: 5,
    }),
    new transports.File({
      filename: './logs/errors.log',
      level: 'error',
      maxsize: 5242880,
      maxFiles: 5,
    }),
    new transports.Console({
      format: consoleLogFormat,
      handleExceptions: true,
    }),
  ],
  exceptionHandlers: [
    new transports.File({
      filename: './logs/exceptions.log',
      maxsize: 5242880,
      maxFiles: 5,
    }),
  ],
});

export const httpAccessLogger = createLogger({
  format: logFormat,
  transports: [
    new transports.File({
      filename: './logs/access.log',
      maxsize: 5242880,
      maxFiles: 5,
    }),
  ],
});
