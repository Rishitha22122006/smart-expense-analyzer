const Expense = require('../models/Expense');
const Income = require('../models/Income');
const Budget = require('../models/Budget');

// @desc    Get dashboard summary statistics and charts
// @route   GET /api/analytics/dashboard
// @access  Private
const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-indexed

    // Current month start & end
    const startOfCurrentMonth = new Date(currentYear, currentMonth, 1);
    const endOfCurrentMonth = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59, 999);

    // 1. Current Month Expenses
    const currentMonthExpenseResult = await Expense.aggregate([
      {
        $match: {
          user: userId,
          date: { $gte: startOfCurrentMonth, $lte: endOfCurrentMonth },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]);
    const currentMonthExpenses =
      currentMonthExpenseResult.length > 0 ? currentMonthExpenseResult[0].total : 0;

    // 2. Current Month Income
    const currentMonthIncomeResult = await Income.aggregate([
      {
        $match: {
          user: userId,
          date: { $gte: startOfCurrentMonth, $lte: endOfCurrentMonth },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]);
    const currentMonthIncome =
      currentMonthIncomeResult.length > 0 ? currentMonthIncomeResult[0].total : 0;

    // 3. All-time Totals (for Available Balance)
    const allExpensesResult = await Expense.aggregate([
      { $match: { user: userId } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const totalAllExpenses = allExpensesResult.length > 0 ? allExpensesResult[0].total : 0;

    const allIncomeResult = await Income.aggregate([
      { $match: { user: userId } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const totalAllIncome = allIncomeResult.length > 0 ? allIncomeResult[0].total : 0;

    const availableBalance = totalAllIncome - totalAllExpenses;
    const monthlySavings = currentMonthIncome - currentMonthExpenses;

    // 4. Category-wise pie chart data for current month
    const categoryExpenses = await Expense.aggregate([
      {
        $match: {
          user: userId,
          date: { $gte: startOfCurrentMonth, $lte: endOfCurrentMonth },
        },
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
    ]);

    const categoryChartData = categoryExpenses.map((item) => ({
      name: item._id,
      value: item.total,
      count: item.count,
    }));

    // 5. Monthly expense & income chart for last 6 months
    const sixMonthsAgo = new Date(currentYear, currentMonth - 5, 1);
    const monthlyExpensesAgg = await Expense.aggregate([
      {
        $match: {
          user: userId,
          date: { $gte: sixMonthsAgo, $lte: endOfCurrentMonth },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
          },
          total: { $sum: '$amount' },
        },
      },
    ]);

    const monthlyIncomeAgg = await Income.aggregate([
      {
        $match: {
          user: userId,
          date: { $gte: sixMonthsAgo, $lte: endOfCurrentMonth },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
          },
          total: { $sum: '$amount' },
        },
      },
    ]);

    // Format last 6 months labels
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];

    const monthlyChartData = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(currentYear, currentMonth - i, 1);
      const m = d.getMonth() + 1;
      const y = d.getFullYear();
      const label = `${monthNames[m - 1]} ${y}`;

      const expMatch = monthlyExpensesAgg.find(
        (e) => e._id.year === y && e._id.month === m
      );
      const incMatch = monthlyIncomeAgg.find(
        (inc) => inc._id.year === y && inc._id.month === m
      );

      monthlyChartData.push({
        month: label,
        year: y,
        monthNum: m,
        expenses: expMatch ? expMatch.total : 0,
        income: incMatch ? incMatch.total : 0,
        savings: (incMatch ? incMatch.total : 0) - (expMatch ? expMatch.total : 0),
      });
    }

    // 6. Recent transactions (latest 5 expenses and latest 5 incomes)
    const recentExpenses = await Expense.find({ user: userId })
      .sort({ date: -1 })
      .limit(6);

    const recentIncomes = await Income.find({ user: userId })
      .sort({ date: -1 })
      .limit(4);

    // 7. Current Month Budget Status
    const budget = await Budget.findOne({
      user: userId,
      month: currentMonth + 1,
      year: currentYear,
    });

    const totalBudget = budget ? budget.totalBudget : 0;
    const budgetRemaining = totalBudget > 0 ? totalBudget - currentMonthExpenses : 0;
    const budgetUsedPercentage =
      totalBudget > 0 ? Math.round((currentMonthExpenses / totalBudget) * 100) : 0;

    res.json({
      success: true,
      data: {
        totalIncome: totalAllIncome,
        totalExpenses: totalAllExpenses,
        availableBalance,
        currentMonthIncome,
        currentMonthExpenses,
        monthlySavings,
        totalBudget,
        budgetRemaining,
        budgetUsedPercentage,
        isBudgetWarning: totalBudget > 0 && budgetUsedPercentage >= 80 && budgetUsedPercentage < 100,
        isBudgetExceeded: totalBudget > 0 && budgetUsedPercentage >= 100,
        categoryChartData,
        monthlyChartData,
        recentExpenses,
        recentIncomes,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get smart expense analysis, unusual spending, projections & recommendations
// @route   GET /api/analytics/smart-analysis
// @access  Private
const getSmartAnalysis = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-indexed

    // Dates for current and previous month
    const startOfCurrentMonth = new Date(currentYear, currentMonth, 1);
    const endOfCurrentMonth = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59, 999);

    const startOfPrevMonth = new Date(currentYear, currentMonth - 1, 1);
    const endOfPrevMonth = new Date(currentYear, currentMonth, 0, 23, 59, 59, 999);

    // Fetch all current month expenses
    const currentExpenses = await Expense.find({
      user: userId,
      date: { $gte: startOfCurrentMonth, $lte: endOfCurrentMonth },
    }).sort({ date: -1 });

    // Fetch previous month expenses
    const prevExpenses = await Expense.find({
      user: userId,
      date: { $gte: startOfPrevMonth, $lte: endOfPrevMonth },
    });

    // 1. Calculate total monthly expenses
    const totalCurrentMonthExpenses = currentExpenses.reduce(
      (sum, item) => sum + item.amount,
      0
    );
    const totalPrevMonthExpenses = prevExpenses.reduce(
      (sum, item) => sum + item.amount,
      0
    );

    // 2. Identify highest spending category
    const categoryTotals = {};
    currentExpenses.forEach((exp) => {
      categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
    });

    let highestCategory = { name: 'None', amount: 0, percentage: 0 };
    Object.keys(categoryTotals).forEach((cat) => {
      if (categoryTotals[cat] > highestCategory.amount) {
        highestCategory = {
          name: cat,
          amount: categoryTotals[cat],
          percentage:
            totalCurrentMonthExpenses > 0
              ? Math.round((categoryTotals[cat] / totalCurrentMonthExpenses) * 100)
              : 0,
        };
      }
    });

    // 3. Calculate average daily spending
    const dayOfMonth = now.getDate(); // 1 to 31
    const averageDailySpending =
      dayOfMonth > 0 ? Math.round(totalCurrentMonthExpenses / dayOfMonth) : 0;

    // 4. Compare current and previous month spending
    let monthOverMonthDiff = totalCurrentMonthExpenses - totalPrevMonthExpenses;
    let monthOverMonthPercentage = 0;
    if (totalPrevMonthExpenses > 0) {
      monthOverMonthPercentage = Math.round(
        ((totalCurrentMonthExpenses - totalPrevMonthExpenses) / totalPrevMonthExpenses) * 100
      );
    }

    // 5. Unusual spending detection using average-based threshold
    // Calculate mean and threshold for current user's expenses
    let unusualExpenses = [];
    if (currentExpenses.length > 0) {
      const avgExpenseAmount = totalCurrentMonthExpenses / currentExpenses.length;
      // Define threshold: amounts > 1.8x average transaction amount or absolute high threshold
      const threshold = Math.max(avgExpenseAmount * 1.8, 1500);

      unusualExpenses = currentExpenses
        .filter((exp) => exp.amount >= threshold)
        .map((exp) => ({
          _id: exp._id,
          title: exp.title,
          category: exp.category,
          amount: exp.amount,
          date: exp.date,
          threshold,
          averageAmount: Math.round(avgExpenseAmount),
          ratio: (exp.amount / (avgExpenseAmount || 1)).toFixed(1),
          reason: `Transaction is ${(exp.amount / (avgExpenseAmount || 1)).toFixed(1)}x higher than your average expense (₹${Math.round(avgExpenseAmount)})`,
        }));
    }

    // 6. Estimate next month's expenses using historical monthly averages
    // Query last 3 months
    const threeMonthsAgo = new Date(currentYear, currentMonth - 2, 1);
    const pastMonthsExpenses = await Expense.aggregate([
      {
        $match: {
          user: userId,
          date: { $gte: threeMonthsAgo, $lte: endOfCurrentMonth },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
          },
          monthlyTotal: { $sum: '$amount' },
        },
      },
    ]);

    let estimatedNextMonthExpenses = 0;
    if (pastMonthsExpenses.length > 0) {
      const sum = pastMonthsExpenses.reduce((acc, curr) => acc + curr.monthlyTotal, 0);
      estimatedNextMonthExpenses = Math.round(sum / pastMonthsExpenses.length);
    } else {
      estimatedNextMonthExpenses = totalCurrentMonthExpenses;
    }

    // 7. Module 7: Smart Recommendations (Rule-based suggestions)
    const recommendations = [];

    // Rule A: Shopping expenses
    const shoppingTotal = categoryTotals['Shopping'] || 0;
    const shoppingPercentage =
      totalCurrentMonthExpenses > 0 ? (shoppingTotal / totalCurrentMonthExpenses) * 100 : 0;
    if (shoppingPercentage >= 25) {
      recommendations.push({
        id: 'rec_shopping',
        type: 'warning',
        category: 'Shopping',
        title: 'Reduce Unnecessary Shopping Expenses',
        description: `You have allocated ${Math.round(shoppingPercentage)}% of your expenses to Shopping (₹${shoppingTotal.toLocaleString()}). Try adopting the 48-hour delay rule before discretionary purchases.`,
        action: 'Review shopping items and defer non-urgent purchases',
      });
    }

    // Rule B: Food & Dining expenses
    const foodTotal = categoryTotals['Food & Dining'] || 0;
    const foodPercentage =
      totalCurrentMonthExpenses > 0 ? (foodTotal / totalCurrentMonthExpenses) * 100 : 0;
    if (foodPercentage >= 30) {
      recommendations.push({
        id: 'rec_food',
        type: 'warning',
        category: 'Food & Dining',
        title: 'Control Food & Dining Expenses',
        description: `Food & Dining represents ${Math.round(foodPercentage)}% of your monthly expenditure (₹${foodTotal.toLocaleString()}). Cooking home-cooked meals more often could save up to 30-40%.`,
        action: 'Set a weekly dining out limit',
      });
    }

    // Rule C: Monthly Budget Check
    const budget = await Budget.findOne({
      user: userId,
      month: currentMonth + 1,
      year: currentYear,
    });

    if (budget && budget.totalBudget > 0) {
      const budgetPercentage = Math.round(
        (totalCurrentMonthExpenses / budget.totalBudget) * 100
      );
      if (budgetPercentage >= 100) {
        recommendations.push({
          id: 'rec_budget_exceeded',
          type: 'danger',
          category: 'Budget',
          title: 'Avoid Exceeding Monthly Budget',
          description: `You have surpassed your total monthly budget of ₹${budget.totalBudget.toLocaleString()} by ${(budgetPercentage - 100)}%. Immediate spending freeze on non-essentials is recommended.`,
          action: 'Pause non-essential expenses for the remainder of the month',
        });
      } else if (budgetPercentage >= 80) {
        recommendations.push({
          id: 'rec_budget_warning',
          type: 'warning',
          category: 'Budget',
          title: 'Approaching Monthly Budget Threshold',
          description: `You have already utilized ${budgetPercentage}% of your total budget. Only ₹${(budget.totalBudget - totalCurrentMonthExpenses).toLocaleString()} remains.`,
          action: 'Stick strictly to essential bills until month-end',
        });
      }
    } else {
      recommendations.push({
        id: 'rec_no_budget',
        type: 'info',
        category: 'Budget',
        title: 'Set a Monthly Spending Budget',
        description: 'You have not set a budget for this month. Setting a clear budget helps avoid impulse spending and increases your monthly savings rate.',
        action: 'Go to Budget Management and set limits',
      });
    }

    // Rule D: Savings Rate
    const currentIncomeDoc = await Income.aggregate([
      {
        $match: {
          user: userId,
          date: { $gte: startOfCurrentMonth, $lte: endOfCurrentMonth },
        },
      },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const currentIncome = currentIncomeDoc.length > 0 ? currentIncomeDoc[0].total : 0;

    if (currentIncome > 0) {
      const savingsRate = Math.round(
        ((currentIncome - totalCurrentMonthExpenses) / currentIncome) * 100
      );
      if (savingsRate < 20 && savingsRate >= 0) {
        recommendations.push({
          id: 'rec_savings_low',
          type: 'info',
          category: 'Savings',
          title: 'Increase Monthly Savings',
          description: `Your savings rate is currently ${savingsRate}%. Financial experts recommend saving at least 20% of your earnings according to the 50/30/20 rule.`,
          action: 'Identify low-priority subscriptions or recurrent charges to cancel',
        });
      } else if (savingsRate < 0) {
        recommendations.push({
          id: 'rec_deficit',
          type: 'danger',
          category: 'Savings',
          title: 'Cashflow Deficit Warning',
          description: `Your expenses exceed your income this month by ₹${Math.abs(currentIncome - totalCurrentMonthExpenses).toLocaleString()}. You are operating in negative cash flow.`,
          action: 'Audit recent expenses and curtail discretionary categories immediately',
        });
      } else {
        recommendations.push({
          id: 'rec_savings_healthy',
          type: 'success',
          category: 'Savings',
          title: 'Great Savings Discipline!',
          description: `You are maintaining a healthy ${savingsRate}% savings rate this month! Keep this momentum up to achieve your long-term goals.`,
          action: 'Consider transferring excess funds to an investment or emergency fund',
        });
      }
    }

    // Rule E: Unusual spending alert
    if (unusualExpenses.length > 0) {
      recommendations.push({
        id: 'rec_unusual',
        type: 'warning',
        category: 'Anomalies',
        title: `${unusualExpenses.length} Unusual High Expense${unusualExpenses.length > 1 ? 's' : ''} Detected`,
        description: `We detected ${unusualExpenses.length} transactions significantly above your typical transaction average, including "${unusualExpenses[0].title}" (₹${unusualExpenses[0].amount.toLocaleString()}).`,
        action: 'Inspect unusual spending table below to confirm validity',
      });
    }

    res.json({
      success: true,
      analysis: {
        totalCurrentMonthExpenses,
        totalPrevMonthExpenses,
        highestCategory,
        averageDailySpending,
        monthOverMonthDiff,
        monthOverMonthPercentage,
        unusualExpenses,
        estimatedNextMonthExpenses,
        recommendations,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getSmartAnalysis,
};
