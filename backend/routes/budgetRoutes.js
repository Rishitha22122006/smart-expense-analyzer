const express = require('express');
const router = express.Router();
const {
  getBudgetStatus,
  getBudgets,
  setBudget,
  deleteBudget,
} = require('../controllers/budgetController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // All budget routes are protected

router.get('/status', getBudgetStatus);
router.route('/')
  .get(getBudgets)
  .post(setBudget);

router.delete('/:id', deleteBudget);

module.exports = router;
