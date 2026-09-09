const rateLimit = require('express-rate-limit')

const loginRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    skipSuccessfulRequests: true,
    message: {
        error: "Too many login attempts. Please try again later."
    },
    standardHeaders: true,
    legacyHeaders: false
})

const registerRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 12,
    message: {
        error: "Too many registration attempts. Please try again later."
    },
    standardHeaders: true,
    legacyHeaders: false
})

const refreshRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    skipSuccessfulRequests: true,
    message: {
        error: "Too many refresh token requests. Please try again later."
    },
    standardHeaders: true,
    legacyHeaders: false
})
module.exports = { loginRateLimit, registerRateLimit, refreshRateLimit }