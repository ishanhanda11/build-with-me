const jwt = require('jsonwebtoken')

const authenticate = (req,res,next)=>{
    try{
        const authHeader = req.headers.authorization
        const bearerToken = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null
        const token = bearerToken || req.cookies?.accessToken
        if(!token){
            return res.status(401).json({message: "token does not exist, please log in."})
        }
        const decoded = jwt.verify(token,process.env.JWT_ACCESS_SECRET)
        req.user = decoded
        return next()
    }catch(err){
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({
                message: "Access token has expired."
            });
        }
        if (err.name === "JsonWebTokenError") {
            return res.status(401).json({
                message: "Invalid access token."
            });
        }
        next(err)
    }
}

module.exports = {authenticate}