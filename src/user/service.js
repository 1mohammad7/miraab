const db = require('./db')


module.exports.get_by_app = async (appId) => {
    const result = await db.get_by_app(appId)
    return result
}
module.exports.delete = async (appId) => {
    const result = await db.delete(appId)
    return result
}