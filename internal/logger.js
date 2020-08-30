const winston = require('winston');
const { createLogger, format, transports } = winston;
const { combine, timestamp, label, errors, json, splat, prettyPrint } = format;
const logger = winston.createLogger({
    level: 'info',
    format: combine(
        errors({ stack: true }), // <-- use errors format
        timestamp(),
        prettyPrint(),
        splat(),
        json(),
    ),
    transports: [
        //
        // - Write all logs with level `error` and below to `error.log`
        // - Write all logs with level `info` and below to `combined.log`
        //
        new winston.transports.File({ filename: 'files/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'files/combined.log' }),
    ],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple(),
    }));
}
//TODO: doesnt have stacktrace
module.exports.logger = logger