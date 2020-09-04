const mongoose = require('mongoose');
const { logger } = require('../../internal/logger')
const { Schema, model } = mongoose

const authSchema = Schema({
    user: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    app: { type: Schema.Types.ObjectId, ref: 'app', required: true },
    refreshToken: { type: String, required: true },
    role: { type: String, required: true },
}, { timestamps: true })

authSchema.index({
    "user": 1,
    "app": 1,
    "role": 1
}, {
    unique: true
})
authSchema.on('index', (err) => {
    if (err) {
        logger.error('error on indexing auth collection :', err)
    } else {
        logger.info("indexed:auth collection")
    }
})

module.exports = model('auth', authSchema);