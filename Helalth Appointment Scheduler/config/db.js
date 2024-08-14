const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;;
const db = mongoose.connection;

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Successfully connected to HAS MongoDB.'))
    .catch(error => console.error('MongoDB connection error:', error));

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function () {
    // we're connected!
    console.log('Connected to the MongoDB database.');
});

module.exports = mongoose;





