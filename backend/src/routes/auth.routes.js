const express = require('express')
const { registerController, loginController, refreshTokenController, logoutController, getUserController } = require('../controllers/auth.controller')
const validate = require('../middleware/validate.middleware')
const { registerValidation, loginValidation } = require('../validators/auth.validation')
const { authenticate } = require('../middleware/authentication.middleware')
const { loginRateLimit, registerRateLimit, refreshRateLimit } = require('../rateLimiting/auth.rateLimiting')
const router = express.Router()

router.post('/register', registerRateLimit, validate(registerValidation), registerController)
router.post('/login', loginRateLimit, validate(loginValidation), loginController)
router.post('/refresh', refreshRateLimit, refreshTokenController)
router.post('/logout', logoutController)
router.get('/me', authenticate, getUserController)

module.exports = router
