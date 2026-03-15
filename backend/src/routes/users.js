const express = require("express");
const User = require("../models/User");
const { auth, adminAuth } = require("../middleware/auth");
const router = express.Router();

// GET /api/users - Admin only
router.get("/", adminAuth, async (req, res, next) => {
  try {
    const { email } = req.query;
    const filter = {};
    if (email) filter.email = email;

    const users = await User.find(filter).select("-password");
    res.json(users);
  } catch (error) {
    next(error);
  }
});

// GET /api/users/:id
router.get("/:id", auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "USER_NOT_FOUND" });
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
});

// POST /api/users - Admin create user
router.post("/", adminAuth, async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

// PATCH /api/users/:id
router.patch("/:id", auth, async (req, res, next) => {
  try {
    const updates = { ...req.body };

    // If changing password, hash it
    if (updates.password) {
      const bcrypt = require("bcryptjs");
      updates.password = await bcrypt.hash(updates.password, 12);
    }

    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({ error: "USER_NOT_FOUND" });
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/users/:id - Admin only
router.delete("/:id", adminAuth, async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "USER_NOT_FOUND" });
    }
    res.json({});
  } catch (error) {
    next(error);
  }
});

module.exports = router;
