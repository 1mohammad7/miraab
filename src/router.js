const express = require('express')
const router = express.Router()
const AuthRouter = require('./auth/router')
const AppRouter = require('./app/router')
const UserRouter = require('./user/router')
// STUDY: versioning

router.use('/auth', AuthRouter)
router.use('/apps', AppRouter)
router.use('/users', UserRouter)

module.exports = router