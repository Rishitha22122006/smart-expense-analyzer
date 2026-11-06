const express = require('express');
const router = express.Router();
const {
  getExpenses,
  getExpenseById,
  addExpense,
  updateExpense,
  deleteExpense,
  getExpenseMetaOptions,
} = require('../controllers/expenseController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // All expense routes are protected

router.route('/')
  .get(getExpenses)
  .post(addExpense);

router.get('/meta/options', getExpenseMetaOptions);

router.route('/:id')
  .get(getExpenseById)
  .put(updateExpense)
  .delete(deleteExpense);

module.exports = router;
