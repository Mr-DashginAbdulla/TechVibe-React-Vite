const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { auth } = require("../middleware/auth");
const router = express.Router();

// Generate JWT
const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

// POST /api/auth/register
router.post("/register", async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "EMAIL_EXISTS" });
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      memberSince: new Date().toISOString(),
    });

    const token = generateToken(user);
    res.status(201).json({ ...user.toJSON(), token });
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/login
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "USER_NOT_FOUND" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: "WRONG_PASSWORD" });
    }

    const token = generateToken(user);
    res.json({ ...user.toJSON(), token });
  } catch (error) {
    next(error);
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
