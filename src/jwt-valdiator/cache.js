// if server said ok ,save token its ok , authenticate
// if not, delete this token, ask server and get a new token

const nodeCache = require('node-cache')
const { CONSTANTS } = require('../../internal/constants')

const cache = new nodeCache({
    stdTTL: CONSTANTS.expire_access_token,
    deleteOnExpire: true,
    checkperiod: CONSTANTS.accesstoken_check_period
})
module.exports.cacheToken = async (token, data) => {
    return cache.set(token, data)
}

module.exports.isTokenCached = async (token) => {
    return cache.get(token)
}
module.exports.deleteToken = async (token) => {
    return cache.del(token)
}