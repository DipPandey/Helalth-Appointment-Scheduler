const MedicalRecord = require('../models/mrecords'); // Assuming a Mongoose model is set up

exports.uploadMedicalRecord = async (req, res) => {
    try {
        const { file } = req;
        // Assuming file handling middleware like multer is in use
        const record = new MedicalRecord({
            name: file.originalname,
            uploadedDate: new Date(),
            filePath: file.path, // Assuming file storage setup
            userId: req.user._id, // Assuming user is attached to req via middleware
        });
        await record.save();
        res.status(201).json({ message: 'Medical record uploaded successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to upload medical record', error: error.toString() });
    }
};

exports.getMedicalRecords = async (req, res) => {
    try {
        const records = await MedicalRecord.find({ userId: req.user._id });
        res.json(records);
    } catch (error) {
        res.status(500).json({ message: 'Failed to get medical records', error: error.toString() });
    }
};

// Add more controller methods for downloading and deleting records as needed
