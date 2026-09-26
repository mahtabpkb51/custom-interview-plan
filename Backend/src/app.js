const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

/* require all the routes here */
const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")

/* using all the routes here */
app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)

// ==========GLOBAL ERROR HANDLER=================
app.use((error, req, res, next) => {
    console.error("Server error:", error.message)

    // ==========MULTER FILE SIZE ERROR=================
    if (error.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
            message: "Resume file must be smaller than 3MB."
        })
    }

    // ==========FILE TYPE ERROR=================
    if (error.message === "Only PDF files are allowed.") {
        return res.status(400).json({
            message: error.message
        })
    }

    // ==========GENERAL SERVER ERROR=================
    res.status(500).json({
        message: error.message || "Something went wrong on the server."
    })
})

module.exports = app