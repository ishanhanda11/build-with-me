const express = require('express')
const validate = require('../middleware/validate.middleware')
const { profileValidation, updateProfileValidation } = require('../validators/profile.validation')
const { authenticate } = require('../middleware/authentication.middleware')
const { createProfileController, getProfileController, updateProfileController } = require('../controllers/profile.controller')

const router = express.Router()

router.post('/',authenticate,validate(profileValidation),createProfileController)
router.get('/', authenticate, getProfileController)
router.patch('/',authenticate,validate(updateProfileValidation),updateProfileController)
module.exports = router