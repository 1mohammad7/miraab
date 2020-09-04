const jwt = require('jsonwebtoken')
const authService = require('../../src/auth/service')
const BaseError = require('../../internal/error/base-error')
const { MIRAAB_APP_ID } = require('../constants')

module.exports.check_refresh_token = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1]
        const decoded = jwt.verify(token, process.env.TOKEN_REFRESH)
        req.user = decoded;
        if (await authService.findAuth(token)) {
            next()
        } else {
            throw new BaseError(1, 'Token is not authenticated', 401)
        }
    } catch (error) {
        error = { ...error, status: 401, code: 3 }
        next(error)
    }
}

module.exports.check_access_token = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1]

        const decoded = jwt.verify(token, process.env.TOKEN_ACCESS)
        req.user = decoded;
        next()
    } catch (error) {
        error = { ...error, status: 401, code: 3 }
        next(error)
    }
}
module.exports.check_miraab_user = async (req, res, next) => {
    if (req.user.appId == MIRAAB_APP_ID) next()
    else next(new BaseError(1, 'Access Denied', 401))
}