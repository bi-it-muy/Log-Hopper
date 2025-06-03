import winston from 'winston';

const loggerConsole = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console()]
});

const loggerFile = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: 'logs/app.log',
      level: 'error',
      maxsize: 5242880, // 5MB 
      maxFiles: 5,
      tailable: true,})]
    });  