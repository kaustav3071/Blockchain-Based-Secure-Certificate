const express = require("express");
const router = express.Router();
const multer = require("multer");
const auth = require("../middleware/auth");
const authorize = require("../middleware/roleCheck");
const {
  issueCertificate,
  getCertificates,
  getCertificateById,
  revokeCertificate,
  getStats,
} = require("../controllers/certificateController");

// Use memory storage to hash the file buffer (no cloud storage — fully decentralized)
const memoryUpload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

// Issue certificate - university only
router.post("/issue", auth, authorize("university"), memoryUpload.single("certificate"), issueCertificate);

// Get all certificates (filtered by role)
router.get("/", auth, authorize("university", "admin"), getCertificates);

// Get stats
router.get("/stats", auth, authorize("university", "admin"), getStats);

// Get single certificate
router.get("/:certId", auth, authorize("university", "admin"), getCertificateById);

// Revoke certificate
router.put("/revoke/:certId", auth, authorize("university", "admin"), revokeCertificate);

module.exports = router;
