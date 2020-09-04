const express = require('express')
const router = express.Router()
const controller = require('./controller')
const { check_access_token, check_refresh_token, check_miraab_user } = require('../../internal/middleware/authenticate')


router.post('/', check_access_token, check_miraab_user, controller.create)
router.delete('/:id', check_access_token, check_miraab_user, controller.delete)
router.get('/', check_access_token, check_miraab_user, controller.user_apps)


module.exports = router