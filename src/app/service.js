const db = require('./db')
const _ = require('lodash')
const BaseError = require('../../internal/error/base-error')


module.exports.create = async (userId, data) => {
    data.owner = userId
    const result = await db.save(data)
    return result
}
module.exports.delete = async (userId, id) => {
    const app = await db.findById(id)
    if (!app) throw new BaseError(4, 'Resource not found', 404)
    if (app.owner != userId) throw new BaseError(3, 'Access Denied', 401)
    const result = await db.delete(id)
    return result
}
module.exports.getByOwner = async (ownerId) => {

    const result = await db.getByOwner(ownerId)
    return result
}