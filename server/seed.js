const mongoose = require('mongoose');
const dotenv = require('dotenv');
const NGO = require('./models/NGO');
const Admin = require('./models/Admin');
const bcrypt = require('bcryptjs');
const fs = require('fs');

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Seeding...');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

const importData = async () => {
    try {
        // Clear NGOs
        await NGO.deleteMany();
        console.log('Existing NGOs removed.');

        // Clear Admins
        await Admin.deleteMany();
        console.log('Existing Admins removed.');

        const data = JSON.parse(fs.readFileSync('./ngos.json', 'utf-8'));
        
        // Insert NGOs
        await NGO.insertMany(data);
        console.log('NGO Data Imported!');

        // Create initial admin
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);

        await Admin.create({
            name: 'Super Admin',
            email: 'admin@nagpur.org',
            password: hashedPassword,
            role: 'Admin'
        });
        console.log('Initial Admin Created! (admin@nagpur.org / admin123)');

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

connectDB().then(importData);
