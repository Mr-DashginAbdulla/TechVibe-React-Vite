const express = require("express");
const Address = require("../models/Address");
const { auth } = require("../middleware/auth");
const router = express.Router();

// GET /api/addresses - Get current user's addresses
router.get("/", auth, async (req, res, next) => {
  try {
    const addresses = await Address.find({ userId: req.user._id.toString() });
    res.json(addresses);
  } catch (error) {
    next(error);
  }
});

// GET /api/addresses/:id (owner only)
router.get("/:id", auth, async (req, res, next) => {
  try {
    const address = await Address.findById(req.params.id);
    if (!address) {
      return res.status(404).json({ error: "ADDRESS_NOT_FOUND" });
    }
    if (address.userId !== req.user._id.toString()) {
      return res.status(403).json({ error: "Access denied" });
    }
    res.json(address);
  } catch (error) {
    next(error);
  }
});

// POST /api/addresses
router.post("/", auth, async (req, res, next) => {
  try {
    const address = await Address.create({
      ...req.body,
      userId: req.user._id.toString(),
    });
    res.status(201).json(address);
  } catch (error) {
    next(error);
  }
});

// PATCH /api/addresses/:id (owner only)
router.patch("/:id", auth, async (req, res, next) => {
  try {
    const address = await Address.findById(req.params.id);
    if (!address) {
      return res.status(404).json({ error: "ADDRESS_NOT_FOUND" });
    }
    if (address.userId !== req.user._id.toString()) {
      return res.status(403).json({ error: "Access denied" });
    }
    const updated = await Address.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/addresses/:id (owner only)
router.delete("/:id", auth, async (req, res, next) => {
  try {
    const address = await Address.findById(req.params.id);
    if (!address) {
      return res.status(404).json({ error: "ADDRESS_NOT_FOUND" });
    }
    if (address.userId !== req.user._id.toString()) {
      return res.status(403).json({ error: "Access denied" });
    }
    await Address.findByIdAndDelete(req.params.id);
    res.json({});
  } catch (error) {
    next(error);
  }
});

module.exports = router;
