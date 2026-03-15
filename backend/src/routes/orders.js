const express = require("express");
const Order = require("../models/Order");
const { auth, adminAuth } = require("../middleware/auth");
const router = express.Router();

// GET /api/orders - Get orders (admin: all, user: own)
router.get("/", auth, async (req, res, next) => {
  try {
    const { userId, status, _sort, _order } = req.query;
    const filter = {};

    // Regular users can only see their own orders
    if (req.user.role === "user") {
      filter.userId = req.user._id.toString();
    } else if (userId) {
      filter.userId = userId;
    }

    if (status && status !== "all") {
      filter.status = status;
    }

    let query = Order.find(filter);

    if (_sort) {
      const sortOrder = _order === "desc" ? -1 : 1;
      query = query.sort({ [_sort]: sortOrder });
    } else {
      query = query.sort({ createdAt: -1 });
    }

    const orders = await query;
    res.json(orders);
  } catch (error) {
    next(error);
  }
});

// GET /api/orders/:id
router.get("/:id", auth, async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "ORDER_NOT_FOUND" });
    }

    // Regular users can only view their own orders
    if (req.user.role === "user" && order.userId !== req.user._id.toString()) {
      return res.status(403).json({ error: "Access denied" });
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
});

// POST /api/orders - Create order
router.post("/", auth, async (req, res, next) => {
  try {
    const orderNumber = `ORD-${new Date().getFullYear()}-${Date.now().toString(36).toUpperCase()}`;
    const order = await Order.create({
      ...req.body,
      userId: req.user._id.toString(),
      orderNumber,
      status: "pending",
      timeline: [
        {
          status: "ordered",
          date: new Date().toISOString(),
          description: "Order placed",
        },
      ],
    });
    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
});

// PATCH /api/orders/:id - Update order (status, items etc.)
router.patch("/:id", auth, async (req, res, next) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!order) {
      return res.status(404).json({ error: "ORDER_NOT_FOUND" });
    }
    res.json(order);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/orders/:id - Admin only
router.delete("/:id", adminAuth, async (req, res, next) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "ORDER_NOT_FOUND" });
    }
    res.json({});
  } catch (error) {
    next(error);
  }
});

module.exports = router;
