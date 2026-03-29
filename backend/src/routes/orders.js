const express = require("express");
const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");
const { auth, adminAuth } = require("../middleware/auth");
const sendEmail = require("../utils/sendEmail");
const { orderConfirmationTemplate, orderStatusUpdateTemplate } = require("../utils/emailTemplates");
const Notification = require("../models/Notification");
const { getIO } = require("../utils/socket");
const { getPaginationParams, paginatedResponse } = require("../utils/pagination");
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

    const total = await Order.countDocuments(filter);
    const { page, limit, skip } = getPaginationParams(req.query);
    query = query.skip(skip).limit(limit);

    const orders = await query;
    res.json(paginatedResponse(orders, total, page, limit));
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
    // Validate stock availability before creating order
    const items = req.body.items || [];
    for (const item of items) {
      if (!item.productId) continue;
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(400).json({ error: `Product not found: ${item.productId}` });
      }
      if (product.stock < (item.quantity || 1)) {
        return res.status(400).json({
          error: `Insufficient stock for "${product.name}". Available: ${product.stock}`,
        });
      }
    }

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

    // Decrease stock after successful order creation
    for (const item of items) {
      if (!item.productId) continue;
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -(item.quantity || 1) },
      });
    }

    // Send confirmation email
    try {
      const user = await User.findById(req.user._id);
      if (user && user.email) {
        await sendEmail({
          to: user.email,
          subject: `TechVibe Sifariş Təsdiqi - ${order.orderNumber}`,
          html: orderConfirmationTemplate(order, user)
        });
      }
    } catch (emailError) {
      console.error("Failed to send order confirmation email:", emailError);
    }

    // Create Notification for Admins
    try {
      const notification = await Notification.create({
        recipient: "admin",
        type: "NEW_ORDER",
        title: "Yeni Sifariş",
        message: `Yeni sifariş məlumatı daxil oldu: ${order.orderNumber}`,
        relatedId: order._id
      });
      const io = getIO();
      if (io) {
        io.to("admin").emit("new_notification", notification);
      }
    } catch (notificationErr) {
      console.error("Failed to create admin notification:", notificationErr);
    }

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
});

// PATCH /api/orders/:id - Update order (Admin or Owner for cancellation)
router.patch("/:id", auth, async (req, res, next) => {
  try {
    const originalOrder = await Order.findById(req.params.id);
    if (!originalOrder) {
      return res.status(404).json({ error: "ORDER_NOT_FOUND" });
    }

    const isAdmin = req.user.role === "admin" || req.user.role === "super-admin";
    const isOwner = originalOrder.userId === req.user._id.toString();

    // Regular users can only cancel their own pending/processing orders
    if (!isAdmin) {
      if (!isOwner) {
        return res.status(403).json({ error: "Access denied" });
      }
      // Users can only set status to "cancelled" and nothing else
      if (req.body.status && req.body.status !== "cancelled") {
        return res.status(403).json({ error: "Only admins can change order status" });
      }
      if (req.body.status === "cancelled" && !["pending", "processing"].includes(originalOrder.status)) {
        return res.status(400).json({ error: "Order can only be cancelled when pending or processing" });
      }
    }

    const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    // Restore stock if order is being cancelled
    if (req.body.status === "cancelled" && originalOrder.status !== "cancelled") {
      for (const item of order.items || []) {
        if (!item.productId) continue;
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { stock: (item.quantity || 1) },
        });
      }
    }

    // Send status update email if status changed
    if (req.body.status && originalOrder.status !== req.body.status) {
      try {
        const user = await User.findById(order.userId);
        if (user && user.email) {
          await sendEmail({
            to: user.email,
            subject: `TechVibe Sifariş Statusu: ${order.status.toUpperCase()} - ${order.orderNumber}`,
            html: orderStatusUpdateTemplate(order, user)
          });
        }
      } catch (emailError) {
        console.error("Failed to send status update email:", emailError);
      }

      // Create Notification for User
      try {
        const statusTranslations = {
          pending: 'Gözləyir',
          processing: 'Hazırlanır',
          shipped: 'Göndərildi',
          delivered: 'Çatdırıldı',
          cancelled: 'Ləğv edildi'
        };
        const statusText = statusTranslations[order.status] || order.status;

        const notification = await Notification.create({
          recipient: order.userId,
          type: "ORDER_STATUS_UPDATE",
          title: "Sifarişinizin statusu dəyişdi",
          message: `Sifariş (${order.orderNumber}) statusu: ${statusText}`,
          relatedId: order._id
        });
        
        const io = getIO();
        if (io) {
          io.to(order.userId.toString()).emit("new_notification", notification);
        }
      } catch (notificationErr) {
        console.error("Failed to create user notification:", notificationErr);
      }
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
