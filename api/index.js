const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('../config/db');
dotenv.config();
let isConnected = false;
async function ensureDB() {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
}
const authRoutes = require('../routes/authRoutes');
const courseRoutes = require('../routes/courseRoutes');
const progressRoutes = require('../routes/progressRoutes');
const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
});
app.use(limiter);
app.use(async (req, res, next) => {
  await ensureDB();
  next();
});
app.get('/', (req, res) => res.json({ status: "OK" }));
app.use('/api', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/progress', progressRoutes);
app.get('/', (req, res) => res.json({message: "LMS backend running!"}));
app.use((err, req, res, next) => {
  res.status(500).json({success: false, message: err.message || 'Server error'});
});
module.exports = app;
