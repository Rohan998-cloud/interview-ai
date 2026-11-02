const userModel = require("../models/user.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const tokenBlacklistModel = require("../models/blacklist.model")

const cookieOptions = {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60 * 1000
}

/**
 * @name registerUserController
 * @description register a new user, expects username, email and password in the request body
 * @access Public
 */
async function registerUserController(req, res) {

    const { username, email, password } = req.body

    if (![username, email, password].every((value) => typeof value === "string" && value.trim())) {
        return res.status(400).json({
            message: "Please provide username, email and password"
        })
    }

    if (password.length < 8 || password.length > 128) {
        return res.status(400).json({ message: "Password must be between 8 and 128 characters" })
    }

    const normalizedUsername = username.trim()
    const normalizedEmail = email.trim().toLowerCase()

    const isUserAlreadyExists = await userModel.findOne({
        $or: [ { username: normalizedUsername }, { email: normalizedEmail } ]
    })

    if (isUserAlreadyExists) {
        return res.status(400).json({
            message: "Account already exists with this email address or username"
        })
    }

    const hash = await bcrypt.hash(password, 12)

    const user = await userModel.create({
        username: normalizedUsername,
        email: normalizedEmail,
        password: hash
    })

    if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not configured")
    const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    )

    res.cookie("token", token, cookieOptions)


    res.status(201).json({
        message: "User registered successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })

}


/**
 * @name loginUserController
 * @description login a user, expects email and password in the request body
 * @access Public
 */
async function loginUserController(req, res) {

    const { email, password } = req.body

    if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
        return res.status(400).json({ message: "Email and password are required" })
    }
    const user = await userModel.findOne({ email: email.trim().toLowerCase() })

    if (!user) {
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not configured")
    const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    )

    res.cookie("token", token, cookieOptions)
    res.status(200).json({
        message: "User loggedIn successfully.",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}


/**
 * @name logoutUserController
 * @description clear token from user cookie and add the token in blacklist
 * @access public
 */
async function logoutUserController(req, res) {
    const token = req.cookies?.token

    if (token) {
        try {
            await tokenBlacklistModel.create({ token })
        } catch (error) {
            if (error.code !== 11000) throw error
        }
    }

    res.clearCookie("token", { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production" })

    res.status(200).json({
        message: "User logged out successfully"
    })
}

/**
 * @name getMeController
 * @description get the current logged in user details.
 * @access private
 */
async function getMeController(req, res) {

    const user = await userModel.findById(req.user.id)
    if (!user) return res.status(404).json({ message: "User not found" })

    res.status(200).json({
        message: "User details fetched successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })

}



module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController
}
