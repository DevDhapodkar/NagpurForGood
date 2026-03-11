const express = require('require');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const auth = require('../middleware/auth');

// @route   POST api/auth/signup
// @desc    Register new admin
// @access  Public
router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        let admin = await Admin.findOne({ email });
        if (admin) {
            return res.status(400).json({ msg: 'Admin already exists' });
        }

        admin = new Admin({ name, email, password });

        const salt = await bcrypt.genSalt(10);
        admin.password = await bcrypt.hash(password, salt);

        await admin.save();

        const payload = { user: { id: admin.id, role: admin.role, name: admin.name } };
        jwt.sign(payload, process.env.JWT_SECRET || 'fallback_secret_for_dev', { expiresIn: '5 days' }, (err, token) => {
            if (err) throw err;
            res.json({ token, user: { id: admin.id, name: admin.name, email: admin.email, role: admin.role } });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/auth/login
// @desc    Authenticate admin & get token
// @access  Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        let admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const payload = { user: { id: admin.id, role: admin.role, name: admin.name } };
        jwt.sign(payload, process.env.JWT_SECRET || 'fallback_secret_for_dev', { expiresIn: '5 days' }, (err, token) => {
            if (err) throw err;
            res.json({ token, user: { id: admin.id, name: admin.name, email: admin.email, role: admin.role } });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/auth/me
// @desc    Get logged in admin profile
// @access  Private
router.get('/me', auth, async (req, res) => {
    try {
        const admin = await Admin.findById(req.user.id).select('-password');
        res.json(admin);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
