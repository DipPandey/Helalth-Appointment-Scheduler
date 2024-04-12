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
    patientId: {
        type: String,
        required: true
    }
});

const MedicalRecord = mongoose.model('MedicalRecord', medicalRecordSchema);

module.exports = MedicalRecord;
