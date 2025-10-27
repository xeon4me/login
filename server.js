import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(".")); // Serve index.html & app.js

// Simple in-memory OTP store (for demo)
const otpStore = new Map();

// 🔹 Route: Send OTP
app.post("/send-otp", (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ message: "Phone number required" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore.set(phone, otp);

  console.log(`OTP for ${phone}: ${otp}`); // In production, send via SMS API

  res.json({ otp, message: "OTP sent successfully" });
});

// 🔹 Route: Verify OTP
app.post("/verify-otp", (req, res) => {
  const { phone, otp } = req.body;

  if (!phone || !otp)
    return res.status(400).json({ message: "Phone and OTP required" });

  const validOtp = otpStore.get(phone);
  if (!validOtp) return res.status(400).json({ message: "OTP expired or invalid" });

  if (validOtp !== otp) return res.status(401).json({ message: "Incorrect OTP" });

  otpStore.delete(phone); // Clear OTP after success

  res.json({ token: "demo-token-12345", message: "OTP verified successfully" });
});

// Start server
app.listen(3000, () => console.log("Server running at http://localhost:3000"));
