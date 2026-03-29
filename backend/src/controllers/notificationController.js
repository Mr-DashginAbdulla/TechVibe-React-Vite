const Notification = require("../models/Notification");
const { getIO } = require("../utils/socket");

// Get notifications for current user or admin
exports.getNotifications = async (req, res, next) => {
  try {
    const userId = req.user._id.toString();
    const role = req.user.role;
    
    // Admin gets both "admin" directed and their own. User gets their own.
    const query = role === "admin" 
      ? { $or: [{ recipient: "admin" }, { recipient: userId }] }
      : { recipient: userId };

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({ success: true, count: notifications.length, data: notifications });
  } catch (err) {
    next(err);
  }
};

// Mark sub-set of or specific notification as read
exports.markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id.toString();
    const role = req.user.role;

    const notification = await Notification.findById(id);
    if (!notification) {
      return res.status(404).json({ success: false, message: "Bildiriş tapılmadı" });
    }

    // Verify ownership
    if (role !== "admin" && notification.recipient.toString() !== userId) {
      return res.status(403).json({ success: false, message: "İcazəniz yoxdur" });
    }

    notification.read = true;
    await notification.save();

    // Emit event to sync read state across tabs
    try {
      const io = getIO();
      if (io) {
        const room = notification.recipient === "admin" ? "admin" : notification.recipient.toString();
        io.to(room).emit("notification_read", notification._id.toString());
      }
    } catch (err) {
      console.error("Socket error on markAsRead", err);
    }

    res.status(200).json({ success: true, data: notification });
  } catch (err) {
    next(err);
  }
};

// Mark all as read
exports.markAllAsRead = async (req, res, next) => {
  try {
    const userId = req.user._id.toString();
    const role = req.user.role;
    
    const query = role === "admin" 
      ? { $or: [{ recipient: "admin" }, { recipient: userId }] }
      : { recipient: userId };

    await Notification.updateMany(query, { read: true });

    // Emit event to sync all-read state across tabs
    try {
      const io = getIO();
      if (io) {
        const room = role === "admin" ? "admin" : userId;
        io.to(room).emit("all_notifications_read");
      }
    } catch (err) {
      console.error("Socket error on markAllAsRead", err);
    }

    res.status(200).json({ success: true, message: "Bütün bildirişlər oxundu kimi işarələndi" });
  } catch (err) {
    next(err);
  }
};
