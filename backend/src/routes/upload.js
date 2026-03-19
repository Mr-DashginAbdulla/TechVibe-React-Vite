const express = require('express');
const multer = require('multer');
const admin = require('../config/firebase-admin');
const { adminAuth, auth } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// POST /api/upload
router.post('/', auth, upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // FIREBASE_STORAGE_BUCKET must be defined in .env (e.g., "my-app.appspot.com")
    // If it's not and admin initialization didn't set default, we mock it.
    const bucketName = process.env.FIREBASE_STORAGE_BUCKET;
    if (!bucketName) {
      console.warn("FIREBASE_STORAGE_BUCKET not set in .env. Mocking upload url.");
      return res.json({ url: `https://fake-storage.com/${req.file.originalname}` });
    }

    const bucket = admin.storage().bucket(bucketName);
    const filename = `${uuidv4()}-${req.file.originalname.replace(/[^a-zA-Z0-9.]/g, '_')}`;
    const file = bucket.file(`uploads/${filename}`);

    const stream = file.createWriteStream({
      metadata: {
        contentType: req.file.mimetype,
      },
    });

    stream.on('error', (err) => {
      console.error(err);
      res.status(500).json({ error: 'Failed to upload image' });
    });

    stream.on('finish', async () => {
      try {
        await file.makePublic();
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`;
        res.json({ url: publicUrl });
      } catch (err) {
        console.warn("Storage rules might prevent makePublic(). Using standard token url.");
        const [url] = await file.getSignedUrl({
          action: 'read',
          expires: '03-01-2500' // Far future
        });
        res.json({ url });
      }
    });

    stream.end(req.file.buffer);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
