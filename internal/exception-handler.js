//errors
const BaseError = require('./error/base-error')
const { ValidationError } = require('joi')
const { logger } = require('./logger')
const moment = require('moment')
module.exports = async (error, req, res, next) => {

    if (error.code == 3) {
        switch (error.name) {
            case 'TokenExpiredError':
                res.formatter(3, `Your token expired ${moment(error.expiredAt).fromNow()}`)
                break;
            case 'JsonWebTokenError':
                //Header Error
                res.formatter(3, 'Your token is not valid : ' + error.message, 401)
                break;
            default:
                res.formatter(5, 'Authentication failed : ' + error.message, 552)
                break;
        }
    } else if (error instanceof ValidationError) {
        console.log(error);
        res.formatter(1, error.details.map(detail => detail.message), 400)
    } else if (error instanceof BaseError) {
        if (error.shouldPrintStack) logger.error(error.stack)
        res.formatter(error.code || 5, error.message || error, error.status)
    } else {
        logger.error(error)
        res.formatter(5, error.message || error, error.status || 551)
    }
}