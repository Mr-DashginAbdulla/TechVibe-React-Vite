const express = require("express");
const Brand = require("../models/Brand");
const { adminAuth } = require("../middleware/auth");
const router = express.Router();

// GET /api/brands
router.get("/", async (req, res, next) => {
  try {
    const brands = await Brand.find();
    res.json(brands);
  } catch (error) {
    next(error);
  }
});

// GET /api/brands/:id
router.get("/:id", async (req, res, next) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return res.status(404).json({ error: "Brand not found" });
    }
    res.json(brand);
  } catch (error) {
    next(error);
  }
});

// POST /api/brands - Admin only
router.post("/", adminAuth, async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (!data._id) {
      data._id = "brand-" + Date.now().toString(36);
    }
    const brand = await Brand.create(data);
    res.status(201).json(brand);
  } catch (error) {
    next(error);
  }
});

// PATCH /api/brands/:id - Admin only
router.patch("/:id", adminAuth, async (req, res, next) => {
  try {
    const brand = await Brand.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!brand) {
      return res.status(404).json({ error: "Brand not found" });
    }
    res.json(brand);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/brands/:id - Admin only
router.delete("/:id", adminAuth, async (req, res, next) => {
  try {
    const brand = await Brand.findByIdAndDelete(req.params.id);
    if (!brand) {
      return res.status(404).json({ error: "Brand not found" });
    }
    res.json({});
  } catch (error) {
    next(error);
  }
});

module.exports = router;
