@echo off
echo ====================================================
echo Starting Smart Expense Analyzer (Backend + Frontend)
echo ====================================================

start "Smart Expense Backend" cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak >nul
start "Smart Expense Frontend" cmd /k "cd frontend && npm run dev"

timeout /t 4 /nobreak >nul
start http://localhost:3000
