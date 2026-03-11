const express = require('express');
const router = express.Router();
const NGO = require('../models/NGO');
const auth = require('../middleware/auth');

// @route   GET /api/ngos
// @desc    Get all NGOs
// @access  Public
router.get('/', async (req, res) => {
    try {
        const ngos = await NGO.find();
        res.json(ngos);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/ngos
// @desc    Create a new NGO profile (Pending verification)
// @access  Private
router.post('/', auth, async (req, res) => {
    try {
        // Generate an ID slug if not provided
        const slugId = req.body.id || req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        
        const newNGO = new NGO({
            ...req.body,
            id: slugId,
            verified: false // Always force new entries to pending
        });

        const ngo = await newNGO.save();
        res.json(ngo);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/ngos/:id
// @desc    Update an NGO profile
// @access  Private
router.put('/:id', auth, async (req, res) => {
    try {
        let ngo = await NGO.findOne({ id: req.params.id });
        if (!ngo) return res.status(404).json({ msg: 'NGO not found' });

        ngo = await NGO.findOneAndUpdate(
            { id: req.params.id },
            { $set: req.body },
            { new: true }
        );

        res.json(ngo);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/ngos/:id
// @desc    Delete an NGO profile
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const ngo = await NGO.findOne({ id: req.params.id });
        if (!ngo) return res.status(404).json({ msg: 'NGO not found' });

        await NGO.findOneAndDelete({ id: req.params.id });
        res.json({ msg: 'NGO removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/ngos/:id/verify
// @desc    Verify an NGO profile
// @access  Private
router.put('/:id/verify', auth, async (req, res) => {
    try {
        let ngo = await NGO.findOne({ id: req.params.id });
        if (!ngo) return res.status(404).json({ msg: 'NGO not found' });

        ngo.verified = true;
        await ngo.save();

        res.json(ngo);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
