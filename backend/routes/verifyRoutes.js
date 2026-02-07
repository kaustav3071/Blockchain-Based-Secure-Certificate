const express = require("express");
const router = express.Router();
const multer = require("multer");
const auth = require("../middleware/auth");
const authorize = require("../middleware/roleCheck");
const { verifyCertificate, getVerificationHistory, getUniversities } = require("../controllers/verifyController");

// Use memory storage for verification (we just need the buffer to hash)
const memoryUpload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

// Get list of approved universities for dropdown
router.get("/universities", auth, authorize("user", "admin"), getUniversities);

// Verify certificate - user and admin
router.post("/", auth, authorize("user", "admin"), memoryUpload.single("certificate"), verifyCertificate);

// Get verification history
router.get("/history", auth, authorize("user", "admin"), getVerificationHistory);

module.exports = router;
