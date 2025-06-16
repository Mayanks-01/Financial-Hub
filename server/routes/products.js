const express = require('express');
const jwt = require('jsonwebtoken');
const { mysqlPool } = require('../config/db');
const { sendOTP } = require('../utils/otp');
const router = express.Router();

// Sample product data (replace with database in production)
const products = {
  'credit-card': [
    { id: 1, name: 'SBI Credit Card', features: '5% cashback, 0% forex', eligibility: 'Income > 5LPA', email: 'sharmamayank966@gmail.com' },
    { id: 2, name: 'HDFC Credit Card', features: '10x rewards, low interest', eligibility: 'Income > 6LPA', email: 'sharmamayank966@gmail.com' },
  ],
  'personal-loan': [
    { id: 3, name: 'ICICI Personal Loan', features: 'Low interest, fast approval', eligibility: 'Income > 3LPA', email: 'sharmamayank966@gmail.com' },
  ],
  'business-loan': [
    { id: 4, name: 'Axis Business Loan', features: 'High limit, flexible tenure', eligibility: 'Business turnover > 50L', email: 'sharmamayank966@gmail.com' },
  ],
  'savings-account': [
    { id: 5, name: 'Kotak Savings', features: 'High interest, zero balance', eligibility: 'Resident Indian', email:'sharmamayank966@gmail.com' },
  ],
  'demat-account': [
    { id: 6, name: 'Zerodha Demat', features: 'Low charges, easy trading', eligibility: 'PAN card', email: 'sharmamayank966@gmail.com'},
  ],
  'investment-funds': [
    { id: 7, name: 'SBI Mutual Fund', features: 'Diversified, high returns', eligibility: 'Min 5000 INR', email: 'sharmamayank966@gmail.com' },
  ],
};

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};


// Get user applications
router.get('/applications', verifyToken, async (req, res) => {
  try {
    console.log('User ID from token:', req.userId); // Log the user ID from token

    const [rows] = await mysqlPool.query(
      `SELECT a.id, a.category, a.provider_id, a.applied_at, a.status, p.name AS provider_name
       FROM applications a
       LEFT JOIN (SELECT 1 as id, 'SBI Credit Card' as name
                  UNION SELECT 2, 'HDFC Credit Card'
                  UNION SELECT 3, 'ICICI Personal Loan'
                  UNION SELECT 4, 'Axis Business Loan'
                  UNION SELECT 5, 'Kotak Savings'
                  UNION SELECT 6, 'Zerodha Demat'
                  UNION SELECT 7, 'SBI Mutual Fund') p
       ON a.provider_id = p.id
       WHERE a.user_id = ?`,
      [req.userId]
    );

    console.log('Applications fetched for user', req.userId, ':', rows); // Log the result
    res.json(rows);
  } catch (err) {
    console.error('Fetch applications error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get providers for a category
router.get('/:category', (req, res) => {
  const { category } = req.params;
  const providers = products[category] || [];
  res.json(providers);
});

// Get specific provider details
router.get('/:category/:providerId', (req, res) => {
  const { category, providerId } = req.params;
  const provider = (products[category] || []).find(p => p.id === parseInt(providerId));
  if (!provider) return res.status(404).json({ message: 'Provider not found' });
  res.json(provider);
});

// Handle application submission
router.post('/:category/apply', verifyToken, async (req, res) => {
  const { category } = req.params;
  const { name, email, phone, income, providerId } = req.body;

  try {
    const provider = (products[category] || []).find(p => p.id === parseInt(providerId));
    if (!provider) return res.status(404).json({ message: 'Provider not found' });

    await mysqlPool.query(
      'INSERT INTO applications (user_id, category, provider_id, name, email, phone, income, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [req.userId, category, providerId, name, email, phone, income, 'Pending']
    );

    const emailBody = `
      New Application for ${provider.name} (${category.replace(/-/g, ' ')}):
      Name: ${name}
      Email: ${email}
      Phone: ${phone}
      Income: ${income}
    `;
    await sendOTP(provider.email, emailBody, 'New Application Received');

    res.json({ message: 'Application submitted successfully' });
  } catch (err) {
    console.error('Application error:', err);
    res.status(500).json({ error: err.message });
  }
});




module.exports = router;