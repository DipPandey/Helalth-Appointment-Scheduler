const MedicalRecord = require('../models/mrecords');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Upload a medical record to the database
exports.uploadMedicalRecord = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded.' });
    }

    try {
        // Construct the relative path to store in the database
        const relativePath = path.join('uploads/', req.file.filename);

        const newRecord = new MedicalRecord({
            name: req.file.originalname,
            filePath: relativePath, // Store the relative path
            uploadedDate: new Date(),
            patientId: req.user._id,
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
        const record = await MedicalRecord.findById(req.params.recordId);
        if (!record) {
            return res.status(404).json({ message: 'Record not found' });
        }

        // Use the relative path to get the full path on the server
        const filePath = path.join(__dirname, '..', record.filePath);

        // Check if the file exists before trying to delete it
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath); // Delete the file synchronously
        } else {
            console.error(`File not found: ${filePath}`);
        }

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

        // The file's path should be relative to the server's root
        const filePath = path.join(__dirname, '..', record.filePath);

        // Check if file exists before attempting to send it
        if (fs.existsSync(filePath)) {
            res.download(filePath, record.name); // Utilize Express's res.download() method
        } else {
            res.status(404).json({ message: 'File not found' });
        }
    } catch (error) {
        console.error('Error downloading the record:', error);
        res.status(500).json({ message: 'Error downloading the record', error });
    }
};

exports.viewMedicalRecord = async (req, res) => {
    try {
        const record = await MedicalRecord.findById(req.params.recordId);
        if (!record) {
            return res.status(404).send('Record not found');
        }
        const filePath = path.join(__dirname, '..', '../uploads', record.filePath);
        if (fs.existsSync(filePath)) {
            // Set inline disposition for viewing in the browser
            res.setHeader('Content-Disposition', 'inline');
            res.sendFile(filePath);
        } else {
            res.status(404).send('File not found');
        }
    } catch (error) {
        res.status(500).send('Server error');
    }
};

// ... (rest of your exports)
