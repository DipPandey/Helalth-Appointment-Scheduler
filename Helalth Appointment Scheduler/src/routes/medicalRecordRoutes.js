const express = require('express');
const medicalRecordController = require('../controllers/medicalRecordController');
const verifyToken = require('../middleware/verifyTokens'); // assuming you have this middleware
const upload = require('../middleware/multerConfig'); 

const router = express.Router();

router.post('/upload', verifyToken, upload.single('file'), medicalRecordController.uploadMedicalRecord);
router.get('/', verifyToken, medicalRecordController.getMedicalRecords);


// Define more routes for downloading and deleting records

module.exports = router;
