const jwt = require('jsonwebtoken')
const crypto = require("crypto");

const hashRefreshToken = (refreshToken) => {
  return crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");
};

const generateAccessToken = (userId) =>{
    return jwt.sign({userId},process.env.JWT_ACCESS_SECRET,{expiresIn: '15m'})
}

const generateRefreshToken = (userId) =>{
    return jwt.sign({userId},process.env.JWT_REFRESH_SECRET,{expiresIn:'3d'})
}





module.exports = {hashRefreshToken,generateAccessToken, generateRefreshToken}