const Model = require('./model')


module.exports.get_by_app = async (appId) => {
    return Model.find({ app: appId })
}

module.exports.delete = async (id) => {
    return Model.findByIdAndDelete(id)
}