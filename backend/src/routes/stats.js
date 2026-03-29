const express = require("express");
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const { adminAuth } = require("../middleware/auth");
const router = express.Router();

// GET /api/stats - Admin dashboard statistics (optimized with aggregation)
router.get("/", adminAuth, async (req, res, next) => {
  try {
    const [users, products, orderCount, revenueResult] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
      Order.aggregate([
        { $group: { _id: null, total: { $sum: { $ifNull: ["$totalAmount", "$total"] } } } }
      ]),
    ]);

    const revenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    res.json({
      users,
      products,
      orders: orderCount,
      revenue,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
