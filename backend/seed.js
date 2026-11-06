const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Expense = require('./models/Expense');
const Income = require('./models/Income');
const Budget = require('./models/Budget');

dotenv.config();

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smart_expense_analyzer';
    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected to database...');

    // 1. Create or Find Demo User
    const demoEmail = 'demo@example.com';
    let user = await User.findOne({ email: demoEmail });

    if (!user) {
      user = await User.create({
        name: 'Alex Sharma',
        email: demoEmail,
        password: 'password123',
        currency: 'INR',
        monthlyIncomeTarget: 75000,
        occupation: 'Software Engineer',
      });
      console.log('[Seed] Created demo user: demo@example.com / password123');
    } else {
      console.log('[Seed] Found existing demo user: demo@example.com');
    }

    // Clean up previous demo records
    await Expense.deleteMany({ user: user._id });
    await Income.deleteMany({ user: user._id });
    await Budget.deleteMany({ user: user._id });
    console.log('[Seed] Cleaned up previous user records.');

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-indexed

    // Helper to make dates in current month or past months
    const makeDate = (monthOffset, day) => {
      const d = new Date(currentYear, currentMonth + monthOffset, day, 12, 0, 0);
      return d;
    };

    // 2. Insert Incomes
    const incomes = [
      {
        user: user._id,
        title: 'Monthly Salary - TechCorp',
        amount: 65000,
        category: 'Salary',
        date: makeDate(0, 1),
        paymentMethod: 'Bank Transfer',
        description: 'November monthly tech salary credit',
      },
      {
        user: user._id,
        title: 'Freelance Frontend Project',
        amount: 15000,
        category: 'Freelance',
        date: makeDate(0, 12),
        paymentMethod: 'UPI / Net Banking',
        description: 'Landing page UI design and React development',
      },
      {
        user: user._id,
        title: 'Stock Dividend Payout',
        amount: 2500,
        category: 'Investments',
        date: makeDate(0, 18),
        paymentMethod: 'Bank Transfer',
        description: 'Quarterly mutual fund and equity dividend',
      },
      // Previous month income
      {
        user: user._id,
        title: 'Monthly Salary - TechCorp',
        amount: 65000,
        category: 'Salary',
        date: makeDate(-1, 1),
        paymentMethod: 'Bank Transfer',
        description: 'October monthly tech salary credit',
      },
      {
        user: user._id,
        title: 'Consulting Session',
        amount: 8000,
        category: 'Freelance',
        date: makeDate(-1, 15),
        paymentMethod: 'UPI / Net Banking',
        description: '1-on-1 career and architecture consultation',
      },
      // 2 months ago income
      {
        user: user._id,
        title: 'Monthly Salary - TechCorp',
        amount: 65000,
        category: 'Salary',
        date: makeDate(-2, 1),
        paymentMethod: 'Bank Transfer',
        description: 'September monthly tech salary credit',
      },
    ];

    await Income.insertMany(incomes);
    console.log(`[Seed] Inserted ${incomes.length} income entries.`);

    // 3. Insert Expenses
    const expenses = [
      // Current Month
      {
        user: user._id,
        title: 'Apartment Rent',
        amount: 16000,
        category: 'Housing & Rent',
        date: makeDate(0, 2),
        paymentMethod: 'UPI / Net Banking',
        description: 'Monthly flat rent to landlord',
      },
      {
        user: user._id,
        title: 'Supermarket Grocery Haul',
        amount: 4200,
        category: 'Food & Dining',
        date: makeDate(0, 3),
        paymentMethod: 'Debit Card',
        description: 'Organic groceries, veggies, dairy, and spices',
      },
      {
        user: user._id,
        title: 'High-End Mechanical Keyboard (Unusual Expense)',
        amount: 8999, // Triggers unusual threshold!
        category: 'Shopping',
        date: makeDate(0, 5),
        paymentMethod: 'Credit Card',
        description: 'Keychron wireless ergonomic mechanical keyboard for setup',
      },
      {
        user: user._id,
        title: 'Electricity & Broadband Bills',
        amount: 2450,
        category: 'Utilities & Bills',
        date: makeDate(0, 6),
        paymentMethod: 'UPI / Net Banking',
        description: 'High speed fiber broadband and BESCOM electricity',
      },
      {
        user: user._id,
        title: 'Weekend Dine-out with Friends',
        amount: 3200,
        category: 'Food & Dining',
        date: makeDate(0, 8),
        paymentMethod: 'UPI / Net Banking',
        description: 'Italian dinner and beverages at bistro',
      },
      {
        user: user._id,
        title: 'Metro Smart Card Recharge & Fuel',
        amount: 1800,
        category: 'Transportation',
        date: makeDate(0, 10),
        paymentMethod: 'UPI / Net Banking',
        description: 'Metro pass recharge and scooter fuel',
      },
      {
        user: user._id,
        title: 'Winter Jacket & Footwear',
        amount: 5400,
        category: 'Shopping',
        date: makeDate(0, 14),
        paymentMethod: 'Credit Card',
        description: 'Puffer jacket and running shoes sale',
      },
      {
        user: user._id,
        title: 'Movie Tickets & Snacks',
        amount: 1200,
        category: 'Entertainment',
        date: makeDate(0, 17),
        paymentMethod: 'UPI / Net Banking',
        description: 'IMAX movie night with popcorn',
      },
      {
        user: user._id,
        title: 'Full Body Health Checkup & Vitamins',
        amount: 2800,
        category: 'Healthcare',
        date: makeDate(0, 19),
        paymentMethod: 'Debit Card',
        description: 'Diagnostic routine test and multivitamin supplies',
      },
      {
        user: user._id,
        title: 'Udemy Fullstack Web Course',
        amount: 799,
        category: 'Education',
        date: makeDate(0, 22),
        paymentMethod: 'UPI / Net Banking',
        description: 'Intermediate React & Node architecture certification',
      },
      {
        user: user._id,
        title: 'Mid-Month Grocery & Snacks',
        amount: 2600,
        category: 'Food & Dining',
        date: makeDate(0, 24),
        paymentMethod: 'Cash',
        description: 'Fresh fruits, bread, coffee beans, snacks',
      },

      // Previous Month Expenses
      {
        user: user._id,
        title: 'Apartment Rent',
        amount: 16000,
        category: 'Housing & Rent',
        date: makeDate(-1, 2),
        paymentMethod: 'UPI / Net Banking',
        description: 'October rent',
      },
      {
        user: user._id,
        title: 'Groceries & Provisions',
        amount: 5800,
        category: 'Food & Dining',
        date: makeDate(-1, 4),
        paymentMethod: 'Debit Card',
        description: 'Monthly supplies',
      },
      {
        user: user._id,
        title: 'Utilities & Wifi',
        amount: 2200,
        category: 'Utilities & Bills',
        date: makeDate(-1, 7),
        paymentMethod: 'UPI / Net Banking',
        description: 'Bills payment',
      },
      {
        user: user._id,
        title: 'Casual Dining Out',
        amount: 2500,
        category: 'Food & Dining',
        date: makeDate(-1, 13),
        paymentMethod: 'UPI / Net Banking',
        description: 'Dining out',
      },
      {
        user: user._id,
        title: 'Sneakers & Casual Wear',
        amount: 3900,
        category: 'Shopping',
        date: makeDate(-1, 18),
        paymentMethod: 'Credit Card',
        description: 'Clothing purchase',
      },
      {
        user: user._id,
        title: 'Cab rides & Fuel',
        amount: 1950,
        category: 'Transportation',
        date: makeDate(-1, 21),
        paymentMethod: 'UPI / Net Banking',
        description: 'Commuting expenses',
      },

      // 2 Months Ago Expenses
      {
        user: user._id,
        title: 'Apartment Rent',
        amount: 16000,
        category: 'Housing & Rent',
        date: makeDate(-2, 2),
        paymentMethod: 'UPI / Net Banking',
        description: 'September rent',
      },
      {
        user: user._id,
        title: 'Groceries',
        amount: 6100,
        category: 'Food & Dining',
        date: makeDate(-2, 5),
        paymentMethod: 'Debit Card',
        description: 'Food & supplies',
      },
      {
        user: user._id,
        title: 'Utilities',
        amount: 2300,
        category: 'Utilities & Bills',
        date: makeDate(-2, 9),
        paymentMethod: 'UPI / Net Banking',
        description: 'Wifi and electricity',
      },
      {
        user: user._id,
        title: 'Transport Pass',
        amount: 1700,
        category: 'Transportation',
        date: makeDate(-2, 16),
        paymentMethod: 'Cash',
        description: 'Monthly commute',
      },
    ];

    await Expense.insertMany(expenses);
    console.log(`[Seed] Inserted ${expenses.length} expense entries.`);

    // 4. Insert Budget (Current Month)
    await Budget.create({
      user: user._id,
      month: currentMonth + 1,
      year: currentYear,
      totalBudget: 52000,
      categoryBudgets: [
        { category: 'Housing & Rent', amount: 16000 },
        { category: 'Food & Dining', amount: 11000 },
        { category: 'Shopping', amount: 10000 },
        { category: 'Utilities & Bills', amount: 3500 },
        { category: 'Transportation', amount: 3500 },
        { category: 'Entertainment', amount: 3000 },
        { category: 'Healthcare', amount: 3000 },
        { category: 'Education', amount: 2000 },
      ],
    });
    console.log('[Seed] Created current month budget with category limits.');

    console.log('\n=============================================');
    console.log('✅ SEED COMPLETED SUCCESSFULLY!');
    console.log('Demo Credentials:');
    console.log('Email: demo@example.com');
    console.log('Password: password123');
    console.log('=============================================\n');

    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedData();
