const {registerUser, loginUser, newSession, logoutUser} = require('../services/auth.service')

const registerController = async (req,res,next) =>{
    try{
        const user = await registerUser(req.body)
        res.cookie('accessToken',user.accessToken,{
            httpOnly: true,                                
            secure: process.env.NODE_ENV === 'production', // Ensures cookies are sent over HTTPS only
            sameSite: 'lax',                               // Protects against CSRF attacks ('strict' or 'lax')
            maxAge:  15 * 60 * 1000 
        })
        res.cookie('refreshToken', user.refreshToken, {
            httpOnly: true,                                
            secure: process.env.NODE_ENV === 'production', // Ensures cookies are sent over HTTPS only
            sameSite: 'lax',                               // Protects against CSRF attacks ('strict' or 'lax')
            maxAge: 3 * 24 * 60 * 60 * 1000                    // Cookie expires in 1 day (in ms)
        });
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
        res.cookie('accessToken',user.accessToken,{
            httpOnly: true,                                
            secure: process.env.NODE_ENV === 'production', // Ensures cookies are sent over HTTPS only
            sameSite: 'lax',                               // Protects against CSRF attacks ('strict' or 'lax')
            maxAge:  15 * 60 * 1000 
        })
        res.cookie('refreshToken', user.refreshToken, {
            httpOnly: true,                                
            secure: process.env.NODE_ENV === 'production', // Ensures cookies are sent over HTTPS only
            sameSite: 'lax',                               // Protects against CSRF attacks ('strict' or 'lax')
            maxAge: 3 * 24 * 60 * 60 * 1000                    
        });
        return res.status(200).json({
        message: user.message,
        user: user.user,
});
    }catch(err){
        next(err)
    }
}

const refreshTokenController = async (req,res,next) =>{
    try{
        const token = req.cookies.refreshToken
        if (!token) {
        throw new Error("Refresh token is missing");
        }
        const session = await newSession(token)
        res.cookie('accessToken',session.accessToken,{
            httpOnly: true,                                
            secure: process.env.NODE_ENV === 'production', // Ensures cookies are sent over HTTPS only
            sameSite: 'lax',                               // Protects against CSRF attacks ('strict' or 'lax')
            maxAge:  15 * 60 * 1000 
        })
        res.cookie('refreshToken', session.refreshToken, {
            httpOnly: true,                                
            secure: process.env.NODE_ENV === 'production', // Ensures cookies are sent over HTTPS only
            sameSite: 'lax',                               // Protects against CSRF attacks ('strict' or 'lax')
            maxAge: 3 * 24 * 60 * 60 * 1000                    
        });
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
    res.clearCookie("accessToken",{
        httpOnly: true,                                
        secure: process.env.NODE_ENV === 'production', // Ensures cookies are sent over HTTPS only
        sameSite: 'lax',  
    });
    res.clearCookie("refreshToken",{
        httpOnly: true,                                
        secure: process.env.NODE_ENV === 'production', // Ensures cookies are sent over HTTPS only
        sameSite: 'lax',  
    });
    return res.status(200).json({message: "user logged out successfully"})
    }catch(err){
        next(err)
    }
}

module.exports = {registerController, loginController, refreshTokenController, logoutController}