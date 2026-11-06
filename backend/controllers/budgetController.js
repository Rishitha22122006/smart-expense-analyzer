const Budget = require('../models/Budget');
const Expense = require('../models/Expense');

// @desc    Get current or specific month budget status with expenses calculation
// @route   GET /api/budgets/status
// @access  Private
const getBudgetStatus = async (req, res, next) => {
  try {
    const now = new Date();
    const month = parseInt(req.query.month, 10) || now.getMonth() + 1; // 1-12
    const year = parseInt(req.query.year, 10) || now.getFullYear();

    // Find the budget document for this user, month, and year
    let budget = await Budget.findOne({
      user: req.user.id,
      month,
      year,
    });

    // Start & end date of the requested month
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    // Aggregate expenses for this month
    const expenseAggregation = await Expense.aggregate([
      {
        $match: {
          user: req.user._id,
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: '$category',
          totalSpent: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]);

    // Calculate total spent in the month
    const totalSpent = expenseAggregation.reduce((acc, curr) => acc + curr.totalSpent, 0);

    // Map category expenses
    const categorySpentMap = {};
    expenseAggregation.forEach((item) => {
      categorySpentMap[item._id] = item.totalSpent;
    });

    const totalBudget = budget ? budget.totalBudget : 0;
    const remainingBudget = totalBudget > 0 ? totalBudget - totalSpent : 0;
    const percentageUsed = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

    const isWarning80 = totalBudget > 0 && percentageUsed >= 80 && percentageUsed < 100;
    const isExceeded = totalBudget > 0 && percentageUsed >= 100;

    // Build category-wise analysis
    const categoryAnalysis = (budget && budget.categoryBudgets ? budget.categoryBudgets : []).map(
      (cb) => {
        const spent = categorySpentMap[cb.category] || 0;
        const remaining = cb.amount - spent;
        const catPercentage = cb.amount > 0 ? Math.round((spent / cb.amount) * 100) : 0;
        return {
          category: cb.category,
          budgetLimit: cb.amount,
          spent,
          remaining,
          percentageUsed: catPercentage,
          isWarning80: cb.amount > 0 && catPercentage >= 80 && catPercentage < 100,
          isExceeded: cb.amount > 0 && catPercentage >= 100,
        };
      }
    );

    // Also include any categories that had spending but no explicit category budget set
    expenseAggregation.forEach((item) => {
      const alreadyInBudget = categoryAnalysis.some((ca) => ca.category === item._id);
      if (!alreadyInBudget) {
        categoryAnalysis.push({
          category: item._id,
          budgetLimit: 0,
          spent: item.totalSpent,
          remaining: -item.totalSpent,
          percentageUsed: 100,
          isWarning80: false,
          isExceeded: true, // Spent without a budget
          unbudgeted: true,
        });
      }
    });

    res.json({
      success: true,
      month,
      year,
      budgetExists: !!budget,
      totalBudget,
      totalSpent,
      remainingBudget,
      percentageUsed,
      isWarning80,
      isExceeded,
      categoryAnalysis,
      budgetDetails: budget,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all budgets for user
// @route   GET /api/budgets
// @access  Private
const getBudgets = async (req, res, next) => {
  try {
    const budgets = await Budget.find({ user: req.user.id }).sort({
      year: -1,
      month: -1,
    });
    res.json({
      success: true,
      count: budgets.length,
      budgets,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create or update budget for a month
// @route   POST /api/budgets
// @access  Private
const setBudget = async (req, res, next) => {
  try {
    const { month, year, totalBudget, categoryBudgets } = req.body;

    if (!month || !year || totalBudget === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Month, year, and totalBudget are required',
      });
    }

    // Filter valid category budgets
    const sanitizedCategories = Array.isArray(categoryBudgets)
      ? categoryBudgets.filter((cb) => cb.category && cb.amount >= 0)
      : [];

    const budget = await Budget.findOneAndUpdate(
      {
        user: req.user.id,
        month: parseInt(month, 10),
        year: parseInt(year, 10),
      },
      {
        user: req.user.id,
        month: parseInt(month, 10),
        year: parseInt(year, 10),
        totalBudget: Number(totalBudget),
        categoryBudgets: sanitizedCategories,
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: 'Budget saved successfully',
      budget,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete budget
// @route   DELETE /api/budgets/:id
// @access  Private
const deleteBudget = async (req, res, next) => {
  try {
    const budget = await Budget.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: 'Budget record not found or unauthorized',
      });
    }

    res.json({
      success: true,
      message: 'Budget record deleted',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBudgetStatus,
  getBudgets,
  setBudget,
  deleteBudget,
};
