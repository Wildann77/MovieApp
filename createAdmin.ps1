# PowerShell script to create admin user
Write-Host "🔌 Creating admin user in MongoDB Atlas..." -ForegroundColor Green

# Change to backend directory
Set-Location "backend"

# Run the admin creation script
Write-Host "🚀 Running admin creation script..." -ForegroundColor Yellow
npm run admin-atlas

Write-Host "✅ Admin user creation completed!" -ForegroundColor Green

