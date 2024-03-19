var mongoose = require('mongoose');

async function connectDB() {
    const dbURI = process.env.MONGODB_URI || 'mongodb://localhost/HAS'; // Default fallback to localhost
    try {
        await mongoose.connect(dbURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false, // This option is for handling deprecation warnings.
            useCreateIndex: true // This option is also for handling deprecation warnings.
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1); // Exit process with failure
    }
}

module.exports = connectDB;
