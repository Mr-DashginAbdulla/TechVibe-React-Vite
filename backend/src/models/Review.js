const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true },
    userId: { type: String, default: "" },
    userName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: "" },
    date: { type: String, default: () => new Date().toISOString().split("T")[0] },
    helpful: { type: Number, default: 0 },
  },
  { timestamps: true }
);

reviewSchema.methods.toJSON = function () {
  const obj = this.toObject();
  obj.id = obj._id;
  return obj;
};

module.exports = mongoose.model("Review", reviewSchema);
