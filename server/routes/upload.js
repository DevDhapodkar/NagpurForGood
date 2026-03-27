const express = require('express');
const router = express.Router();
const multer = require('multer');
const admin = require('firebase-admin');
const path = require('path');

// Configure Multer (memory storage)
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// @route   POST /api/upload
// @desc    Upload file to Firebase Storage
// @access  Public (or semi-public for registration)
router.post('/', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ msg: 'No file uploaded' });
        }

        const bucket = admin.storage().bucket();
        const pathPrefix = req.body.pathPrefix || 'general';
        const fileName = `${pathPrefix}/${Date.now()}-${req.file.originalname.replace(/[^a-zA-Z0-9.]/g, '_')}`;
        
        const file = bucket.file(fileName);
        
        const blobStream = file.createWriteStream({
            metadata: {
                contentType: req.file.mimetype
            }
        });

        blobStream.on('error', (err) => {
            console.error('BlobStream error:', err);
            res.status(500).json({ msg: 'Error uploading to Firebase Storage' });
        });

        blobStream.on('finish', async () => {
            // Make the file public or get a signed URL
            // Since the project seems to use public URLs for NGOs:
            try {
                // For simplicity and matching current client-side behavior, we'll use public read access
                await file.makePublic();
                const publicUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`;
                res.json({ url: publicUrl });
            } catch (makePublicErr) {
                console.warn('MakePublic failed, attempting signed URL instead:', makePublicErr);
                // Fallback to signed URL if makePublic is restricted
                const [signedUrl] = await file.getSignedUrl({
                    action: 'read',
                    expires: '03-01-2500' // Far future
                });
                res.json({ url: signedUrl });
            }
        });

        blobStream.end(req.file.buffer);

    } catch (err) {
        console.error('Upload Error:', err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
