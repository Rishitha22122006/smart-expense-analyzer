const mongoose = require('mongoose');

const incomeCategories = [
  'Salary',
  'Freelance',
  'Investments',
  'Business',
  'Part-time',
  'Allowance',
  'Gifts',
  'Other',
];

const incomePaymentMethods = [
  'Bank Transfer',
  'Cash',
  'UPI / Net Banking',
  'Cheque',
  'Other',
];

const incomeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Income must belong to a user'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide an income source/title'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    amount: {
      type: Number,
      required: [true, 'Please specify the income amount'],
      min: [0.01, 'Amount must be greater than 0'],
    },
    category: {
      type: String,
      required: [true, 'Please select an income category'],
      enum: {
        values: incomeCategories,
        message: '{VALUE} is not a valid income category',
      },
      default: 'Salary',
    },
    date: {
      type: Date,
      required: [true, 'Please select a date for the income'],
      default: Date.now,
    },
    paymentMethod: {
      type: String,
      enum: incomePaymentMethods,
      default: 'Bank Transfer',
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

incomeSchema.statics.CATEGORIES = incomeCategories;
incomeSchema.statics.PAYMENT_METHODS = incomePaymentMethods;

module.exports = mongoose.model('Income', incomeSchema);
