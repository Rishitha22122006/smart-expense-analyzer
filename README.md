# SMART EXPENSE ANALYZER
### Personal Finance Tracking and Smart Spending Analysis System
> **Academic Level:** Intermediate-Level B.Tech CSE Capstone Project  
> **Architecture:** Modular MERN Stack (MongoDB, Express.js, React.js with Vite, Node.js)

---

## 📌 Project Overview

**SMART EXPENSE ANALYZER** is a complete, beginner-to-intermediate level full-stack web application designed to help individuals monitor income, log day-to-day expenditures, track multi-category monthly budgets, and obtain automated spending insights.

Designed specifically to meet the evaluation standards of a **B.Tech CSE Capstone Project**, this project emphasizes:
- Clean, modular MVC-based backend architecture.
- Real-time MongoDB database integration with strict user-level data isolation.
- Responsive, interactive React 19 / Vite UI with a modern **Navy Blue & Purple** color theme.
- Algorithmic, rule-based spending analysis without unnecessary overcomplicated machine learning or external black-box microservices.

---

## 🚀 Key Modules & Features

| Module | Description | Implementation Details |
| :--- | :--- | :--- |
| **Module 1: User Authentication** | Registration, Login, Logout, and Protected Routes | Password hashing with `bcryptjs`, JWT bearer authentication, session persistence in `localStorage`. |
| **Module 2: Dashboard Overview** | Real-time financial telemetry | Displays Total Income, Total Expenses, Available Balance, Monthly Savings, Recent Transactions, 6-Month comparative Recharts bar chart, and Category Pie Chart. |
| **Module 3: Expense Management** | Full CRUD + Ledger | Log expenditures with Title, Amount, Category, Date, Payment Method (UPI, Cards, Cash), and Notes. Real-time search, multi-category filters, and sorting. |
| **Module 4: Income Management** | Cash Inflow Tracking | Record and categorize income streams (Salary, Freelance, Investments, Business, etc.) and audit net savings. |
| **Module 5: Smart Spending Analysis** | Algorithmic calculations | JavaScript-based calculations: Highest spending category, Average daily spend, Month-over-month % trend, Anomaly threshold detector (1.8x mean), and historical 3-month forecast. |
| **Module 6: Budget Management** | Threshold Warning System | Set overall monthly budget and category-wise spending limits. Visual progress meters trigger **80% Amber Warning** and **100% Red Alert** when exceeded. |
| **Module 7: Smart Recommendations** | Rule-Based Expert System | Generates actionable advice: Curtail shopping (>25%), Control dining (>30%), Budget threshold compliance, and Savings rate (50/30/20 guideline). |
| **Module 8: Reports & CSV Export** | Historical Audits | Weekly breakdown, 12-month annual comparison, category share tables, and downloadable RFC-compliant CSV expense ledger export. |
| **User Profile & Theme** | Personalization | Custom currency selector (INR ₹, USD $, EUR €, GBP £), Dark/Light theme mode switch, occupation tracking, and secure password updates. |

---

## 🛠️ Technology Stack

### **Frontend**
- **Library / Framework:** React.js (v19) with Vite
- **Styling:** Tailwind CSS (Navy Blue, Purple, Indigo, Crisp White)
- **Routing:** React Router DOM (v7)
- **Data Visualizations:** Recharts (Bar Charts, Donut Pie Charts)
- **Icons:** Lucide React
- **HTTP Client:** Axios (configured with automated JWT Bearer interceptor)

### **Backend**
- **Runtime:** Node.js (v20+)
- **Server Framework:** Express.js (v4)
- **Authentication:** JSON Web Tokens (`jsonwebtoken`) & `bcryptjs`
- **CORS & Environment:** `cors`, `dotenv`
- **Architecture:** Controller-Route-Model (MVC pattern)

### **Database**
- **Database Engine:** MongoDB (Local or MongoDB Atlas)
- **Object Data Modeling (ODM):** Mongoose (v8) with schema validation, compound indices, and timestamps

---

## 📂 Project Structure

```text
smart-expense-analyzer/
│
├── backend/
│   ├── config/
│   │   └── db.js                 # Mongoose database connection
│   ├── models/
│   │   ├── User.js               # User schema with bcrypt pre-save hook
│   │   ├── Expense.js            # Expense schema with category/payment enums
│   │   ├── Income.js             # Income schema with sources
│   │   └── Budget.js             # Monthly & category budgets schema
│   ├── controllers/
│   │   ├── authController.js     # Register, Login, Profile & Password
│   │   ├── expenseController.js  # Expense CRUD & multi-filter search
│   │   ├── incomeController.js   # Income CRUD
│   │   ├── budgetController.js   # Budget status & 80%/100% calculations
│   │   ├── analyticsController.js# Smart spend calculations & recommendations
│   │   └── reportController.js   # Weekly, monthly reports & CSV export
│   ├── routes/
│   │   ├── authRoutes.js         # /api/auth
│   │   ├── expenseRoutes.js      # /api/expenses
│   │   ├── incomeRoutes.js       # /api/incomes
│   │   ├── budgetRoutes.js       # /api/budgets
│   │   ├── analyticsRoutes.js    # /api/analytics
│   │   └── reportRoutes.js       # /api/reports
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT bearer token verification
│   │   └── errorMiddleware.js    # Global error handling and 404 handler
│   ├── seed.js                   # Realistic Capstone demo dataset seeder
│   ├── server.js                 # Express application entry point
│   ├── .env                      # Local environment configuration
│   └── .env.example              # Example environment template
│
├── frontend/
│   ├── src/
│   │   ├── assets/               # Static icons and assets
│   │   ├── components/           # Reusable UI components
│   │   │   ├── Navbar.jsx        # Top bar with theme & currency badges
│   │   │   ├── Sidebar.jsx       # Responsive navy navigation drawer
│   │   │   ├── Layout.jsx        # Dashboard layout wrapper
│   │   │   ├── ProtectedRoute.jsx# Auth route guard
│   │   │   ├── StatCard.jsx      # KPI card with badges and gradients
│   │   │   ├── AlertBanner.jsx   # Budget 80% & 100% alert banners
│   │   │   ├── ExpenseModal.jsx  # Add/Edit expense dialog
│   │   │   ├── IncomeModal.jsx   # Add/Edit income dialog
│   │   │   └── BudgetModal.jsx   # Set monthly/category limits dialog
│   │   ├── context/
│   │   │   ├── AuthContext.jsx   # Global user state & token persistence
│   │   │   └── ThemeContext.jsx  # Dark/Light mode theme state
│   │   ├── pages/
│   │   │   ├── Landing.jsx       # Public landing showcase page
│   │   │   ├── Login.jsx         # Sign in with 1-click Demo Autofill
│   │   │   ├── Register.jsx      # Account creation page
│   │   │   ├── Dashboard.jsx     # Overview, Recharts graphs & metrics
│   │   │   ├── AddExpense.jsx    # Dedicated expense entry form
│   │   │   ├── ExpenseHistory.jsx# Ledger with search, filter & export
│   │   │   ├── IncomeManagement.jsx# Inflow streams & salary manager
│   │   │   ├── BudgetManagement.jsx# Visual progress meters & limit editor
│   │   │   ├── Analytics.jsx     # Smart analysis algorithms & recommendations
│   │   │   ├── Reports.jsx       # Weekly/monthly reports & CSV download
│   │   │   ├── Profile.jsx       # Currency, occupation, password manager
│   │   │   └── NotFound.jsx      # 404 page
│   │   ├── services/
│   │   │   └── api.js            # Central Axios client with interceptors
│   │   ├── utils/
│   │   │   └── formatters.js     # Currency symbols, dates, category colors
│   │   ├── App.jsx               # React Router configuration
│   │   ├── index.css             # Tailwind v4 configuration
│   │   └── main.jsx              # React entry root
│   ├── vite.config.js            # Vite bundler & API proxy configuration
│   └── package.json
│
├── package.json                  # Root orchestration scripts
└── README.md                     # Comprehensive documentation
```

---

## ⚙️ Installation & Local Setup

### **Prerequisites**
1. **Node.js** (v18.0.0 or higher) - [Download Node.js](https://nodejs.org/)
2. **MongoDB** (Local Community Server running on `localhost:27017` or MongoDB Atlas URI)

### **Step 1: Clone or Navigate to Directory**
```bash
cd "smart expense analyzer"
```

### **Step 2: Install Backend Dependencies**
```bash
cd backend
npm install
```

### **Step 3: Configure Environment Variables**
A `.env` file has been pre-configured in `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/smart_expense_analyzer
JWT_SECRET=smart_expense_analyzer_super_secret_jwt_key_2026
NODE_ENV=development
```
*(If you are using MongoDB Atlas, simply replace `MONGODB_URI` with your connection string).*

### **Step 4: Seed Realistic Capstone Data**
Populate the database with ready-to-present sample data (expenses across all categories, monthly incomes, and budgets):
```bash
npm run seed
```
This automatically registers the demo user:
- **Demo Email:** `demo@example.com`
- **Demo Password:** `password123`

### **Step 5: Install Frontend Dependencies**
In a new terminal window:
```bash
cd ../frontend
npm install
```

### **Step 6: Launch Both Servers**

#### **Terminal 1 (Backend):**
```bash
cd backend
npm run dev
# Server will run at http://localhost:5000
```

#### **Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
# Client will run at http://localhost:3000
```

Now open your browser and navigate to:
👉 **`http://localhost:3000`**

---

## 🧪 Quick Demo Login
1. On the landing page, click **"Demo Quick Sign In"** or go to `http://localhost:3000/login`.
2. Click the blue **"Autofill Demo"** button to instantly populate:
   - Email: `demo@example.com`
   - Password: `password123`
3. Click **"Sign In"** to land straight into the populated analytics dashboard!

---

## 🧮 Smart Expense Analysis Algorithms (Module 5 & 7)

### 1. Unusual Spending Threshold Detection
Rather than requiring complex machine learning dependencies, the system applies statistical anomaly detection:
$$\text{Transaction Mean} = \frac{\sum \text{Current Month Expenses}}{N}$$
$$\text{Threshold} = \max(\text{Mean} \times 1.8, 1500)$$
Any single expense exceeding this threshold is flagged as an unusual expense, surfacing the multiplier ratio (e.g. *"2.4x higher than your average transaction"*) to alert users of potential outliers.

### 2. Historical Moving Average Forecasting
The estimated expenditure for next month is projected based on historical monthly averages:
$$\text{Next Month Forecast} = \frac{\sum_{i=1}^{k} \text{Monthly Total}_i}{k}$$
Where $k$ is the number of historical recorded months.

### 3. Rule-Based Smart Recommendation Engine
- **Shopping Rule:** If Shopping constitutes $\ge 25\%$ of total expenses, triggers an advisory to adopt the 48-hour delay rule on discretionary purchases.
- **Dining Rule:** If Food & Dining represents $\ge 30\%$ of total spend, suggests meal preparation alternatives.
- **Budget Guard:**
  - $\ge 80\%$ usage: Triggers Amber Warning banner.
  - $\ge 100\%$ usage: Triggers Red Deficit Alert advising spending pause.
- **50/30/20 Savings Rule:** Analyzes ratio of net savings relative to total income and flags deficits or rewards disciplined savings.

---

## 📑 REST API Endpoints Specification

| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user account | Public |
| `POST` | `/api/auth/login` | Authenticate and obtain JWT token | Public |
| `GET` | `/api/auth/profile` | Get logged-in user profile | Private |
| `PUT` | `/api/auth/profile` | Update user name, currency, occupation | Private |
| `PUT` | `/api/auth/change-password` | Update account password | Private |
| `GET` | `/api/expenses` | Get all expenses (supports search, category, date filters, sorting) | Private |
| `POST` | `/api/expenses` | Create new expense record | Private |
| `PUT` | `/api/expenses/:id` | Update an existing expense | Private |
| `DELETE` | `/api/expenses/:id` | Remove an expense | Private |
| `GET` | `/api/incomes` | Get all income entries | Private |
| `POST` | `/api/incomes` | Create new income record | Private |
| `PUT` | `/api/incomes/:id` | Update an income entry | Private |
| `DELETE` | `/api/incomes/:id` | Delete an income record | Private |
| `GET` | `/api/budgets/status` | Get monthly budget status and category limits | Private |
| `POST` | `/api/budgets` | Set or update monthly budget | Private |
| `GET` | `/api/analytics/dashboard` | Get KPI metrics & chart data | Private |
| `GET` | `/api/analytics/smart-analysis` | Compute smart statistics, anomalies & tips | Private |
| `GET` | `/api/reports/summary` | Get weekly, monthly, and category report data | Private |
| `GET` | `/api/reports/export/csv` | Download expenses ledger in CSV format | Private |

---

## 🎓 Capstone Viva / Presentation Checklist

When presenting this project to evaluators:
1. **Show Architecture:** Point out the separation of concerns: Express routes, Mongoose models, controllers, and React components.
2. **Demonstrate JWT Security:** Show that all financial endpoints reject requests without a valid Bearer token (`authMiddleware.js`).
3. **Trigger Budget Alert:** Show the budget progress bar at 95%, pointing out the **80% Warning Banner** in action. Edit the budget to 40,000 to demonstrate the **100% Exceeded Alert Banner**.
4. **Demonstrate Anomaly Detection:** Navigate to **Smart Analytics** to showcase the high mechanical keyboard transaction automatically detected by the threshold calculation.
5. **Demonstrate CSV Export:** Go to **Reports** and click **Export Expenses CSV** to show the live file download.
6. **Toggle Theme:** Show the interactive Dark Mode and Light Mode switcher in the top navigation bar.

---

## 📄 License
This project was developed for academic capstone purposes. Open for academic review and enhancement.
