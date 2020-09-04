const db = require('./db')
const token = require('./token')
const cryptoInt = require('crypto-random-int')
const nodeCache = require("node-cache")
const bcrypt = require('bcrypt')
const _ = require('lodash')
const { CONSTANTS } = require('../../internal/constants')
// const Kavenegar = require('kavenegar');
const connectToSMS = process.env.SEND_SMS == "true"
const { logger } = require('../../internal/logger')
const BaseError = require('../../internal/error/base-error')

const cache = new nodeCache({
    stdTTL: CONSTANTS.sms_code_expire,
    deleteOnExpire: true,
    checkperiod: CONSTANTS.sms_code_check_period
})

module.exports.findAuth = async (refreshToken) => {
    return db.findAuth(refreshToken)
}
module.exports.getCode = async (phoneNumber) => {
    const startRange = 10 ** (CONSTANTS.sms_code_length - 1)
    const endRange = 10 ** CONSTANTS.sms_code_length - 1
    const randomToken = await cryptoInt(startRange, endRange)
    cache.set(phoneNumber, randomToken)
    if (connectToSMS == true) {
        // var api = Kavenegar.KavenegarApi({ apikey: process.env.SMS_TOKEN });
        // api.VerifyLookup({
        //     token: randomToken,
        //     template: "verify",
        //     receptor: phoneNumber
        // });

        return { ttl: CONSTANTS.sms_code_expire }
    } else {
        return { token: randomToken, ttl: CONSTANTS.sms_code_expire }
    }

}

module.exports.checkCode = async (phoneNumber, code) => {
    if (cache.get(phoneNumber) == code) {
        await cache.del(phoneNumber) //delete code after using
        return code
    } else {
        throw new BaseError(4, "Wrong OTP code.")
    }

}

module.exports.registerUser = async (appId, data) => {
    //check if user has account , dont register
    data.app = appId
    const user = await db.checkUserExists(appId, _.omit(data, 'password'))
    if (user) {
        throw new BaseError(4, 'This user is already registered. Proceed to login.', 401)
    } else {
        if (data.password) data = await this.set_password(data, data.password)
        const user = await db.saveUser(data)
        const { refreshToken, accessToken } = await token.saveAuth(appId, user._id)
        return { user: _.omit(user.toObject(), 'password'), refreshToken, accessToken }
    }
}

// //doesnt matter if its artist or admin
// module.exports.loginPassword = async (phoneNumber, password) => {
//     const loginEntity = await db.checkUserOrAdminExists(phoneNumber, true)
//     if (!loginEntity.data) throw new BaseError(4, "Invalid phone number", 404)
//     if (!loginEntity.data.password) throw new BaseError(4, "Invalid password", 404)
//     return new Promise((resolve, reject) => {
//         bcrypt.compare(password, loginEntity.data.password, async (error, same) => {
//             if (error) {
//                 reject(error)
//             } else if (!same) {
//                 reject(new BaseError(4, "Invalid password", 404))
//             } else {
//                 //all ok , authenticate

//                 const { refreshToken, accessToken } = await token.saveAuth(loginEntity.data._id, loginEntity.data.phoneNumber, loginEntity.role)
//                 resolve({ loginEntity: _.omit(loginEntity.data.toObject(), 'password'), role: loginEntity.role, refreshToken, accessToken })
//             }
//         })
//     })

// }

module.exports.loginOtp = async (appId, phoneNumber, code) => {
    console.log({ appId, phoneNumber });
    const user = await db.checkUserExists(appId, { phoneNumber })
    if (!user) throw new BaseError(4, "Phone number not registered. Proceed to register.")
    if (!await this.checkCode(phoneNumber, code)) {
        throw new BaseError(4, "Invalid OTP code", 401)
    } else {
        //all ok , authenticate
        const { refreshToken, accessToken } = await token.saveAuth(appId, user._id)
        return { user, refreshToken, accessToken }
    }

}
module.exports.loginUsername = async (appId, username, inputPassword) => {
    const user = await db.checkUserExists(appId, { username }, true)
    if (!user) throw new BaseError(4, "Invalid username or password.")
    if (!await this.check_password(user.password, inputPassword)) {
        throw new BaseError(4, "Invalid username or password", 404)
    } else {
        const { refreshToken, accessToken } = await token.saveAuth(appId, user._id)
        return { user: _.omit(user.toObject(), 'password'), refreshToken, accessToken }
    }
}
module.exports.loginEmail = async (appId, email, inputPassword) => {
    const user = await db.checkUserExists(appId, { email }, true)
    if (!user) throw new BaseError(4, "Invalid email or password.")
    if (!await this.check_password(user.password, inputPassword)) {
        throw new BaseError(4, "Invalid email or password", 404)
    } else {
        const { refreshToken, accessToken } = await token.saveAuth(appId, user._id)
        return { user: _.omit(user.toObject(), 'password'), refreshToken, accessToken }
    }
}

module.exports.set_password = async (user, password) => {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, 10, async (error, hash) => {
            if (error) {
                reject(new BaseError(5, error.message, 511))
            } else {
                user = { ...user, password: hash }
                resolve(user)
            }
        })
    })
}
module.exports.check_password = async (password, input) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(input, password, async (error, same) => {
            if (error) {
                reject(new BaseError(5, error.message, 511))
            } else {
                resolve(same)
            }
        })
    })
}