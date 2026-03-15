const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true },
    brand: { type: String, required: true },
    stock: { type: Number, default: 0, min: 0 },
    isFeatured: { type: Boolean, default: false },
    isNewProduct: { type: Boolean, default: false },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    images: [{ type: String }],
    specs: { type: mongoose.Schema.Types.Mixed, default: {} },
    colorOptions: [
      {
        name: { type: String },
        hex: { type: String },
      },
    ],
    memoryOptions: [
      {
        size: { type: String },
        adj: { type: Number, default: 0 },
      },
    ],
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewsCount: { type: Number, default: 0 },
    discount: { type: Number, default: 0, min: 0 },
    categoryId: { type: String, default: "" },
  },
  { timestamps: true, _id: false }
);

productSchema.methods.toJSON = function () {
  const obj = this.toObject();
  obj.id = obj._id;
  // Map isNewProduct back to isNew for frontend compatibility
  obj.isNew = obj.isNewProduct;
  delete obj.isNewProduct;
  return obj;
};

module.exports = mongoose.model("Product", productSchema);
