const express = require('express')
const authRoutes = require('./routes/auth.routes')
const profileRoutes = require('./routes/profile.routes')
const projectRoutes = require('./routes/project.routes')
const challengeAttemptRoutes = require('./routes/challengeAttempt.routes')
const adaptiveChallengeRoutes = require('./routes/adaptiveChallenge.routes')
const submissionRoutes = require('./routes/submission.routes')
const attemptHelpRotes = require('./routes/attemptHelp.routes')
const challengeHelpRoutes = require('./routes/challengeHelp.routes')
const app = express()
const cookieParser = require('cookie-parser')
const cors = require('cors')

// Enable trust proxy for Render / reverse proxies so secure cookies are handled correctly
app.set('trust proxy', 1)

const allowedOrigins = [
    process.env.CLIENT_URL,
    "http://localhost:5173",
    "http://localhost:3000"
].filter(Boolean)

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true)
        if (
            allowedOrigins.includes(origin) ||
            process.env.NODE_ENV !== 'production' ||
            origin.endsWith('.vercel.app')
        ) {
            return callback(null, true)
        }
        return callback(new Error(`Origin ${origin} not allowed by CORS`))
    },
    credentials: true
}))
app.use(express.json());
app.use(cookieParser())
app.use((req, res, next) => {
    const userIp = req.ip
    const method = req.method
    const url = req.originalUrl
    const timestamp = new Date()
    console.log(`The user with ip ${userIp} made ${method} request on url: ${url}, at ${timestamp.toISOString()}`)
    next()
})

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' })
})

app.get('/api', (req, res) => {
    res.status(200).json({ message: "build with me api" })
})
app.get('/test-error', (req, res, next) => {
    const error = new Error('something went wrong with the server');
    error.statusCode = 500;
    return next(error)
})
app.use('/api/auth', authRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/project', projectRoutes)
app.use('/api/challenge', challengeAttemptRoutes)
app.use("/api", adaptiveChallengeRoutes);
app.use('/api', submissionRoutes)
app.use('/api', attemptHelpRotes)
app.use('/api', challengeHelpRoutes)
app.use((req, res, next) => {
    res.status(404).json({
        status: 404,
        error: 'not found',
        message: `cannot ${req.method} ${req.originalUrl}`
    })
})



app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        status: statusCode,
        error: message,
        message: 'something went wrong'
    })
})


module.exports = app