const crypto = require("crypto");
const Certificate = require("../models/Certificate");
const Verification = require("../models/Verification");
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
        // Hash NOT found on blockchain — certificate was never issued
        verificationResult = "not_found";
        details.message = "This certificate was NOT found on the blockchain. It was never issued or is a forgery.";
      } else if (revoked) {
        // Hash found but certificate was revoked
        verificationResult = "revoked";
        details.message = "This certificate has been REVOKED by the issuing authority.";
        details.certId = certId;
        details.issuerAddress = issuer;
        details.blockchainTimestamp = new Date(timestamp * 1000);
      } else {
        // Hash found and certificate is valid — AUTHENTIC
        verificationResult = "authentic";
        details.message = "Certificate is AUTHENTIC. Verified on blockchain.";
        details.certId = certId;
        details.issuerAddress = issuer;
        details.blockchainTimestamp = new Date(timestamp * 1000);
      }

      // Step 3: If found on blockchain, fetch display metadata from MongoDB (supplementary only)
      if (exists && certId) {
        const dbCert = await Certificate.findOne({ certId }).populate("issuedBy", "name organization");
        if (dbCert) {
          details.studentName = dbCert.studentName;
          details.course = dbCert.course;
          details.year = dbCert.year;
          details.universityName = dbCert.universityName;
          details.issuedAt = dbCert.createdAt;
          details.fileUrl = dbCert.fileUrl;
        }
      }
    } catch (err) {
      console.error("Blockchain verification error:", err);
      return res.status(500).json({ message: "Blockchain query failed: " + err.message });
    }

    // Step 4: Log verification attempt
    await Verification.create({
      certId: details.certId || "UNKNOWN",
      verifiedBy: req.user._id,
      result: verificationResult,
      studentName: details.studentName || "",
      universityName: details.universityName || "",
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

module.exports = { verifyCertificate, getVerificationHistory };
