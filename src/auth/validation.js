const joi = require('joi')
module.exports.get = joi.object().keys({
    phoneNumber: joi.string().min(11).max(11).regex(/09[0-9]*/).required(),
})
module.exports.sendCode = joi.object().options({ abortEarly: false }).keys({
    phoneNumber: joi.string().min(11).max(11).regex(/09[0-9]*/).required(),
    code: joi.string().min(5).max(5).regex(/[0-9]*/).required(),
})

module.exports.username = joi.object().options({ abortEarly: false }).keys({
    username: joi.string().min(3).max(60).regex(/[A-Za-z]/).required(),
    password: joi.string().min(6).max(50).required(),
})
module.exports.email = joi.object().options({ abortEarly: false }).keys({
    email: joi.string().email({ tlds: { allow: false } }).required(),
    password: joi.string().min(6).max(50).required(),
})