const Income = require('../models/Income');

// @desc    Get all incomes with search & filter
// @route   GET /api/incomes
// @access  Private
const getIncomes = async (req, res, next) => {
  try {
    const {
      search,
      category,
      startDate,
      endDate,
      sortBy = 'date',
      order = 'desc',
      page = 1,
      limit = 50,
    } = req.query;

    const query = { user: req.user.id };

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.date.$lte = end;
      }
    }

    const sortOptions = {};
    sortOptions[sortBy] = order === 'asc' ? 1 : -1;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Income.countDocuments(query);
    const incomes = await Income.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    const totalAmountResult = await Income.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    const totalAllTimeIncome = totalAmountResult.length > 0 ? totalAmountResult[0].total : 0;

    res.json({
      success: true,
      count: incomes.length,
      total,
      totalAllTimeIncome,
      currentPage: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      incomes,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single income by ID
// @route   GET /api/incomes/:id
// @access  Private
const getIncomeById = async (req, res, next) => {
  try {
    const income = await Income.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!income) {
      return res.status(404).json({
        success: false,
        message: 'Income record not found',
      });
    }

    res.json({
      success: true,
      income,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add new income
// @route   POST /api/incomes
// @access  Private
const addIncome = async (req, res, next) => {
  try {
    const { title, amount, category, date, paymentMethod, description } = req.body;

    if (!title || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Income title and amount are required',
      });
    }

    const income = await Income.create({
      user: req.user.id,
      title,
      amount: Number(amount),
      category: category || 'Salary',
      date: date ? new Date(date) : new Date(),
      paymentMethod: paymentMethod || 'Bank Transfer',
      description: description || '',
    });

    res.status(201).json({
      success: true,
      message: 'Income added successfully',
      income,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update income
// @route   PUT /api/incomes/:id
// @access  Private
const updateIncome = async (req, res, next) => {
  try {
    const income = await Income.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!income) {
      return res.status(404).json({
        success: false,
        message: 'Income record not found or unauthorized',
      });
    }

    const { title, amount, category, date, paymentMethod, description } = req.body;

    if (title) income.title = title;
    if (amount !== undefined) income.amount = Number(amount);
    if (category) income.category = category;
    if (date) income.date = new Date(date);
    if (paymentMethod) income.paymentMethod = paymentMethod;
    if (description !== undefined) income.description = description;

    const updatedIncome = await income.save();

    res.json({
      success: true,
      message: 'Income updated successfully',
      income: updatedIncome,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete income
// @route   DELETE /api/incomes/:id
// @access  Private
const deleteIncome = async (req, res, next) => {
  try {
    const income = await Income.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!income) {
      return res.status(404).json({
        success: false,
        message: 'Income record not found or unauthorized',
      });
    }

    res.json({
      success: true,
      message: 'Income deleted successfully',
      deletedId: req.params.id,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get income meta categories
// @route   GET /api/incomes/meta/options
// @access  Private
const getIncomeMetaOptions = (req, res) => {
  res.json({
    success: true,
    categories: Income.CATEGORIES,
    paymentMethods: Income.PAYMENT_METHODS,
  });
};

module.exports = {
  getIncomes,
  getIncomeById,
  addIncome,
  updateIncome,
  deleteIncome,
  getIncomeMetaOptions,
};
