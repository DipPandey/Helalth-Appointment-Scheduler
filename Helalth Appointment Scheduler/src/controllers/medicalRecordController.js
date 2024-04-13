const MedicalRecord = require('../models/mrecords');

// Upload a medical record to the database
exports.uploadMedicalRecord = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded.' });
    }

    try {
        const patientId = req.user._id; // Make sure this is being set by your auth middleware
        const newRecord = new MedicalRecord({
            name: req.file.originalname, // Use the original file name
            filePath: req.file.path, // Use the file path from Multer
            uploadedDate: new Date(), // Use the current date or req.file.uploadedDate if you've set it in Multer
            patientId, // Use the patient ID from the authenticated user
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
        const patientId = req.user._id.toString();
        const records = await MedicalRecord.find({ patientId: patientId });
        res.status(200).json(records);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to retrieve records',
            error: error.message
        });
    }
};

// ... Add other methods for handling downloads, deletion, etc. ...
