const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    productId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, default: "" },
    quantity: { type: Number, default: 1, min: 1 },
    selectedColor: { type: String, default: "" },
    selectedMemory: { type: String, default: "" },
    stock: { type: Number, default: 0 },
  },
  { timestamps: true }
);

cartSchema.methods.toJSON = function () {
  const obj = this.toObject();
  obj.id = obj._id;
  return obj;
};

module.exports = mongoose.model("Cart", cartSchema);
