const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.Mixed, // Can be "admin" or ObjectId for user
      required: true,
    },
    type: {
      type: String, // 'NEW_ORDER', 'ORDER_STATUS_UPDATE', etc.
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    relatedId: {
      type: mongoose.Schema.Types.ObjectId, // Connect to Order, etc.
      required: false,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
