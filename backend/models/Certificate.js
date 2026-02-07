const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema(
  {
    certId: {
      type: String,
      required: true,
      unique: true,
    },
    sha256Hash: {
      type: String,
      required: true,
    },
    txHash: {
      type: String,
      required: true,
    },
    blockNumber: {
      type: Number,
    },
    issuedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    revoked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Certificate", certificateSchema);
