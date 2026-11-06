const express = require('express');
const router = express.Router();
const {
  getIncomes,
  getIncomeById,
  addIncome,
  updateIncome,
  deleteIncome,
  getIncomeMetaOptions,
} = require('../controllers/incomeController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // All income routes are protected

router.route('/')
  .get(getIncomes)
  .post(addIncome);

router.get('/meta/options', getIncomeMetaOptions);

router.route('/:id')
  .get(getIncomeById)
  .put(updateIncome)
  .delete(deleteIncome);

module.exports = router;
