import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

const otpStore = new Map();

// ✅ Route: Send OTP
app.post("/send-otp", (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ message: "Phone number required" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(phone, otp);
    console.log(`OTP for ${phone}: ${otp}`);

    // Always return JSON
    return res.json({ otp, message: "OTP sent successfully" });
  } catch (err) {
    console.error("Error in /send-otp:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ✅ Route: Verify OTP
app.post("/verify-otp", (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp)
      return res.status(400).json({ message: "Phone and OTP required" });

    const validOtp = otpStore.get(phone);
    if (!validOtp)
      return res.status(400).json({ message: "OTP expired or invalid" });
    if (validOtp !== otp)
      return res.status(401).json({ message: "Incorrect OTP" });

    otpStore.delete(phone);
    return res.json({ token: "demo-token-12345", message: "OTP verified successfully" });
  } catch (err) {
    console.error("Error in /verify-otp:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ✅ Fallback route for 404
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ✅ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
