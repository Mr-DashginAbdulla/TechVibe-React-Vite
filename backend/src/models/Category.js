const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    image: { type: String, default: "" },
    parentId: { type: String, default: null },
  },
  { timestamps: true, _id: false }
);

categorySchema.methods.toJSON = function () {
  const obj = this.toObject();
  obj.id = obj._id;
  return obj;
};

module.exports = mongoose.model("Category", categorySchema);
