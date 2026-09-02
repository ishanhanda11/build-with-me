const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {createUser, findUserByEmail, createRefreshToken, revokeRefreshToken, findRefreshToken} = require('../repositories/auth.repository')
const { generateAccessToken, generateRefreshToken, hashRefreshToken } = require('./token.service')
const prisma = require('../db/db')


const registerUser = async ({name,email,password})=>{
    const existingUser = await findUserByEmail(email)
    if(existingUser){
        const err = new Error("user already exists")
        err.statusCode = 409
        throw err
    }
    const passwordHash = await bcrypt.hash(password,10)
    const user = await createUser({name,email,passwordHash})
    const accessToken = generateAccessToken(user.id)
    const refreshToken = generateRefreshToken(user.id)
    const tokenHash = hashRefreshToken(refreshToken)
    const refreshTokenData = {
        userId: user.id,
        tokenHash,
        expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
    }
    await createRefreshToken(refreshTokenData)
    return{
        message: "user created successfully",
        user: {
        id: user.id,
        name: user.name,
        email: user.email,
        },
        accessToken: accessToken,
        refreshToken: refreshToken
    }
}

const loginUser = async({email,password})=>{
    const existingUser = await findUserByEmail(email)
    if(!existingUser){
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
    }
    const validPassword = await bcrypt.compare(password,existingUser.passwordHash)
    if(!validPassword){
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
    }
    const accessToken = generateAccessToken(existingUser.id)
    const refreshToken = generateRefreshToken(existingUser.id)
    const tokenHash = hashRefreshToken(refreshToken)
    const refreshTokenData = {
        userId: existingUser.id,
        tokenHash,
        expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
    }
    await createRefreshToken(refreshTokenData)
    
    return{
        message: "user logged in successfully",
        user: {
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
        },
        accessToken: accessToken,
        refreshToken: refreshToken
    }
}

const newSession = async (token) =>{
    try {
    const hashedIncomingToken = hashRefreshToken(token)
    const validToken = await findRefreshToken(hashedIncomingToken)
    if(!validToken){
       throw new Error("Invalid refresh token");
    }
    if (validToken.revokedAt){
        const err = new Error('Token has been revoked')
        err.statusCode = 401
        throw err
    }
    if (validToken.expiresAt < new Date()) {
        const err = new Error("Token has expired");
        err.statusCode = 401
        throw err
}
    const decoded = jwt.verify(token,process.env.JWT_REFRESH_SECRET)
    const accessToken = generateAccessToken(decoded.userId)
    const refreshToken = generateRefreshToken(decoded.userId)
    const tokenHash = hashRefreshToken(refreshToken)
    const refreshTokenData = {
        userId: decoded.userId,
        tokenHash,
        expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
    }

    await prisma.$transaction(async (tx) => {
        await revokeRefreshToken(validToken.id,tx);

        await createRefreshToken(refreshTokenData,tx);
    });

    return {
        accessToken: accessToken,
        refreshToken: refreshToken
    }
  
    } catch (error) {
  
    if (error.name === "TokenExpiredError") {
        throw new Error("Token has expired");
    }

    throw error;
}
}

const logoutUser = async (incomingToken) =>{
    try{
    const tokenHash = hashRefreshToken(incomingToken)
    const token = await findRefreshToken(tokenHash)
    if(!token){
        const err = new Error(' refresh token was not found')
        err.statusCode = 401
        throw err
    }
    if (token.revokedAt) {
        throw new Error("Token already revoked");
    }
    if (token.expiresAt < new Date()) {
        throw new Error("Token has expired");
    }
    jwt.verify(incomingToken,process.env.JWT_REFRESH_SECRET)
    await revokeRefreshToken(token.id)
    }catch(err){
    throw err
}
}

module.exports = {registerUser, loginUser, newSession, logoutUser}