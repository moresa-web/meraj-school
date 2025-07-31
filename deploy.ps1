# Deployment Script for Meraj School Project
# Run this script on Windows Server

param(
    [string]$Environment = "production",
    [switch]$BuildOnly,
    [switch]$StartOnly
)

Write-Host "🚀 Starting deployment for Meraj School Project..." -ForegroundColor Green

# Set error action preference
$ErrorActionPreference = "Stop"

# Create logs directory if it doesn't exist
if (!(Test-Path "logs")) {
    New-Item -ItemType Directory -Path "logs" -Force
    Write-Host "✅ Created logs directory" -ForegroundColor Green
}

# Create uploads directory if it doesn't exist
if (!(Test-Path "Api.EndPoint/uploads")) {
    New-Item -ItemType Directory -Path "Api.EndPoint/uploads" -Force
    Write-Host "✅ Created uploads directory" -ForegroundColor Green
}

# Function to check if PM2 is installed
function Test-PM2 {
    try {
        pm2 --version | Out-Null
        return $true
    }
    catch {
        return $false
    }
}

# Check if PM2 is installed
if (!(Test-PM2)) {
    Write-Host "❌ PM2 is not installed. Installing PM2..." -ForegroundColor Red
    npm install -g pm2
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install PM2" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ PM2 installed successfully" -ForegroundColor Green
}

# Function to build API
function Build-API {
    Write-Host "🔨 Building API..." -ForegroundColor Yellow
    Set-Location "Api.EndPoint"
    
    # Install dependencies
    Write-Host "📦 Installing API dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install API dependencies" -ForegroundColor Red
        exit 1
    }
    
    # Build API
    Write-Host "🔨 Building API..." -ForegroundColor Yellow
    npm run build:prod
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to build API" -ForegroundColor Red
        exit 1
    }
    
    Set-Location ".."
    Write-Host "✅ API built successfully" -ForegroundColor Green
}

# Function to build Admin Panel
function Build-Admin {
    Write-Host "🔨 Building Admin Panel..." -ForegroundColor Yellow
    Set-Location "admin-endpoint"
    
    # Install dependencies
    Write-Host "📦 Installing Admin Panel dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install Admin Panel dependencies" -ForegroundColor Red
        exit 1
    }
    
    # Build Admin Panel
    Write-Host "🔨 Building Admin Panel..." -ForegroundColor Yellow
    npm run build:prod
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to build Admin Panel" -ForegroundColor Red
        exit 1
    }
    
    Set-Location ".."
    Write-Host "✅ Admin Panel built successfully" -ForegroundColor Green
}

# Function to build Main Site
function Build-Site {
    Write-Host "🔨 Building Main Site..." -ForegroundColor Yellow
    Set-Location "Site.EndPoint"
    
    # Install dependencies
    Write-Host "📦 Installing Main Site dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install Main Site dependencies" -ForegroundColor Red
        exit 1
    }
    
    # Build Main Site
    Write-Host "🔨 Building Main Site..." -ForegroundColor Yellow
    npm run build:prod
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to build Main Site" -ForegroundColor Red
        exit 1
    }
    
    Set-Location ".."
    Write-Host "✅ Main Site built successfully" -ForegroundColor Green
}

# Function to start services with PM2
function Start-Services {
    Write-Host "🚀 Starting services with PM2..." -ForegroundColor Yellow
    
    # Stop existing processes
    Write-Host "🛑 Stopping existing processes..." -ForegroundColor Yellow
    pm2 stop all 2>$null
    pm2 delete all 2>$null
    
    # Start API
    Write-Host "🚀 Starting API..." -ForegroundColor Yellow
    pm2 start ecosystem.config.js --only meraj-api
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to start API" -ForegroundColor Red
        exit 1
    }
    
    # Start Admin Panel
    Write-Host "🚀 Starting Admin Panel..." -ForegroundColor Yellow
    pm2 start ecosystem.config.js --only meraj-admin
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to start Admin Panel" -ForegroundColor Red
        exit 1
    }
    
    # Save PM2 configuration
    pm2 save
    pm2 startup
    
    Write-Host "✅ All services started successfully" -ForegroundColor Green
}

# Function to show status
function Show-Status {
    Write-Host "📊 Service Status:" -ForegroundColor Cyan
    pm2 status
    Write-Host ""
    Write-Host "📋 Logs:" -ForegroundColor Cyan
    Write-Host "API Logs: pm2 logs meraj-api" -ForegroundColor Gray
    Write-Host "Admin Logs: pm2 logs meraj-admin" -ForegroundColor Gray
    Write-Host "Monitor: pm2 monit" -ForegroundColor Gray
}

# Main deployment logic
try {
    if ($BuildOnly) {
        Write-Host "🔨 Build only mode..." -ForegroundColor Yellow
        Build-API
        Build-Admin
        Build-Site
        Write-Host "✅ All builds completed successfully" -ForegroundColor Green
    }
    elseif ($StartOnly) {
        Write-Host "🚀 Start only mode..." -ForegroundColor Yellow
        Start-Services
        Show-Status
    }
    else {
        Write-Host "🔄 Full deployment mode..." -ForegroundColor Yellow
        Build-API
        Build-Admin
        Build-Site
        Start-Services
        Show-Status
    }
}
catch {
    Write-Host "❌ Deployment failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "🎉 Deployment completed successfully!" -ForegroundColor Green 