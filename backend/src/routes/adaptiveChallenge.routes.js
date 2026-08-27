const express = require('express')
const { authenticate } = require('../middleware/authentication.middleware')
const { adaptiveChallengeController } = require('../controllers/adaptiveChallenge.controller')
const router = express.Router()

router.post('/challenges/:projectId/adaptive', authenticate, adaptiveChallengeController)

module.exports = router