// multerConfig.js
const multer = require('multer');
const path = require('path');

// Set up your storage and file naming conventions
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Create an upload instance and pass it the storage
const upload = multer({ storage: storage });

// Export the configured multer instance
module.exports = upload;
