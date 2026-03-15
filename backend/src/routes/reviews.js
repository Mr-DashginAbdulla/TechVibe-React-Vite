const express = require("express");
const Review = require("../models/Review");
const { auth, adminAuth, optionalAuth } = require("../middleware/auth");
const router = express.Router();

// GET /api/reviews - Get all reviews (with optional productId filter)
router.get("/", async (req, res, next) => {
  try {
    const { productId } = req.query;
    const filter = {};
    if (productId) filter.productId = productId;

    const reviews = await Review.find(filter).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    next(error);
  }
});

// POST /api/reviews - Create review (auth required)
router.post("/", auth, async (req, res, next) => {
  try {
    const review = await Review.create({
      ...req.body,
      userId: req.user._id.toString(),
    });
    res.status(201).json(review);
  } catch (error) {
    next(error);
  }
});

// PATCH /api/reviews/:id - Update review (owner only)
router.patch("/:id", auth, async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    // Only owner or admin can update
    if (
      review.userId !== req.user._id.toString() &&
      req.user.role !== "admin" &&
      req.user.role !== "super-admin"
    ) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const updated = await Review.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/reviews/:id - Delete review (owner or admin)
router.delete("/:id", auth, async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    if (
      review.userId !== req.user._id.toString() &&
      req.user.role !== "admin" &&
      req.user.role !== "super-admin"
    ) {
      return res.status(403).json({ error: "Not authorized" });
    }

    await Review.findByIdAndDelete(req.params.id);
    res.json({});
  } catch (error) {
    next(error);
  }
});

module.exports = router;
