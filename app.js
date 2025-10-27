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

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || 'Server error');

    lastSentOtp = data.otp; // Demo only
    otpHint.textContent = 'Demo OTP: ' + lastSentOtp;
    verifySection.style.display = 'block';
    messageDiv.textContent = 'OTP sent successfully!';
  } catch (err) {
    messageDiv.textContent = 'Failed to send OTP: ' + err.message;
  } finally {
    sendOtpBtn.disabled = false;
  }
});

// ✅ Verify OTP
verifyBtn.addEventListener('click', async () => {
  const otp = otpInput.value.trim();
  if (!otp) {
    messageDiv.textContent = 'Enter the OTP first.';
    return;
  }

  verifyBtn.disabled = true;
  messageDiv.textContent = 'Verifying OTP...';

  try {
    const res = await fetch('/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: phoneInput.value, otp })
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || 'Verification failed.');

    messageDiv.textContent = '✅ Login successful! Token: ' + (data.token || '[demo]');
    otpHint.textContent = '';
  } catch (err) {
    messageDiv.textContent = '❌ Verification failed: ' + err.message;
  } finally {
    verifyBtn.disabled = false;
  }
});
