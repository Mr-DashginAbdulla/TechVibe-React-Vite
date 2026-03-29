const express = require("express");
const Cart = require("../models/Cart");
const { auth } = require("../middleware/auth");
const router = express.Router();

// GET /api/cart - Get current user's cart
router.get("/", auth, async (req, res, next) => {
  try {
    const userId = req.user._id.toString();
    const items = await Cart.find({ userId });
    res.json(items);
  } catch (error) {
    next(error);
  }
});

// POST /api/cart - Add item to cart
router.post("/", auth, async (req, res, next) => {
  try {
    const item = await Cart.create({
      ...req.body,
      userId: req.user._id.toString(),
    });
    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
});

// PATCH /api/cart/:id - Update cart item (owner only)
router.patch("/:id", auth, async (req, res, next) => {
  try {
    const item = await Cart.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: "Cart item not found" });
    }
    if (item.userId !== req.user._id.toString()) {
      return res.status(403).json({ error: "Access denied" });
    }
    const updated = await Cart.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/cart/clear - Clear entire cart for current user
router.delete("/clear/:userId", auth, async (req, res, next) => {
  try {
    const userId = req.user._id.toString();
    const result = await Cart.deleteMany({ userId });
    res.json({ success: true, deletedCount: result.deletedCount });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/cart/:id - Remove single item from cart (owner only)
router.delete("/:id", auth, async (req, res, next) => {
  try {
    const item = await Cart.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: "Cart item not found" });
    }
    if (item.userId !== req.user._id.toString()) {
      return res.status(403).json({ error: "Access denied" });
    }
    await Cart.findByIdAndDelete(req.params.id);
    res.json({});
  } catch (error) {
    next(error);
  }
});

module.exports = router;
