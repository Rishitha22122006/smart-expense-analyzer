const mongoose = require('mongoose');

const expenseCategories = [
  'Food & Dining',
  'Shopping',
  'Housing & Rent',
  'Transportation',
  'Utilities & Bills',
  'Entertainment',
  'Healthcare',
  'Education',
  'Personal Care',
  'Travel',
  'Others',
];

const paymentMethods = [
  'Cash',
  'Credit Card',
  'Debit Card',
  'UPI / Net Banking',
  'Other',
];

const expenseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Expense must belong to a user'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide an expense title'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    amount: {
      type: Number,
      required: [true, 'Please specify the expense amount'],
      min: [0.01, 'Amount must be greater than 0'],
    },
    category: {
      type: String,
      required: [true, 'Please select an expense category'],
      enum: {
        values: expenseCategories,
        message: '{VALUE} is not a valid category',
      },
    },
    date: {
      type: Date,
      required: [true, 'Please select a date for the expense'],
      default: Date.now,
    },
    paymentMethod: {
      type: String,
      required: [true, 'Please select a payment method'],
      enum: {
        values: paymentMethods,
        message: '{VALUE} is not a valid payment method',
      },
      default: 'UPI / Net Banking',
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

expenseSchema.statics.CATEGORIES = expenseCategories;
expenseSchema.statics.PAYMENT_METHODS = paymentMethods;

module.exports = mongoose.model('Expense', expenseSchema);
