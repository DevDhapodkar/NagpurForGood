const mongoose = require('mongoose');

const DonationSchema = new mongoose.Schema({
    ngoName: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['clothes', 'food', 'education', 'medical', 'money', 'other'],
        default: 'clothes'
    },
    description: {
        type: String,
        required: true
    },
    message: {
        type: String
    },
    status: {
        type: String,
        enum: ['pending', 'contacted', 'completed', 'cancelled'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Donation', DonationSchema);
