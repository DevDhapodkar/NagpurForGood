const mongoose = require('mongoose');

const NGOSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true }, // Slug ID
    name: { type: String, required: true },
    chairperson: { type: String },
    founder: { type: String },
    address: { type: String },
    contact: { type: String },
    description: { type: String, required: true },
    longDescription: { type: String },
    categories: [{ type: String }],
    image: { type: String },
    logo: { type: String },
    website: { type: String },
    mockUPI: { type: String },
    verified: { type: Boolean, default: false },
    certifications: [{ type: String }],
    legalDetails: {
        registrationNo: String,
        csr1: String,
        section80G: String,
        section12A: String
    },
    leadership: [{
        name: String,
        role: String
    }],
    impactStats: [{
        label: String,
        value: String,
        sourceUrl: String
    }],
    programs: [{
        title: String,
        description: String,
        impact: String
    }],
    recentActivities: [{
        title: String,
        date: String,
        description: String,
        sourceUrl: String
    }],
    socialLinks: {
        instagram: String,
        facebook: String,
        youtube: String,
        email: String
    }
}, { timestamps: true });

module.exports = mongoose.model('NGO', NGOSchema);
