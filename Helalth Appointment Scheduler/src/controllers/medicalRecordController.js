const MedicalRecord = require('../models/mrecords');

// Upload a medical record to the database
exports.uploadMedicalRecord = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded.' });
    }

    try {
        // Here we are assuming that req.patientId is being set correctly by your authentication middleware
        const newRecord = new MedicalRecord({
            name: req.file.originalname,
            filePath: req.file.path,
            uploadedDate: new Date(),
            patientId: req.patientId // make sure this is the right patient ID
        });

        await newRecord.save();

        res.status(201).json({
            message: 'File uploaded successfully',
            record: newRecord
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to upload the file',
            error: error.message
        });
    }
};

// Get all medical records for a patient
exports.getMedicalRecords = async (req, res) => {
    try {
        const records = await MedicalRecord.find({ patientId: req.patientId });
        res.status(200).json(records);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to retrieve records',
            error: error.message
        });
    }
};

// ... Add other methods for handling downloads, deletion, etc. ...
