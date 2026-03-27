const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const admin = require('firebase-admin');

// Initialize Firebase Admin
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.STORAGE_BUCKET
});

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect DB
const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            console.warn("MONGO_URI not found in environment variables. Set this up in your .env file.");
            console.warn("Server is running without Database connection for layout rendering.");
            return;
        }

        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

connectDB();

// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/ngos', require('./routes/ngos'));
app.use('/api/donations', require('./routes/donations'));
app.use('/api/upload', require('./routes/upload'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
