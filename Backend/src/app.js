const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")

const app = express()

const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)

app.disable("x-powered-by")
app.use(express.json({ limit: "1mb" }))
app.use(cookieParser())
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) return callback(null, true)
        return callback(new Error("Origin is not allowed by CORS"))
    },
    credentials: true
}))

app.get("/health", (req, res) => res.status(200).json({ status: "ok" }))

/* require all the routes here */
const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")


/* using all the routes here */
app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)

app.use((err, req, res, next) => {
    const status = err.status || err.statusCode || (err.name === "MulterError" ? 400 : 500)
    if (status >= 500) console.error(err)
    const message = err.name === "MulterError"
        ? (err.code === "LIMIT_FILE_SIZE" ? "Resume must be 3 MB or smaller" : "Upload one PDF file in the resume field")
        : status >= 500 ? "Internal server error" : err.message
    res.status(status).json({ message })
})


module.exports = app
