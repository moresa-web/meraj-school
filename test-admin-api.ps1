# Test script for admin endpoint authentication and classes API

# Step 1: Login to get token and cookie
$loginBody = @{
    email = 'info@moresa-web.ir'
    password = 'Admin@123'
} | ConvertTo-Json

Write-Host "Step 1: Logging in..." -ForegroundColor Green
$loginResponse = Invoke-WebRequest -Uri "http://localhost:3004/api/auth/login" -Method POST -Body $loginBody -ContentType "application/json"

Write-Host "Login response status: $($loginResponse.StatusCode)" -ForegroundColor Yellow
Write-Host "Login response content: $($loginResponse.Content)" -ForegroundColor Yellow

# Extract cookies from login response
$cookies = $loginResponse.Headers['Set-Cookie']
Write-Host "Cookies received: $cookies" -ForegroundColor Cyan

# Step 2: Test classes API with cookies
Write-Host "`nStep 2: Testing classes API..." -ForegroundColor Green

# Create a new session with cookies
$session = New-Object Microsoft.PowerShell.Commands.WebRequestSession

# Parse and add cookies
if ($cookies) {
    foreach ($cookie in $cookies) {
        if ($cookie -match 'auth_token=([^;]+)') {
            $tokenValue = $matches[1]
            $session.Cookies.Add((New-Object System.Net.Cookie("auth_token", $tokenValue, "/", "localhost")))
            Write-Host "Added auth_token cookie: $tokenValue" -ForegroundColor Cyan
        }
    }
}

# Test classes API
try {
    $classesResponse = Invoke-WebRequest -Uri "http://localhost:3004/api/classes" -Method GET -WebSession $session
    Write-Host "Classes API response status: $($classesResponse.StatusCode)" -ForegroundColor Yellow
    Write-Host "Classes API response content: $($classesResponse.Content)" -ForegroundColor Yellow
} catch {
    Write-Host "Classes API error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Error response: $($_.Exception.Response)" -ForegroundColor Red
} 