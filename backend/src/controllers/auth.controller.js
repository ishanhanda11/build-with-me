const {registerUser, loginUser, newSession, logoutUser} = require('../services/auth.service')

const isProduction = process.env.NODE_ENV === 'production'

const getCookieOptions = (maxAge) => ({
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    ...(maxAge ? { maxAge } : {})
})

const registerController = async (req,res,next) =>{
    try{
        const user = await registerUser(req.body)
        res.cookie('accessToken', user.accessToken, getCookieOptions(15 * 60 * 1000))
        res.cookie('refreshToken', user.refreshToken, getCookieOptions(3 * 24 * 60 * 60 * 1000))
        return res.status(201).json({
            message: user.message,
            user: user.user,
        })
    }catch(err){
        next(err)
    }
}

const loginController = async(req,res,next)=>{
    try{
        const user = await loginUser(req.body)
        res.cookie('accessToken', user.accessToken, getCookieOptions(15 * 60 * 1000))
        res.cookie('refreshToken', user.refreshToken, getCookieOptions(3 * 24 * 60 * 60 * 1000))
        return res.status(200).json({
            message: user.message,
            user: user.user,
        })
    }catch(err){
        next(err)
    }
}

const refreshTokenController = async (req,res,next) =>{
    try{
        const token = req.cookies.refreshToken
        if (!token) {
            throw new Error("Refresh token is missing")
        }
        const session = await newSession(token)
        res.cookie('accessToken', session.accessToken, getCookieOptions(15 * 60 * 1000))
        res.cookie('refreshToken', session.refreshToken, getCookieOptions(3 * 24 * 60 * 60 * 1000))
        return res.status(200).json({message:"new session created successfully"})
    }catch(err){
        next(err)
    }
}

const logoutController = async(req,res,next)=>{
    try{
        const token = req.cookies.refreshToken
        if(!token){
            return res.status(401).json("Refresh Token does not exist.")
        }
        await logoutUser(token)
        res.clearCookie("accessToken", getCookieOptions())
        res.clearCookie("refreshToken", getCookieOptions())
        return res.status(200).json({message: "user logged out successfully"})
    }catch(err){
        next(err)
    }
}

module.exports = {registerController, loginController, refreshTokenController, logoutController}