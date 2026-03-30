const mongoose = require("mongoose");

const stockAlertSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    notified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent multiple active alerts for the same product by the same user
stockAlertSchema.index({ userId: 1, productId: 1, notified: 1 });

const StockAlert = mongoose.model("StockAlert", stockAlertSchema);

module.exports = StockAlert;
