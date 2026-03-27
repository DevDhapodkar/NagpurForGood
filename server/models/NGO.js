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
    boardOfDirectors: [{
        name: String,
        role: String,
        profileUrl: String,
        linkedin: String
    }],
    teamAndLeadership: [{
        name: String,
        role: String,
        profileUrl: String,
        linkedin: String
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
        linkedin: String,
        email: String
    },
    appLinks: {
        android: String,
        ios: String
    },
    awards: [{ type: String }],
    volunteerOps: { type: Boolean, default: false },
    testimonials: [{
        name: String,
        quote: String,
        role: String
    }],
    adminPR: {
        experienceScore: Number,
        transparencyRating: Number,
        teamResponsiveness: Number,
        reputationScore: Number,
        fieldVisitDone: Boolean,
        visitNotes: String,
        lastUpdated: Date
    },
    trustScoreOverrides: {
        type: Map,
        of: Number,
        default: {}
    }
}, { timestamps: true });

module.exports = mongoose.model('NGO', NGOSchema);
