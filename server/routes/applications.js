const express = require('express');
const router = express.Router();
const { mysqlPool } = require('../config/db');
const jwt = require('jsonwebtoken');

// Middleware to verify employee or admin
const verifyEmployeeOrAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!['employee', 'admin'].includes(decoded.role)) {
      return res.status(403).json({ message: 'Employee or admin access required' });
    }
    req.userId = decoded.userId;
    req.role = decoded.role;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Get all applications (employee or admin)
router.get('/', verifyEmployeeOrAdmin, async (req, res) => {
  try {
    const [rows] = await mysqlPool.query(`
      SELECT a.id, a.user_id, a.category, a.product_id, a.name, a.email, a.phone, a.income, a.status, a.applied_at, p.name AS provider_name
      FROM applications a
      LEFT JOIN products p ON a.product_id = p.id
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update application status (employee or admin)
router.put('/:id', verifyEmployeeOrAdmin, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    await mysqlPool.query('UPDATE applications SET status = ? WHERE id = ?', [status, id]);
    res.json({ message: 'Status updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;