const express = require('express')

const router = express.Router()
const { authenticate } = require('../middleware/authentication.middleware')
const { requestHintController, requestPseudocodeController, requestSolutionController } = require('../controllers/attemptHelp.controller')
router.post('/challenges/:challengeId/hint', authenticate, requestHintController)
router.post('/challenges/:challengeId/pseudocode', authenticate, requestPseudocodeController)
router.post('/challenges/:challengeId/solution', authenticate, requestSolutionController)

module.exports = router