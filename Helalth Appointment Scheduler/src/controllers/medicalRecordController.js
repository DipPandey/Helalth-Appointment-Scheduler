const MedicalRecord = require('../models/mrecords');
const fs = require('fs');
const path = require('path');

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

exports.deleteMedicalRecord = async (req, res) => {
    try {
        // Find the record to get the filePath
        const record = await MedicalRecord.findById(req.params.recordId);
        if (!record) {
            return res.status(404).json({ message: 'Record not found' });
        }

        // Build the full file path using the filePath from the record
        const filePath = path.join(__dirname, '..', 'uploads', record.filePath); // Adjust the path as needed

        // Check if the file exists before trying to delete it
        if (fs.existsSync(filePath)) {
            // Use the synchronous version to ensure the file is deleted before the database operation
            fs.unlinkSync(filePath);
        } else {
            // If the file doesn't exist, log the error (optional)
            console.error(`File not found: ${filePath}`);
        }

        // After deleting the file, delete the record from the database
        await MedicalRecord.findByIdAndDelete(req.params.recordId);
        res.status(200).json({ message: 'Record and file deleted successfully' });
    } catch (error) {
        console.error('Failed to delete record:', error);
        res.status(500).json({ message: 'Failed to delete record', error: error.message });
    }
};
exports.downloadMedicalRecord = async (req, res) => {
    try {
        const record = await MedicalRecord.findById(req.params.recordId);
        if (!record) {
            return res.status(404).json({ message: 'Record not found' });
        }

        const filePath = path.join(__dirname, '..', 'uploads', record.filePath); // Make sure this path is correct

        // Check if file exists before trying to send it
        if (fs.existsSync(filePath)) {
            // Set the headers to prompt download and set the original file name
            res.download(filePath, record.name);
        } else {
            res.status(404).send('File not found');
        }
    } catch (error) {
        console.error('Error downloading record:', error);
        res.status(500).json({ message: 'Error downloading record', error: error.message });
    }
};

// ... Add other methods for handling downloads, deletion, etc. ...
