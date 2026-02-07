const mongoose = require("mongoose");

const verificationSchema = new mongoose.Schema(
  {
    fileHash: {
      type: String,
      required: true,
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    result: {
      type: String,
      enum: ["authentic", "tampered", "not_found", "revoked"],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Verification", verificationSchema);
