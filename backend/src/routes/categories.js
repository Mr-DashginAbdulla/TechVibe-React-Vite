const express = require("express");
const Category = require("../models/Category");
const { adminAuth } = require("../middleware/auth");
const { cacheMiddleware } = require("../middleware/cache");
const router = express.Router();

// GET /api/categories
router.get("/", cacheMiddleware, async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    next(error);
  }
});

// GET /api/categories/:id
router.get("/:id", async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json(category);
  } catch (error) {
    next(error);
  }
});

// POST /api/categories - Admin only
router.post("/", adminAuth, async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (!data._id) {
      data._id = (data.name || "cat").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || Date.now().toString(36);
    }
    const category = await Category.create(data);
    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
});

// PATCH /api/categories/:id - Admin only
router.patch("/:id", adminAuth, async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json(category);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/categories/:id - Admin only
router.delete("/:id", adminAuth, async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json({});
  } catch (error) {
    next(error);
  }
});

module.exports = router;
