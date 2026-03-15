const express = require("express");
const Cart = require("../models/Cart");
const { auth } = require("../middleware/auth");
const router = express.Router();

// GET /api/cart?userId=xxx
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

// PATCH /api/cart/:id - Update cart item
router.patch("/:id", auth, async (req, res, next) => {
  try {
    const item = await Cart.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!item) {
      return res.status(404).json({ error: "Cart item not found" });
    }
    res.json(item);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/cart/clear/:userId - Clear entire cart for user
router.delete("/clear/:userId", auth, async (req, res, next) => {
  try {
    const userId = req.user._id.toString();
    const result = await Cart.deleteMany({ userId });
    res.json({ success: true, deletedCount: result.deletedCount });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/cart/:id - Remove single item from cart
router.delete("/:id", auth, async (req, res, next) => {
  try {
    const item = await Cart.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ error: "Cart item not found" });
    }
    res.json({});
  } catch (error) {
    next(error);
  }
});

module.exports = router;
