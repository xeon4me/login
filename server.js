// server.js
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname)); // serve index.html

// Store OTPs temporarily
const otpStore = new Map();

// --- ROUTES ---

// Send OTP route
app.post("/send-otp", (req, res) => {
  try {
    const { phone } = req.body || {};
    if (!phone) return res.status(400).json({ message: "Phone number required" });

    // Generate random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(phone, otp);

    console.log(`✅ OTP for ${phone}: ${otp}`);
    res.json({ otp, message: "OTP sent successfully" });
  } catch (err) {
    console.error("Send OTP Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Verify OTP route
app.post("/verify-otp", (req, res) => {
  const { phone, otp } = req.body || {};
  if (!phone || !otp) return res.status(400).json({ message: "Phone and OTP required" });

  const validOtp = otpStore.get(phone);
  if (validOtp !== otp) return res.status(401).json({ message: "Invalid OTP" });

  otpStore.delete(phone);
  res.json({ token: "demo-token-12345", message: "OTP verified successfully" });
});

// 404 for unknown routes
app.use((req, res) => res.status(404).json({ message: "Not found" }));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
