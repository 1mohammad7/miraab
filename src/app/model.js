const mongoose = require('mongoose');
const { logger } = require('../../internal/logger')
const { Schema, model } = mongoose

const appSchema = Schema({
    name: { type: String, required: true },
    owner: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    type: { type: String, required: true },
    strategy: { type: String, required: true },
    identifier: { type: String, required: true },
}, { timestamps: true })

appSchema.index({ "owner": 1 })
appSchema.index({ "identifier": 1 }, { unique: true })
appSchema.on('index', (err) => {
    if (err) {
        logger.error('error on indexing app collection :', err)
    } else {
        logger.info("indexed:app collection")
    }
})

module.exports = model('app', appSchema);