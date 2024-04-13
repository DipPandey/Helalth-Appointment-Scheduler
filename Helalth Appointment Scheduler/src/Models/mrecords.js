// This should be in your MedicalRecord.js model file
const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
    name: String,
    filePath: String,
    uploadedDate: Date,
    patientId: String, // this can be an ObjectId if you reference another collection
});

const MedicalRecord = mongoose.model('MedicalRecord', medicalRecordSchema);

module.exports = MedicalRecord;
