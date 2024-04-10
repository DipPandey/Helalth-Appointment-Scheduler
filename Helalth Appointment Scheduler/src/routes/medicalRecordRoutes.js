const express = require('express');
const router = express.Router();
const medicalRecordController = require('../controllers/medicalRecordController');
const verifyToken = require('../middleware/verifyToken');
const multer = require('multer'); // Assuming Multer for file uploads

const upload = multer({ dest: 'uploads/' }); // Configure Multer

router.post('/upload', verifyToken, upload.single('file'), medicalRecordController.uploadMedicalRecord);
router.get('/', verifyToken, medicalRecordController.getMedicalRecords);

// Define more routes for downloading and deleting records

module.exports = router;
