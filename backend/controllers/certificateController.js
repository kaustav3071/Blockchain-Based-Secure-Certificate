const { v4: uuidv4 } = require("uuid");
const Certificate = require("../models/Certificate");
const { generateHash, hashToBytes32 } = require("../utils/hashGenerator");
const { getContract } = require("../config/blockchain");
const cloudinary = require("../config/cloudinary");

// Issue a new certificate (University only)
const issueCertificate = async (req, res) => {
  try {
    const { studentName, course, year } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "Certificate file is required" });
    }

    if (!studentName || !course || !year) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Generate unique certificate ID
    const certId = "CERT-" + uuidv4().slice(0, 8).toUpperCase();

    // Generate SHA-256 hash from the ACTUAL file buffer
    const sha256Hash = generateHash(file.buffer);

    // Upload file to Cloudinary manually (after hashing)
    const cloudinaryResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "certifychain", resource_type: "auto" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(file.buffer);
    });

    // Store hash on blockchain
    const contract = getContract();
    if (!contract) {
      return res.status(500).json({ message: "Blockchain connection failed" });
    }

    const bytes32Hash = hashToBytes32(sha256Hash);
    const tx = await contract.issueCertificate(certId, bytes32Hash);
    const receipt = await tx.wait();

    // Save to MongoDB
    const certificate = await Certificate.create({
      certId,
      studentName,
      course,
      year,
      fileUrl: cloudinaryResult.secure_url,
      filePublicId: cloudinaryResult.public_id,
      sha256Hash,
      txHash: receipt.hash,
      blockNumber: receipt.blockNumber,
      issuedBy: req.user._id,
      universityName: req.user.organization || req.user.name,
    });

    res.status(201).json({
      message: "Certificate issued successfully",
      certificate: {
        certId: certificate.certId,
        studentName: certificate.studentName,
        course: certificate.course,
        year: certificate.year,
        txHash: certificate.txHash,
        fileUrl: certificate.fileUrl,
      },
    });
  } catch (error) {
    console.error("Issue certificate error:", error);
    if (error.message?.includes("Certificate already exists")) {
      return res.status(400).json({ message: "Certificate ID already exists on blockchain" });
    }
    res.status(500).json({ message: "Failed to issue certificate: " + error.message });
  }
};

// Get certificates (filtered by role)
const getCertificates = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === "university") {
      query = { issuedBy: req.user._id };
    } else if (req.user.role === "user") {
      return res.status(403).json({ message: "Access denied" });
    }
    // admin: no filter

    const certificates = await Certificate.find(query)
      .populate("issuedBy", "name email organization")
      .sort({ createdAt: -1 });

    res.json(certificates);
  } catch (error) {
    console.error("Get certificates error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get single certificate by certId
const getCertificateById = async (req, res) => {
  try {
    const certificate = await Certificate.findOne({ certId: req.params.certId })
      .populate("issuedBy", "name email organization");

    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    // University can only see their own
    if (req.user.role === "university" && certificate.issuedBy._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(certificate);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Revoke certificate
const revokeCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findOne({ certId: req.params.certId });

    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    // University can only revoke their own
    if (req.user.role === "university" && certificate.issuedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to revoke this certificate" });
    }

    // Revoke on blockchain
    const contract = getContract();
    if (contract) {
      try {
        const tx = await contract.revokeCertificate(req.params.certId);
        await tx.wait();
      } catch (blockchainError) {
        console.error("Blockchain revoke error:", blockchainError);
      }
    }

    certificate.revoked = true;
    await certificate.save();

    res.json({ message: "Certificate revoked successfully" });
  } catch (error) {
    console.error("Revoke error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get stats for dashboard
const getStats = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === "university") {
      query = { issuedBy: req.user._id };
    }

    const total = await Certificate.countDocuments(query);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayCount = await Certificate.countDocuments({
      ...query,
      createdAt: { $gte: today },
    });
    const revokedCount = await Certificate.countDocuments({ ...query, revoked: true });

    res.json({ total, today: todayCount, revoked: revokedCount });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  issueCertificate,
  getCertificates,
  getCertificateById,
  revokeCertificate,
  getStats,
};
