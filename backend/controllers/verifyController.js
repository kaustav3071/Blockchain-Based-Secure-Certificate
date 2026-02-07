const crypto = require("crypto");
const Verification = require("../models/Verification");
const User = require("../models/User");
const { getContract } = require("../config/blockchain");

// Verify a certificate — BLOCKCHAIN IS THE SOURCE OF TRUTH
const verifyCertificate = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "Certificate file is required" });
    }

    // Step 1: Hash the uploaded file
    const uploadedHash = crypto.createHash("sha256").update(file.buffer).digest("hex");
    const bytes32Hash = "0x" + uploadedHash;

    let verificationResult;
    let details = {};

    // Step 2: Query blockchain DIRECTLY by hash — this is the decentralized verification
    const contract = getContract();
    if (!contract) {
      return res.status(500).json({ message: "Blockchain connection unavailable. Please try again later." });
    }

    try {
      const result = await contract.verifyCertificateByHash(bytes32Hash);
      const certId = result[0];
      const issuer = result[1];
      const timestamp = Number(result[2]);
      const exists = result[3];
      const revoked = result[4];

      if (!exists) {
        verificationResult = "not_found";
        details.message = "This certificate was NOT found on the blockchain. It was never issued or is a forgery.";
      } else if (revoked) {
        verificationResult = "revoked";
        details.message = "This certificate has been REVOKED by the issuing authority.";
        details.certId = certId;
        details.issuerAddress = issuer;
        details.blockchainTimestamp = new Date(timestamp * 1000);
      } else {
        verificationResult = "authentic";
        details.message = "Certificate is AUTHENTIC. Verified on blockchain.";
        details.certId = certId;
        details.issuerAddress = issuer;
        details.blockchainTimestamp = new Date(timestamp * 1000);
      }
    } catch (err) {
      console.error("Blockchain verification error:", err);
      return res.status(500).json({ message: "Blockchain query failed: " + err.message });
    }

    // Step 3: Log verification attempt (minimal — just hash + result)
    await Verification.create({
      fileHash: uploadedHash,
      verifiedBy: req.user._id,
      result: verificationResult,
    });

    res.json({
      result: verificationResult,
      details,
    });
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({ message: "Verification failed: " + error.message });
  }
};

// Get verification history (filtered by role)
const getVerificationHistory = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === "user") {
      query = { verifiedBy: req.user._id };
    }
    // admin sees all

    const verifications = await Verification.find(query)
      .populate("verifiedBy", "name email")
      .sort({ createdAt: -1 });

    res.json(verifications);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get list of approved universities for verification dropdown
const getUniversities = async (req, res) => {
  try {
    const universities = await User.find(
      { role: "university", status: "approved" },
      { name: 1, organization: 1, _id: 1 }
    ).sort({ organization: 1 });

    res.json(universities);
  } catch (error) {
    console.error("Error fetching universities:", error);
    res.status(500).json({ message: "Failed to fetch universities" });
  }
};

module.exports = { verifyCertificate, getVerificationHistory, getUniversities };
