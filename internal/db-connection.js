const mongoose = require('mongoose')
const { logger } = require('./logger')
module.exports.connect = async () => {

    let opts = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
        useUnifiedTopology: true,

    }
    if (process.env.MONGO_CONNECTION_TYPE == "local") {
        opts = {
            ...opts,
            authSource: 'admin'
        }
    }
    try {
        await mongoose.connect(process.env.MONGO_CONNECTION, opts)
        logger.info('app is connected to DB')
    } catch (error) {
        logger.error(error)
    }


}

module.exports.disconnect = async () => {
    try {
        await mongoose.disconnect()
        logger.info('app is disconnected from DB')
    } catch (error) {
        logger.error(error)
    }
}