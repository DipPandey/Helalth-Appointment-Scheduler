const express = require('express');
const router = express.Router();
const medicalRecordController = require('../controllers/medicalRecordController');
const verifyToken = require('../middleware/verifyTokens');
const multerConfig = require('../middleware/multerConfig');
const path = require('path');


router.post('/upload', verifyToken, multerConfig.upload.single('file'), medicalRecordController.uploadMedicalRecord);
router.get('/', verifyToken, medicalRecordController.getMedicalRecords);


// Define more routes for downloading and deleting records

module.exports = router;
