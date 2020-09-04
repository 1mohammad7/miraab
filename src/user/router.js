const express = require('express')
const router = express.Router()
const controller = require('./controller')
const { check_access_token, check_refresh_token, check_miraab_user } = require('../../internal/middleware/authenticate')

router.get('/:id', check_refresh_token, check_miraab_user, controller.get_by_app)
router.delete('/:id', check_access_token, check_miraab_user, controller.delete)

module.exports = router