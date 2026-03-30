const express = require("express");
const User = require("../models/User");
const firebaseAdmin = require("../config/firebase-admin");
const { auth, adminAuth } = require("../middleware/auth");
const { getPaginationParams, paginatedResponse } = require("../utils/pagination");
const { auditMiddleware } = require("../middleware/auditLog");
const router = express.Router();

// GET /api/users - Admin only (paginated)
router.get("/", adminAuth, async (req, res, next) => {
  try {
    const { email } = req.query;
    const filter = {};
    if (email) filter.email = email;

    const total = await User.countDocuments(filter);
    const { page, limit, skip } = getPaginationParams(req.query);
    const users = await User.find(filter).select("-password").skip(skip).limit(limit);
    res.json(paginatedResponse(users, total, page, limit));
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
router.post("/", adminAuth, auditMiddleware("user"), async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

// PATCH /api/users/:id (owner or admin only)
router.patch("/:id", auth, auditMiddleware("user"), async (req, res, next) => {
  try {
    // Only owner or admin can update
    if (req.params.id !== req.user._id.toString() && req.user.role !== "admin" && req.user.role !== "super-admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    const updates = { ...req.body };

    // Non-admins cannot change their own role
    if (req.user.role === "user" && updates.role) {
      delete updates.role;
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "USER_NOT_FOUND" });
    }

    // If changing password, update it in Firebase directly
    if (updates.password) {
      if (user.firebaseUid) {
         await firebaseAdmin.auth().updateUser(user.firebaseUid, { password: updates.password });
      }
      delete updates.password; // Do not save password in MongoDB
    }

    // Update MongoDB
    const updatedUser = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/users/:id - Admin only
router.delete("/:id", adminAuth, auditMiddleware("user"), async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "USER_NOT_FOUND" });
    }

    // Also delete from Firebase if the user has a firebaseUid
    if (user.firebaseUid) {
       try {
          await firebaseAdmin.auth().deleteUser(user.firebaseUid);
       } catch (firebaseErr) {
          console.error("Failed to delete user from Firebase:", firebaseErr);
       }
    }
    res.json({});
  } catch (error) {
    next(error);
  }
});

module.exports = router;
