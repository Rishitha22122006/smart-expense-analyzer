Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "Starting Smart Expense Analyzer (Backend + Frontend)" -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm run dev"
Start-Sleep -Seconds 3
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

Start-Sleep -Seconds 4
Start-Process "http://localhost:3000"
