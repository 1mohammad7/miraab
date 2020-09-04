const joi = require('joi')
const { APP_TYPE, STRATEGY } = require('../../internal/constants')
module.exports.create = joi.object().options({ abortEarly: false }).keys({
    name: joi.string().min(3).max(50).required(),
    type: joi.string().valid(APP_TYPE.M2C, APP_TYPE.M2M).required(),
    strategy: joi.string().valid(STRATEGY.STRATEGY_USERNAME, STRATEGY.STRATEGY_EMAIL, STRATEGY.STRATEGY_PHONE).required(),
    identifier: joi.string().min(3).max(20).required()
})