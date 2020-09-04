const validation = require('./validation')
const service = require('./service')


module.exports.create = async (req, res, next) => {
    try {
        const data = req.body
        await validation.create.validateAsync(data)
        const { userId } = req.user
        const result = await service.create(userId, data)
        res.formatter(2, result, 201)
    } catch (err) {
        next(err)
    }
}
module.exports.delete = async (req, res, next) => {
    try {
        const { id } = req.params

        const result = await service.delete(id)
        res.formatter(2, result)
    } catch (err) {
        next(err)
    }
}
module.exports.user_apps = async (req, res, next) => {
    try {
        const { id } = req.user
        const result = await service.getByOwner(id)
        res.formatter(2, result)
    } catch (err) {
        next(err)
    }
}