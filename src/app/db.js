const Model = require('./model')

module.exports.findApp = async (id) => {
    return await Model.findById(id)
}


module.exports.findById = async (id) => {
    return Model.findById(id)
}
module.exports.save = async (data) => {
    return new Model(data).save()
}
module.exports.delete = async (id) => {
    return Model.findByIdAndDelete(id)
}
module.exports.getByOwner = async (ownerId) => {
    return Model.find({ owner: ownerId })
}