const express = require('express')
const { registerController, loginController,refreshTokenController,logoutController } = require('../controllers/auth.controller')
const validate = require('../middleware/validate.middleware')
const {registerValidation, loginValidation} = require('../validators/auth.validation')
const router = express.Router()

router.post('/register',validate(registerValidation),registerController)
router.post('/login',validate(loginValidation),loginController)
router.post('/refresh',refreshTokenController)
router.post('/logout',logoutController)
module.exports = router
