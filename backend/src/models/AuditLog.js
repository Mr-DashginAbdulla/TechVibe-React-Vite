const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    adminEmail: { type: String, required: true },
    action: {
      type: String,
      enum: ["CREATE", "UPDATE", "DELETE"],
      required: true,
    },
    resource: {
      type: String,
      enum: [
        "product",
        "order",
        "user",
        "category",
        "brand",
        "promoCode",
        "review",
      ],
      required: true,
    },
    resourceId: { type: String, default: "" },
    details: { type: mongoose.Schema.Types.Mixed, default: {} },
    ipAddress: { type: String, default: "" },
    userAgent: { type: String, default: "" },
  },
  { timestamps: true }
);

// Index for efficient querying
auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ adminId: 1, createdAt: -1 });
auditLogSchema.index({ resource: 1, action: 1 });

auditLogSchema.methods.toJSON = function () {
  const obj = this.toObject();
  obj.id = obj._id;
  return obj;
};

module.exports = mongoose.model("AuditLog", auditLogSchema);
