const mongoose = require('mongoose');

const categoryBudgetSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [0, 'Budget amount cannot be negative'],
    },
  },
  { _id: false }
);

const budgetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Budget must belong to a user'],
      index: true,
    },
    month: {
      type: Number,
      required: [true, 'Please specify the month (1-12)'],
      min: 1,
      max: 12,
    },
    year: {
      type: Number,
      required: [true, 'Please specify the year'],
      min: 2000,
      max: 2100,
    },
    totalBudget: {
      type: Number,
      required: [true, 'Please specify total monthly budget'],
      min: [0, 'Total budget cannot be negative'],
      default: 0,
    },
    categoryBudgets: [categoryBudgetSchema],
  },
  {
    timestamps: true,
  }
);

// One budget document per user per month/year
budgetSchema.index({ user: 1, year: 1, month: 1 }, { unique: true });

module.exports = mongoose.model('Budget', budgetSchema);
