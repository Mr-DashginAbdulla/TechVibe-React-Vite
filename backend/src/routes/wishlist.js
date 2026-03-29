const express = require("express");
const Wishlist = require("../models/Wishlist");
const { auth } = require("../middleware/auth");
const router = express.Router();

// GET /api/wishlist
router.get("/", auth, async (req, res, next) => {
  try {
    const { productId } = req.query;
    const filter = { userId: req.user._id.toString() };
    if (productId) filter.productId = productId;

    const items = await Wishlist.find(filter).sort({ addedAt: -1 });
    res.json(items);
  } catch (error) {
    next(error);
  }
});

// POST /api/wishlist
router.post("/", auth, async (req, res, next) => {
  try {
    const item = await Wishlist.create({
      ...req.body,
      userId: req.user._id.toString(),
      addedAt: new Date().toISOString(),
    });
    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/wishlist/:id (owner only)
router.delete("/:id", auth, async (req, res, next) => {
  try {
    const item = await Wishlist.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: "Wishlist item not found" });
    }
    if (item.userId !== req.user._id.toString()) {
      return res.status(403).json({ error: "Access denied" });
    }
    await Wishlist.findByIdAndDelete(req.params.id);
    res.json({});
  } catch (error) {
    next(error);
  }
});

module.exports = router;
