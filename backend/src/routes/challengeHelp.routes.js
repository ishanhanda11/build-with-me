const express = require('express')
const { authenticate } = require('../middleware/authentication.middleware')
const { challengeHelpController, getUserHelpCountController } = require('../controllers/challengeHelp.controller')
const router = express.Router()

router.get('/help/count', authenticate, getUserHelpCountController)
router.get('/challenges/help/count', authenticate, getUserHelpCountController)
router.get('/challenges/:challengeId/help', authenticate, challengeHelpController)

module.exports = router