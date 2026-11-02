const multer = require("multer")


const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 3 * 1024 * 1024,
        files: 1
    },
    fileFilter: (req, file, callback) => {
        const isPdf = file.mimetype === "application/pdf" && /\.pdf$/i.test(file.originalname)
        callback(isPdf ? null : new multer.MulterError("LIMIT_UNEXPECTED_FILE", file.fieldname), isPdf)
    }
})


module.exports = upload
