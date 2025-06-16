const express = require('express');
const router = express.Router();
const { mysqlPool } = require('../config/db');
const jwt = require('jsonwebtoken');

// Middleware to verify admin role
const verifyAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') return res.status(403).json({ message: 'Admin access required' });
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

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

// Get all users (admin-only)
router.get('/', verifyAdmin, async (req, res) => {
  try {
    const [rows] = await mysqlPool.query('SELECT id, name, email, phone, role FROM users');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create user (admin-only)
router.post('/', verifyAdmin, async (req, res) => {
  const { name, email, phone, role } = req.body;
  try {
    await mysqlPool.query(
      'INSERT INTO users (name, email, phone, role) VALUES (?, ?, ?, ?)',
      [name, email, phone, role]
    );
    res.json({ message: 'User created' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update user (admin or employee)
router.put('/:id', verifyEmployeeOrAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, role } = req.body;
  try {
    if (req.role === 'employee' && role) {
      return res.status(403).json({ message: 'Employees cannot update roles' });
    }
    await mysqlPool.query(
      'UPDATE users SET name = ?, email = ?, phone = ?' + (req.role === 'admin' ? ', role = ?' : '') + ' WHERE id = ?',
      req.role === 'admin' ? [name, email, phone, role, id] : [name, email, phone, id]
    );
    res.json({ message: 'User updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete user (admin-only)
router.delete('/:id', verifyAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await mysqlPool.query('DELETE FROM users WHERE id = ?', [id]);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;