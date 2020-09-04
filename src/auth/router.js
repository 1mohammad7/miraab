const express = require('express')
const router = express.Router()
const controller = require('./controller')
const { check_access_token, check_refresh_token } = require('../../internal/middleware/authenticate')

router.post('/register/:appId', controller.register)
router.post('/login/:appId', controller.login)
router.post('/get_otp', controller.get_otp)
router.get('/accesstoken', check_refresh_token, controller.get_access_token)
router.get('/token_validation', check_access_token, controller.check_token)

module.exports = router