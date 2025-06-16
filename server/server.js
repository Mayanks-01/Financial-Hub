const express = require('express');
const cors = require('cors');
const { connectMongo } = require('./config/db');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:3000' })); // Allow React frontend
app.use(express.json());
app.use('/api/users', require('./routes/users'));
app.use('/api/applications', require('./routes/applications'));

// Connect to MongoDB
connectMongo();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));