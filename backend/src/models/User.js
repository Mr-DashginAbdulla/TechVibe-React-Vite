const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firebaseUid: { type: String, required: true, unique: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    role: { type: String, enum: ["user", "admin", "super-admin"], default: "user" },
    phone: { type: String, default: "" },
    isVerified: { type: Boolean, default: false },
    avatar: { type: String, default: "" },
    memberSince: { type: String, default: "" },
  },
  { timestamps: true }
);

// Remove Mongoose properties from JSON output
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  obj.id = obj._id;
  return obj;
};

module.exports = mongoose.model("User", userSchema);
