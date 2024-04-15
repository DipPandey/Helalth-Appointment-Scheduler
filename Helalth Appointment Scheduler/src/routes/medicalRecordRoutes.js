const express = require('express');
const router = express.Router();
const medicalRecordController = require('../controllers/medicalRecordController');
const verifyToken = require('../middleware/verifyTokens'); // Update this path if necessary
const multer = require('../middleware/multerConfig'); // Update this path if necessary

// Upload a new medical record
router.post('/upload', verifyToken, multer.single('file'), medicalRecordController.uploadMedicalRecord);

// Get all medical records for the logged-in user
router.get('/', verifyToken, medicalRecordController.getMedicalRecords);

// Download a specific medical record
router.get('/download/:recordId', verifyToken, medicalRecordController.downloadMedicalRecord);

// Delete a specific medical record
router.delete('/:recordId', verifyToken, medicalRecordController.deleteMedicalRecord);

// View a specific medical record
router.get('/view/:recordId', verifyToken, medicalRecordController.viewMedicalRecord);


// Add other routes as needed...

module.exports = router;
