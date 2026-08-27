const express = require('express')
const { authenticate } = require('../middleware/authentication.middleware')
const validate = require('../middleware/validate.middleware')
const { userSubmissionValidation } = require('../validators/userSubmission.validation')
const { attemptSubmissionController } = require('../controllers/submission.controller')
const router = express.Router()

router.post('/attempts/:attemptId/submit', authenticate, validate(userSubmissionValidation), attemptSubmissionController)
module.exports = router