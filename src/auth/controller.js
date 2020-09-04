const joi = require('joi')
const validation = require('./validation')
const service = require('./service')
const _ = require('lodash')
const { logger } = require('../../internal/logger')
const BaseError = require('../../internal/error/base-error')
const UnknownStrategyError = require('../../internal/error/unknown-strategy-error')
const token = require('./token')
const { STRATEGY } = require('../../internal/constants')
const appDb = require('../app/db')

module.exports.register = async (req, res, next) => {

    try {
        //get app
        const { appId } = req.params
        const app = await appDb.findApp(appId)
        if (!app) throw new BaseError(4, 'Unknkown App Id', 400)
        const { strategy } = app
        const { phoneNumber, code, email, username, password } = req.body
        let result
        switch (strategy) {
            case STRATEGY.STRATEGY_USERNAME:
                await validation.username.validateAsync({ username, password })
                result = await service.registerUser(appId, { username, password })
                break;
            case STRATEGY.STRATEGY_EMAIL:
                await validation.email.validateAsync({ email, password })
                result = await service.registerUser(appId, { email, password })
                break;
            case STRATEGY.STRATEGY_PHONE:
                await validation.sendCode.validateAsync({ phoneNumber, code })
                if (await service.checkCode(phoneNumber, code)) {
                    result = await service.registerUser(appId, appId, { phoneNumber })
                } else {
                    throw new BaseError(4, 'Wrong OTP Code', 401)
                }
                break;

            default:
                throw new UnknownStrategyError(strategy)
        }
        res.formatter(2, result)


    } catch (err) {
        next(err)
    }


}

module.exports.get_otp = async (req, res, next) => {

    try {
        const { phoneNumber } = req.body
        await validation.get.validateAsync({ phoneNumber })
        const result = await service.getCode(phoneNumber)
        res.formatter(2, result)
    } catch (err) {
        next(err)
    }

}

module.exports.login = async (req, res, next) => {

    try {
        //get app
        const { appId } = req.params
        const { strategy } = await appDb.findApp(appId)
        const { phoneNumber, code, email, username, password } = req.body
        let result
        switch (strategy) {
            case STRATEGY.STRATEGY_USERNAME:
                await validation.username.validateAsync({ username, password })
                result = await service.loginUsername(appId, username, password)
                res.formatter(2, result, 200)
                break;
            case STRATEGY.STRATEGY_EMAIL:
                await validation.email.validateAsync({ email, password })
                result = await service.loginUsername(appId, email, password)
                res.formatter(2, result, 200)
                break;
            case STRATEGY.STRATEGY_PHONE:
                await validation.sendCode.validateAsync({ phoneNumber, code })
                result = await service.loginOtp(appId, phoneNumber, code)
                res.formatter(2, result, 200)
                throw new BaseError(4, 'Wrong OTP Code', 401)
            default:
                throw new UnknownStrategyError(strategy)
        }

    } catch (err) {
        next(err)
    }
}

module.exports.get_access_token = async (req, res, next) => {

    try {
        const { appId, userId } = req.user
        const accessToken = await token.getJwt(appId, userId, true)

        res.formatter(2, { accessToken })
    } catch (err) {
        next(err)
    }
}

module.exports.check_token = async (req, res, next) => {

    try {
        res.formatter(2, { message: "Your token is valid", data: req.user })
    } catch (err) {
        next(err)
    }
}