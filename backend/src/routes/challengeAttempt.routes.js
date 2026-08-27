const express = require('express')
const { authenticate } = require('../middleware/authentication.middleware')
const { createAttemptController, getAttemptController, getAllAttemptsController, updateAttemptController } = require('../controllers/challengeAttempt.controller')
const router = express.Router()

router.post('/:challengeId/attempts', authenticate, createAttemptController)
router.get('/:challengeId/attempts/:attemptId', authenticate, getAttemptController)
router.get('/:challengeId/attempts', authenticate, getAllAttemptsController)
router.patch('/:challengeId/attempts/:attemptId', authenticate, updateAttemptController)
module.exports = router
