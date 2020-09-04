const service = require('./service')
const appDB = require('../app/db')
const BaseError = require('../../internal/error/base-error')

module.exports.get_by_app = async (req, res, next) => {
    try {
        const { userId } = req.user
        const appId = req.params.id
        const app = await appDB.findApp(appId)
        if (app.owner == userId) {
            const result = await service.get_by_app(appId)
            res.formatter(2, result, 200)
        } else {
            throw new BaseError(1, 'You are not the owner of this app', 401)
        }
    } catch (err) {
        next(err)
    }
}
module.exports.delete = async (req, res, next) => {
    try {
        const { userId } = req.user
        const appId = req.params.id
        const app = await appDB.findApp(appId)
        if (app.owner == userId) {
            const result = await service.delete(appId)
            res.formatter(2, result, 200)
        } else {
            throw new BaseError(1, 'You are not the owner of this app', 401)
        }
    } catch (err) {
        next(err)
    }
}