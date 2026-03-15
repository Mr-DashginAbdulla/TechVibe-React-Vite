const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    logo: {
      light: { type: String, default: "" },
      dark: { type: String, default: "" },
    },
    website: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, _id: false }
);

brandSchema.methods.toJSON = function () {
  const obj = this.toObject();
  obj.id = obj._id;
  return obj;
};

module.exports = mongoose.model("Brand", brandSchema);
