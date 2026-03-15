const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    productId: { type: String, required: true },
    name: { type: String, default: "" },
    price: { type: Number, default: 0 },
    image: { type: String, default: "" },
    addedAt: { type: String, default: () => new Date().toISOString() },
  },
  { timestamps: true }
);

wishlistSchema.methods.toJSON = function () {
  const obj = this.toObject();
  obj.id = obj._id;
  return obj;
};

module.exports = mongoose.model("Wishlist", wishlistSchema);
