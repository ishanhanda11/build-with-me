const express = require('express')
const { authenticate } = require('../middleware/authentication.middleware')
const { challengeHelpController } = require('../controllers/challengeHelp.controller')
const router = express.Router()

router.get('/challenges/:challengeId/help',authenticate,challengeHelpController)

module.exports = router