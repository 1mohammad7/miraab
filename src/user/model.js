const mongoose = require('mongoose');
const { logger } = require('../../internal/logger')
const { Schema, model, Types } = mongoose

const userSchema = Schema({
    phoneNumber: String,
    email: String,
    username: String,
    name: String,
    password: { type: String, select: false },
    app: { type: String, ref: 'app' },
    image: String,
}, { timestamps: true })
userSchema.index({ phoneNumber: 1 })



module.exports = model('user', userSchema)