const Expense = require('../models/Expense');
const Income = require('../models/Income');

// @desc    Get detailed report data (Weekly, Monthly, Yearly, Category-wise, Income vs Expense)
// @route   GET /api/reports/summary
// @access  Private
const getReportSummary = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { year = new Date().getFullYear(), month = new Date().getMonth() + 1 } = req.query;

    const selectedYear = parseInt(year, 10);
    const selectedMonth = parseInt(month, 10);

    const startOfMonth = new Date(selectedYear, selectedMonth - 1, 1);
    const endOfMonth = new Date(selectedYear, selectedMonth, 0, 23, 59, 59, 999);

    const startOfYear = new Date(selectedYear, 0, 1);
    const endOfYear = new Date(selectedYear, 11, 31, 23, 59, 59, 999);

    // 1. Category-wise Report (for selected month)
    const categoryReport = await Expense.aggregate([
      {
        $match: {
          user: userId,
          date: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      {
        $group: {
          _id: '$category',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 },
          avgAmount: { $avg: '$amount' },
        },
      },
      { $sort: { totalAmount: -1 } },
    ]);

    const totalMonthSpent = categoryReport.reduce((acc, c) => acc + c.totalAmount, 0);

    const categoryBreakdown = categoryReport.map((c) => ({
      category: c._id,
      totalAmount: c.totalAmount,
      count: c.count,
      avgAmount: Math.round(c.avgAmount),
      percentage: totalMonthSpent > 0 ? Math.round((c.totalAmount / totalMonthSpent) * 100) : 0,
    }));

    // 2. Weekly Report (breakdown for selected month into 4-5 weeks)
    const monthExpenses = await Expense.find({
      user: userId,
      date: { $gte: startOfMonth, $lte: endOfMonth },
    }).sort({ date: 1 });

    const weeklyData = [
      { week: 'Week 1 (1-7)', amount: 0, count: 0 },
      { week: 'Week 2 (8-14)', amount: 0, count: 0 },
      { week: 'Week 3 (15-21)', amount: 0, count: 0 },
      { week: 'Week 4 (22-28)', amount: 0, count: 0 },
      { week: 'Week 5 (29+)', amount: 0, count: 0 },
    ];

    monthExpenses.forEach((exp) => {
      const day = new Date(exp.date).getDate();
      if (day <= 7) {
        weeklyData[0].amount += exp.amount;
        weeklyData[0].count += 1;
      } else if (day <= 14) {
        weeklyData[1].amount += exp.amount;
        weeklyData[1].count += 1;
      } else if (day <= 21) {
        weeklyData[2].amount += exp.amount;
        weeklyData[2].count += 1;
      } else if (day <= 28) {
        weeklyData[3].amount += exp.amount;
        weeklyData[3].count += 1;
      } else {
        weeklyData[4].amount += exp.amount;
        weeklyData[4].count += 1;
      }
    });

    // 3. Monthly Report for Selected Year (All 12 months)
    const monthlyExpensesYear = await Expense.aggregate([
      {
        $match: {
          user: userId,
          date: { $gte: startOfYear, $lte: endOfYear },
        },
      },
      {
        $group: {
          _id: { $month: '$date' },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]);

    const monthlyIncomeYear = await Income.aggregate([
      {
        $match: {
          user: userId,
          date: { $gte: startOfYear, $lte: endOfYear },
        },
      },
      {
        $group: {
          _id: { $month: '$date' },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]);

    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];

    const monthlyComparison = monthNames.map((name, index) => {
      const monthNum = index + 1;
      const exp = monthlyExpensesYear.find((e) => e._id === monthNum);
      const inc = monthlyIncomeYear.find((i) => i._id === monthNum);
      const expTotal = exp ? exp.total : 0;
      const incTotal = inc ? inc.total : 0;
      return {
        month: name,
        monthNum,
        expense: expTotal,
        income: incTotal,
        savings: incTotal - expTotal,
        expenseCount: exp ? exp.count : 0,
      };
    });

    // 4. Yearly Overview
    const totalYearExpense = monthlyComparison.reduce((acc, m) => acc + m.expense, 0);
    const totalYearIncome = monthlyComparison.reduce((acc, m) => acc + m.income, 0);
    const totalYearSavings = totalYearIncome - totalYearExpense;

    res.json({
      success: true,
      year: selectedYear,
      month: selectedMonth,
      summary: {
        totalMonthSpent,
        totalYearExpense,
        totalYearIncome,
        totalYearSavings,
      },
      weeklyReport: weeklyData,
      monthlyComparison,
      categoryBreakdown,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Export expenses to CSV
// @route   GET /api/reports/export/csv
// @access  Private
const exportExpensesCSV = async (req, res, next) => {
  try {
    const { startDate, endDate, category } = req.query;
    const query = { user: req.user.id };

    if (category && category !== 'All') {
      query.category = category;
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.date.$lte = end;
      }
    }

    const expenses = await Expense.find(query).sort({ date: -1 });

    // Build CSV content
    const headers = ['ID', 'Date', 'Title', 'Category', 'Amount', 'Payment Method', 'Description'];
    const rows = expenses.map((exp) => {
      const formattedDate = new Date(exp.date).toISOString().split('T')[0];
      const safeTitle = `"${(exp.title || '').replace(/"/g, '""')}"`;
      const safeDesc = `"${(exp.description || '').replace(/"/g, '""')}"`;
      const safeCategory = `"${(exp.category || '').replace(/"/g, '""')}"`;
      const safeMethod = `"${(exp.paymentMethod || '').replace(/"/g, '""')}"`;

      return [
        exp._id,
        formattedDate,
        safeTitle,
        safeCategory,
        exp.amount,
        safeMethod,
        safeDesc,
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\r\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=expenses-report-${new Date().toISOString().split('T')[0]}.csv`
    );
    res.status(200).send(csvContent);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getReportSummary,
  exportExpensesCSV,
};
