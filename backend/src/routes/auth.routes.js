const express = require('express')
const { registerController, loginController,refreshTokenController,logoutController } = require('../controllers/auth.controller')
const validate = require('../middleware/validate.middleware')
const {registerValidation, loginValidation} = require('../validators/auth.validation')
const { authenticate } = require('../middleware/authentication.middleware')
const prisma = require('../db/db')
const router = express.Router()

router.post('/register',validate(registerValidation),registerController)
router.post('/login',validate(loginValidation),loginController)
router.post('/refresh',refreshTokenController)
router.post('/logout',logoutController)

router.get('/me', authenticate, async (req, res, next) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.userId },
            select: { id: true, name: true, email: true }
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ user });
    } catch (err) {
        next(err);
    }
});

module.exports = router
