const jwt = require("jsonwebtoken")
const tokenBlacklistModel = require("../models/blacklist.model")

async function authUser(req, res, next) {
    const token = req.cookies?.token

    if (!token) {
        return res.status(401).json({
            message: "Token not provided."
        })
    }

    try {
        if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not configured")
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const isTokenBlacklisted = await tokenBlacklistModel.exists({ token })
        if (isTokenBlacklisted) {
            return res.status(401).json({ message: "Token is invalid." })
        }

        req.user = decoded
        return next()
    } catch (err) {
        if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Invalid or expired token." })
        }
        return next(err)
    }

}


module.exports = { authUser }
