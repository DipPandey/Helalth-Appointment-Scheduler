const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    filePath: {
        type: String,
        required: true
    },
    uploadedDate: {
        type: Date,
        default: Date.now
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming you have a User model
        required: true
    }
});

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);
