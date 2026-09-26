const multer = require("multer")

// ==========FILE UPLOAD CONFIGURATION=================
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 3 * 1024 * 1024 // 3MB
    },
    fileFilter: (req, file, cb) => {
        // ==========PDF FILE VALIDATION=================
        if (file.mimetype === "application/pdf") {
            cb(null, true)
        } else {
            cb(new Error("Only PDF files are allowed."))
        }
    }
})

module.exports = upload