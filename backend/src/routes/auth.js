const express = require("express");
const User = require("../models/User");
const { auth } = require("../middleware/auth");
const firebaseAdmin = require("../config/firebase-admin");
const router = express.Router();

// POST /api/auth/register
// User is already created in Firebase. We just sync them to MongoDB.
router.post("/register", async (req, res, next) => {
  try {
    const { firstName, lastName, email, firebaseUid } = req.body;

    if (!firebaseUid) {
      return res.status(400).json({ error: "Missing Firebase UID" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "EMAIL_EXISTS" });
    }

    const user = await User.create({
      firebaseUid,
      firstName,
      lastName,
      email,
      memberSince: new Date().toISOString(),
      isVerified: false // They just registered, Firebase will verify them
    });

    res.status(201).json(user);
  } catch (error) {
    if (error.code === 11000) {
        return res.status(400).json({ error: "EMAIL_EXISTS" });
    }
    next(error);
  }
});

// POST /api/auth/login
// Receives Firebase ID Token from frontend, verifies it, returns MongoDB User
router.post("/login", async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "NO_TOKEN_PROVIDED" });
    }

    const idToken = authHeader.split("Bearer ")[1];
    
    // Verify token with Firebase Admin
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
    const { uid, email, email_verified } = decodedToken;

    // Find the user in our database
    let user = await User.findOne({ firebaseUid: uid });

    if (!user) {
      // If user logged in with Google for the first time, they won't be in our DB yet
      // Check if they passed first/last name in body as a fallback
      const { firstName = "User", lastName = "" } = req.body;
      
      user = await User.create({
        firebaseUid: uid,
        email,
        firstName,
        lastName,
        isVerified: email_verified,
        memberSince: new Date().toISOString()
      });
    } else if (email_verified && !user.isVerified) {
        // Update verification status if it changed in Firebase
        user.isVerified = true;
        await user.save();
    }

    if (!user.isVerified) {
       return res.status(403).json({ error: "ACCOUNT_NOT_VERIFIED", email: user.email });
    }

    // Return the user data (Frontend uses Firebase Token for subsequent requests)
    res.json({ ...user.toJSON(), token: idToken });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(401).json({ error: "INVALID_TOKEN" });
  }
});

// GET /api/auth/me - Get current user
router.get("/me", auth, async (req, res) => {
  res.json(req.user);
});

// POST /api/auth/check-email
router.post("/check-email", async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    res.json({ exists: !!user });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
