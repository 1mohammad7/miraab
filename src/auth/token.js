const { CONSTANTS } = require('../../internal/constants')
const BaseError = require('../../internal/error/base-error')
const jwt = require('jsonwebtoken')
const db = require('./db')

module.exports.saveAuth = async (appId, userId) => {
    const refreshToken = await this.getJwt(userId, userId, false)
    const auth = await db.saveAuth(userId, { user: userId, refreshToken, app: appId })
    const accessToken = await this.getJwt(appId, userId, true)
    return { refreshToken, accessToken }
}
module.exports.getJwt = async (appId, userId, isAccessToken) => {
    return await jwt.sign({
            userId,
            appId,
        },
        isAccessToken ? process.env.TOKEN_ACCESS : process.env.TOKEN_REFRESH,
        isAccessToken ? { expiresIn: CONSTANTS.expire_access_token } : null, //refresh token never expires
    )
}