const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

const app = express();

// Middleware
const allowedOrigins = [process.env.CLIENT_URL, "http://localhost:5173"].filter(Boolean);
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) callback(null, true);
    else callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure DB is connected before handling any request (critical for Vercel serverless)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ message: "Database connection failed" });
  }
});

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/certificates", require("./routes/certificateRoutes"));
app.use("/api/verify", require("./routes/verifyRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Seed admin (one-time use after deployment)
app.get("/api/seed-admin", async (req, res) => {
  try {
    const User = require("./models/User");
    const bcrypt = require("bcryptjs");
    const existing = await User.findOne({ role: "admin" });
    if (existing) return res.json({ message: "Admin already exists", email: existing.email });
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash("admin123", salt);
    await User.create({ name: "Admin", email: "admin@certifychain.com", password: hashed, role: "admin", status: "approved" });
    res.json({ message: "Admin seeded", email: "admin@certifychain.com" });
  } catch (err) {
    res.status(500).json({ message: "Seed failed: " + err.message });
  }
});

// Start server only when running locally (Vercel manages the server in production)
if (process.env.VERCEL !== "1") {
  const PORT = process.env.PORT || 5000;
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  });
}

// Export for Vercel serverless
module.exports = app;
