const express = require('express')
const validate = require('../middleware/validate.middleware')
const { profileValidation } = require('../validators/profile.validation')
const { authenticate } = require('../middleware/authentication.middleware')
const { createProfileController } = require('../controllers/profile.controller')

const router = express.Router()

router.post('/',authenticate,validate(profileValidation),createProfileController)

module.exports = router