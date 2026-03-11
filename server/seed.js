const mongoose = require('mongoose');
const dotenv = require('dotenv');
const NGO = require('./models/NGO');
const pkg = require('../app/src/data/ngoData.js');

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB Connected for Seeding...');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

const importData = async () => {
    try {
        await NGO.deleteMany();
        console.log('Existing NGOs removed.');

        // This requires slightly adjusting the export of ngoData so Node can read it, 
        // or just copying the array for the seed script directly:
        
        await NGO.insertMany(pkg.ngoData);
        console.log('Data Imported!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

connectDB().then(importData);
