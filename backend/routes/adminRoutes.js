const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const authorize = require("../middleware/roleCheck");
const {
  getAllUsers,
  getPendingUniversities,
  updateUniversityStatus,
  deleteUser,
  getAdminStats,
} = require("../controllers/adminController");

// All admin routes require admin role
router.use(auth, authorize("admin"));

router.get("/users", getAllUsers);
router.get("/pending", getPendingUniversities);
router.get("/stats", getAdminStats);
router.put("/university/:id", updateUniversityStatus);
router.delete("/user/:id", deleteUser);

module.exports = router;
