const User = require('../user/model')
const Auth = require('./model')

module.exports.checkUserExists = async (appId, query, selectPassword) => {
    return User.findOne({ ...query, app: appId }).select(selectPassword ? '+password' : null)
}

module.exports.saveUser = async (data) => {
    return new User(data).save()
}

module.exports.saveAuth = async (userId, data) => {
    return await Auth.findOneAndUpdate({ user: userId }, { $set: data }, { upsert: true, new: true })
}

module.exports.findAuth = async (refreshToken) => {
    return await Auth.findOne({ refreshToken })
}