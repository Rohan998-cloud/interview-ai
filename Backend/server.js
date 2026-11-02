require("dotenv").config({ path: require("path").join(__dirname, "src", ".env") })
const connectToDB = require("./src/config/database")
const app = require("./src/app")

const port = Number(process.env.PORT) || 3000

async function startServer() {
    try {
        await connectToDB()
        app.listen(port, () => console.log(`Server is running on port ${port}`))
    } catch (error) {
        console.error("Failed to start server:", error.message)
        process.exitCode = 1
    }
}

startServer()
