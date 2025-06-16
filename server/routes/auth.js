const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { mysqlPool } = require('../config/db');
const { generateOTP, sendOTP, otpStore } = require('../utils/otp');
const passport = require('../passport');
const router = express.Router();

// Request OTP for signup
router.post('/signup/request-otp', async (req, res) => {
  const { email } = req.body;
  try {
    const [rows] = await mysqlPool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length > 0) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const otp = generateOTP();
    otpStore[email] = { otp, expires: Date.now() + 5 * 60 * 1000 };
    await sendOTP(email, otp);
    res.json({ message: 'OTP sent to your email', email });
  } catch (err) {
    console.error('Signup OTP error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Verify OTP
router.post('/signup/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  try {
    const storedOtp = otpStore[email];
    if (!storedOtp || storedOtp.otp !== otp || Date.now() > storedOtp.expires) {
      return res.status(401).json({ message: 'Invalid or expired OTP' });
    }
    res.json({ message: 'OTP verified' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Complete signup
router.post('/signup/complete', async (req, res) => {
  const { name, email, password, phone, gender, age, address, state, pincode, panCard, annualSalary } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await mysqlPool.query(
      'INSERT INTO users (name, email, password, phone, gender, age, address, state, pincode, pan_card, annual_salary) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, email, hashedPassword, phone, gender, age, address, state, pincode, panCard, annualSalary]
    );
 
    const token = jwt.sign({ userId: result.insertId, role: 'user' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    delete otpStore[email];
    res.status(201).json({
      message: 'User created',
      token,
      user: { name, email, phone, gender, age, address, state, pincode, panCard, annualSalary }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await mysqlPool.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = rows[0];
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user.user_id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({
      token,
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        age: user.age,
        address: user.address,
        state: user.state,
        pincode: user.pincode,
        panCard: user.pan_card,
        annualSalary: user.annual_salary
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Forgot Password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const [rows] = await mysqlPool.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = rows[0];
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const resetToken = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;
    await sendOTP(email, `Click this link to reset your password: ${resetLink}`, 'Password Reset Request');
    res.json({ message: 'Password reset link sent to your email' });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Reset Password
router.post('/reset-password', async (req, res) => {
  const { token, password } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const [rows] = await mysqlPool.query('SELECT * FROM users WHERE user_id = ?', [userId]);
    const user = rows[0];
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await mysqlPool.query('UPDATE users SET password = ? WHERE user_id = ?', [hashedPassword, userId]);
    res.json({ message: 'Password reset successfully' });
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Reset link has expired' });
    }
    res.status(500).json({ error: err.message });
  }
});

// Get Profile
router.get('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const [rows] = await mysqlPool.query('SELECT * FROM users WHERE user_id = ?', [decoded.userId]);
    const user = rows[0];
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({
      name: user.name,
      email: user.email,
      phone: user.phone,
      gender: user.gender,
      age: user.age,
      address: user.address,
      state: user.state,
      pincode: user.pincode,
      panCard: user.pan_card,
      annualSalary: user.annual_salary
    });
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Update Profile
router.put('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { name, phone, gender, age, address, state, pincode, panCard, annualSalary } = req.body;

    await mysqlPool.query(
      'UPDATE users SET name = ?, phone = ?, gender = ?, age = ?, address = ?, state = ?, pincode = ?, pan_card = ?, annual_salary = ? WHERE user_id = ?',
      [name, phone, gender, age, address, state, pincode, panCard, annualSalary, decoded.userId]
    );

    const [rows] = await mysqlPool.query('SELECT * FROM users WHERE user_id = ?', [decoded.userId]);
    const user = rows[0];
    res.json({
      name: user.name,
      email: user.email,
      phone: user.phone,
      gender: user.gender,
      age: user.age,
      address: user.address,
      state: user.state,
      pincode: user.pincode,
      panCard: user.pan_card,
      annualSalary: user.annual_salary
    });
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Google OAuth routes
// router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// router.get(
//   '/google/callback',
//   passport.authenticate('google', { session: false }),
//   (req, res) => {
//     const { token, user } = req.user;
//     res.redirect(`http://localhost:3000/auth/google/callback?token=${token}&name=${encodeURIComponent(user.name)}`);
//   }
// );

module.exports = router;