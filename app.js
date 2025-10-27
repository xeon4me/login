const phoneInput = document.getElementById('phone');
const sendOtpBtn = document.getElementById('send-otp');
const verifySection = document.getElementById('otp-section');
const otpInput = document.getElementById('otp');
const verifyBtn = document.getElementById('verify-otp');
const messageDiv = document.getElementById('message');
const otpHint = document.getElementById('otp-hint');

let lastSentOtp = null; // For demo only

// ✅ Send OTP
sendOtpBtn.addEventListener('click', async () => {
  const phone = phoneInput.value.trim();
  if (!phone) {
    messageDiv.textContent = 'Please enter your phone number.';
    return;
  }

  sendOtpBtn.disabled = true;
  messageDiv.textContent = 'Sending OTP...';

  try {
    const res = await fetch('/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone })
    });

    let data = {};
    try {
      data = await res.json();
    } catch {
      throw new Error('Invalid JSON response from server');
    }

    if (!res.ok) throw new Error(data.message || 'Server error');

    lastSentOtp = data.otp; // Demo only
    otpHint.textContent = 'Demo OTP: ' + lastSentOtp;
    verifySection.style.display = 'block';
    messageDiv.textContent = 'OTP sent successfully!';
  } catch (err) {
    messageDiv.textContent = 'Failed to send OTP: ' + err.message;
    console.error(err);
  } finally {
    sendOtpBtn.disabled = false;
  }
});
