const express = require("express");
const router = express.Router();
const { register, login, getMe, verifyEmail, resendVerification, updateProfile, changePassword } = require("../controllers/authController");
const auth = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerification);
router.get("/me", auth, getMe);
router.put("/profile", auth, updateProfile);
router.put("/change-password", auth, changePassword);

module.exports = router;
