var mongoose = require('mongoose');

async function connectDB() {
    try {
        await mongoose.connect('mongodb://localhost/HAS', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1); // Exit process with failure
    }
}

module.exports = connectDB;
