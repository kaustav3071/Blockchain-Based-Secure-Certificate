const mongoose = require("mongoose");

const verificationSchema = new mongoose.Schema(
  {
    certId: {
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
    studentName: {
      type: String,
    },
    universityName: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Verification", verificationSchema);
