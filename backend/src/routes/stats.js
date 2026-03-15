const express = require("express");
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const { adminAuth } = require("../middleware/auth");
const router = express.Router();

// GET /api/stats - Admin dashboard statistics
router.get("/", adminAuth, async (req, res, next) => {
  try {
    const [users, products, orders] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Order.find(),
    ]);

    const revenue = orders.reduce(
      (sum, order) => sum + (order.totalAmount || order.total || 0),
      0
    );

    res.json({
      users,
      products,
      orders: orders.length,
      revenue,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
