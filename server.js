import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ✅ Middlewares
app.use(cors());
app.use(bodyParser.json());

// ✅ Serve static frontend (index.html, app.js)
app.use(express.static(path.join(__dirname)));

// ✅ In-memory OTP store
const otpStore = new Map();

// ---------------- ROUTES ---------------- //

// 🔹 Send OTP
app.post("/send-otp", (req, res) => {
  try {
    const { phone } = req.body || {};
    if (!phone) {
      return res.status(400).json({ message: "Phone number required" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(phone, otp);

    console.log(`✅ Generated OTP for ${phone}: ${otp}`);
    return res.status(200).json({ otp, message: "OTP sent successfully" });
  } catch (error) {
    console.error("❌ Error in /send-otp:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

// 🔹 Verify OTP
app.post("/verify-otp", (req, res) => {
  try {
    const { phone, otp } = req.body || {};
    if (!phone || !otp) {
      return res.status(400).json({ message: "Phone and OTP required" });
    }

    const validOtp = otpStore.get(phone);
    if (!validOtp) return res.status(400).json({ message: "OTP expired or invalid" });
    if (validOtp !== otp) return res.status(401).json({ message: "Incorrect OTP" });

    otpStore.delete(phone);
    return res.json({ token: "demo-token-12345", message: "OTP verified successfully" });
  } catch (error) {
    console.error("❌ Error in /verify-otp:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ---------------- DEFAULT ---------------- //
app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

// ✅ Render Port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
