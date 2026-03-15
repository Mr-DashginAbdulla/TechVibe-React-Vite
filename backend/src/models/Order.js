const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    orderNumber: { type: String, required: true, unique: true },
    items: [
      {
        productId: { type: String },
        name: { type: String },
        price: { type: Number },
        quantity: { type: Number, default: 1 },
        image: { type: String },
        selectedColor: { type: String },
        selectedMemory: { type: String },
      },
    ],
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    timeline: [
      {
        status: { type: String },
        date: { type: String },
        description: { type: String },
      },
    ],
    shippingAddress: { type: mongoose.Schema.Types.Mixed },
    paymentMethod: { type: String, default: "card" },
    subtotal: { type: Number, default: 0 },
    shippingCost: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    promoCode: { type: String, default: "" },
    total: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

orderSchema.methods.toJSON = function () {
  const obj = this.toObject();
  obj.id = obj._id;
  obj.createdAt = obj.createdAt || this.createdAt;
  return obj;
};

module.exports = mongoose.model("Order", orderSchema);
