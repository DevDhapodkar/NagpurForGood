const express = require('express');
const router = express.Router();
const Donation = require('../models/Donation');
const auth = require('../middleware/auth');

// @route   POST /api/donations
// @desc    Submit a new donation request
// @access  Public
router.post('/', async (req, res) => {
    try {
        const { ngoName, name, contact, type, description, message } = req.body;

        const newDonation = new Donation({
            ngoName,
            name,
            contact,
            type,
            description,
            message
        });

        const donation = await newDonation.save();
        res.json(donation);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/donations
// @desc    Get all donation requests (Admin only)
// @access  Public (protected by Firebase auth on frontend)
router.get('/', async (req, res) => {
    try {
        const donations = await Donation.find().sort({ createdAt: -1 });
        res.json(donations);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/donations/:id/status
// @desc    Update donation status
// @access  Public (protected by Firebase auth on frontend)
router.put('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        let donation = await Donation.findById(req.params.id);

        if (!donation) return res.status(404).json({ msg: 'Donation not found' });

        donation.status = status;
        await donation.save();

        res.json(donation);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
