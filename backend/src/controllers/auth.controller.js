const { registerUser, loginUser, newSession, logoutUser, getUserService } = require('../services/auth.service')

const isProduction = process.env.NODE_ENV === 'production' || process.env.RENDER === 'true'

const getCookieOptions = (maxAge) => ({
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    ...(maxAge ? { maxAge } : {})
})

const registerController = async (req, res, next) => {
    try {
        const user = await registerUser(req.body)
        res.cookie('accessToken', user.accessToken, getCookieOptions(15 * 60 * 1000))
        res.cookie('refreshToken', user.refreshToken, getCookieOptions(3 * 24 * 60 * 60 * 1000))
        return res.status(201).json({
            message: user.message,
            user: user.user,
            accessToken: user.accessToken,
            refreshToken: user.refreshToken,
        })
    } catch (err) {
        next(err)
    }
}

const loginController = async (req, res, next) => {
    try {
        const user = await loginUser(req.body)
        res.cookie('accessToken', user.accessToken, getCookieOptions(15 * 60 * 1000))
        res.cookie('refreshToken', user.refreshToken, getCookieOptions(3 * 24 * 60 * 60 * 1000))
        return res.status(200).json({
            message: user.message,
            user: user.user,
            accessToken: user.accessToken,
            refreshToken: user.refreshToken,
        })
    } catch (err) {
        next(err)
    }
}

const refreshTokenController = async (req, res, next) => {
    try {
        const token = req.cookies?.refreshToken || req.body?.refreshToken
        if (!token) {
            return res.status(401).json({ message: "Refresh token is missing" })
        }
        const session = await newSession(token)
        res.cookie('accessToken', session.accessToken, getCookieOptions(15 * 60 * 1000))
        res.cookie('refreshToken', session.refreshToken, getCookieOptions(3 * 24 * 60 * 60 * 1000))
        return res.status(200).json({
            message: "new session created successfully",
            accessToken: session.accessToken,
            refreshToken: session.refreshToken,
        })
    } catch (err) {
        if (err.name === "TokenExpiredError" || err.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Invalid or expired refresh token" })
        }
        next(err)
    }
}

const logoutController = async (req, res, next) => {
    try {
        const token = req.cookies?.refreshToken || req.body?.refreshToken
        if (token) {
            await logoutUser(token)
        }
        res.clearCookie("accessToken", getCookieOptions())
        res.clearCookie("refreshToken", getCookieOptions())
        return res.status(200).json({ message: "user logged out successfully" })
    } catch (err) {
        next(err)
    }
}

const getUserController = async (req, res, next) => {
    try {
        const userId = req.user.userId
        const user = await getUserService(userId)
        return res.status(200).json({
            message: "user fetched successfully",
            user: user
        })
    } catch (err) {
        next(err)
    }
}

module.exports = { registerController, loginController, refreshTokenController, logoutController, getUserController }