const express = require("express");
const Order = require("../models/Order");
const User = require("../models/User"); // Needed to get user email
const { auth, adminAuth } = require("../middleware/auth");
const sendEmail = require("../utils/sendEmail");
const { orderConfirmationTemplate, orderStatusUpdateTemplate } = require("../utils/emailTemplates");
const Notification = require("../models/Notification");
const { getIO } = require("../utils/socket");
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
      // We don't fail the order creation if email fails
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
      // Emit to admin room
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

// PATCH /api/orders/:id - Update order (status, items etc.)
router.patch("/:id", auth, async (req, res, next) => {
  try {
    // Determine if status is being updated to trigger email
    const originalOrder = await Order.findById(req.params.id);
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!order) {
      return res.status(404).json({ error: "ORDER_NOT_FOUND" });
    }

    // Send status update email if status changed
    if (req.body.status && originalOrder && originalOrder.status !== req.body.status) {
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
        
        // Emit to user room
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
