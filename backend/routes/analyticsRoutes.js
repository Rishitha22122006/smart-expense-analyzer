const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getSmartAnalysis,
} = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/dashboard', getDashboardStats);
router.get('/smart-analysis', getSmartAnalysis);

module.exports = router;
