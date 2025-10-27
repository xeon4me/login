/*
Minimal Node/Express server (demo only).
Features:
- /send-otp : accepts { phone, fp_hash }
- /verify-otp: accepts { phone, otp, fp_hash }
- simple in-memory stores for OTPs and rate-limiting


Important: This is a demo. Do NOT use in production. Use HTTPS, persistent DB, SMS gateway, stronger rate-limiting and logging.
*/


const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');


const app = express();
app.use(bodyParser.json());


const PORT = process.env.PORT || 3000;


// In-memory stores (demo)
const otpStore = new Map(); // phone -> { otp, expiresAt, fp_hash }
const ratePhone = new Map(); // phone -> { count, firstTs }
const rateFp = new Map(); // fp_hash -> { count, firstTs }


function generateOtp() { return Math.floor(100000 + Math.random()*900000).toString(); }
function now() { return Date.now(); }


// simple rate check
function incrRate(map, key, windowMs, max) {
const rec = map.get(key) || { count:0, firstTs: now() };
if (now() - rec.firstTs > windowMs) { rec.count = 0; rec.firstTs = now(); }
rec.count += 1; map.set(key, rec);
return rec.count <= max;
}


app.post('/send-otp', (req, res) => {
const { phone, fp_hash } = req.body || {};
if (!phone) return res.status(400).json({ message: 'phone required' });


// rate limits: 5 per phone per hour, 10 per fingerprint per hour
if (!incrRate(ratePhone, phone, 60*60*1000, 5)) return res.status(429).json({ message: 'Too many OTP requests for this phone' });
if (!incrRate(rateFp, fp_hash || 'nofp', 60*60*1000, 10)) return res.status(429).json({ message: 'Too many OTP requests from this device' });


const otp = generateOtp();
const expiresAt = now() + (5*60*1000); // 5 minutes
otpStore.set(phone, { otp, expiresAt, fp_hash });


// Very small risk scoring: if no fingerprint provided -> higher risk
const risk = fp_hash ? 10 : 70;


// In production: call SMS gateway here and do not return OTP in response
return res.json({ ok: true, otp, risk, message: 'OTP (demo) generated' });
});


app.post('/verify-otp', (req, res) => {
const { phone, otp, fp_hash } = req.body || {};
if (!phone || !otp) return res.status(400).json({ message: 'phone and otp required' });
app.listen(PORT, () => console.log('Server listening on port', PORT));
