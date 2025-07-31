# 🚀 Deployment Guide for Meraj School Project

## 📋 Overview

This guide explains how to deploy the Meraj School project on a Windows server using PM2 for process management.

## 🌐 Domain Configuration

- **Main Site**: https://merajfutureschool.ir
- **API**: https://api.merajfutureschool.ir
- **Admin Panel**: https://admin.merajfutureschool.ir

## 📦 Prerequisites

### Server Requirements
- Windows Server 2019 or later
- Node.js 18+ 
- MongoDB 6+
- PM2 (will be installed automatically)
- Nginx (for reverse proxy)

### Software Installation
```powershell
# Install Node.js (if not already installed)
# Download from: https://nodejs.org/

# Install MongoDB (if not already installed)
# Download from: https://www.mongodb.com/try/download/community

# Install PM2 globally
npm install -g pm2
```

## 🔧 Configuration

### 1. Environment Variables

#### API Configuration (`Api.EndPoint/env.production`)
```bash
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://localhost:27017/meraj-school-prod
JWT_SECRET=your-super-secret-jwt-key-for-production
EMAIL_USER=info@merajfutureschool.ir
EMAIL_PASS=your-email-password
CORS_ORIGIN=https://merajfutureschool.ir,https://admin.merajfutureschool.ir
API_URL=https://api.merajfutureschool.ir
```

#### Admin Panel Configuration (`admin-endpoint/env.production`)
```bash
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://api.merajfutureschool.ir
NEXT_PUBLIC_SITE_URL=https://merajfutureschool.ir
NEXT_PUBLIC_ADMIN_URL=https://admin.merajfutureschool.ir
JWT_SECRET=your-super-secret-jwt-key-for-production
NEXTAUTH_SECRET=your-nextauth-secret-key
```

#### Main Site Configuration (`Site.EndPoint/env.production`)
```bash
VITE_NODE_ENV=production
VITE_API_URL=https://api.merajfutureschool.ir
VITE_SITE_URL=https://merajfutureschool.ir
VITE_ADMIN_URL=https://admin.merajfutureschool.ir
```

### 2. SSL Certificates

Obtain SSL certificates for your domains and update the nginx configuration:
- `merajfutureschool.ir`
- `api.merajfutureschool.ir`
- `admin.merajfutureschool.ir`

### 3. Database Setup

```bash
# Connect to MongoDB
mongosh

# Create production database
use meraj-school-prod

# Create admin user (optional)
db.createUser({
  user: "admin",
  pwd: "your-password",
  roles: ["readWrite", "dbAdmin"]
})
```

## 🚀 Deployment Steps

### 1. Initial Setup

```powershell
# Clone the repository
git clone <your-repo-url>
cd meraj-school

# Install dependencies for all projects
npm install
cd Api.EndPoint && npm install && cd ..
cd admin-endpoint && npm install && cd ..
cd Site.EndPoint && npm install && cd ..
```

### 2. Build Projects

```powershell
# Build API
cd Api.EndPoint
npm run build:prod
cd ..

# Build Admin Panel
cd admin-endpoint
npm run build:prod
cd ..

# Build Main Site
cd Site.EndPoint
npm run build:prod
cd ..
```

### 3. Start Services with PM2

```powershell
# Start all services
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save
pm2 startup
```

### 4. Configure Nginx

1. Copy `nginx.conf` to `/etc/nginx/sites-available/meraj-school`
2. Update SSL certificate paths in the configuration
3. Create symlink:
   ```bash
   ln -s /etc/nginx/sites-available/meraj-school /etc/nginx/sites-enabled/
   ```
4. Test configuration:
   ```bash
   nginx -t
   ```
5. Reload nginx:
   ```bash
   systemctl reload nginx
   ```

## 📊 Monitoring

### PM2 Commands
```powershell
# View status
pm2 status

# View logs
pm2 logs meraj-api
pm2 logs meraj-admin

# Monitor resources
pm2 monit

# Restart services
pm2 restart meraj-api
pm2 restart meraj-admin

# Reload services (zero-downtime)
pm2 reload meraj-api
pm2 reload meraj-admin
```

### Log Files
- API Logs: `logs/api-combined.log`
- Admin Logs: `logs/admin-combined.log`
- Error Logs: `logs/api-error.log`, `logs/admin-error.log`

## 🔄 Deployment Script

Use the provided PowerShell script for automated deployment:

```powershell
# Full deployment
.\deploy.ps1

# Build only
.\deploy.ps1 -BuildOnly

# Start only
.\deploy.ps1 -StartOnly
```

## 🛠️ Maintenance

### Database Backup
```bash
# Create backup
mongodump --db meraj-school-prod --out /backup/$(date +%Y%m%d)

# Restore backup
mongorestore --db meraj-school-prod /backup/20240101/meraj-school-prod/
```

### File Uploads Backup
```bash
# Backup uploads directory
tar -czf uploads-backup-$(date +%Y%m%d).tar.gz Api.EndPoint/uploads/
```

### Update Deployment
```powershell
# Pull latest changes
git pull origin main

# Rebuild and restart
.\deploy.ps1
```

## 🔒 Security Considerations

1. **Environment Variables**: Never commit sensitive data to version control
2. **SSL Certificates**: Use valid SSL certificates for all domains
3. **Firewall**: Configure Windows Firewall to allow only necessary ports
4. **Database Security**: Use strong passwords and limit database access
5. **PM2 Security**: Use PM2's built-in security features

## 🚨 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```powershell
   # Check what's using the port
   netstat -ano | findstr :5000
   
   # Kill the process
   taskkill /PID <process-id> /F
   ```

2. **PM2 Process Not Starting**
   ```powershell
   # Check PM2 logs
   pm2 logs
   
   # Restart PM2 daemon
   pm2 kill
   pm2 start ecosystem.config.js
   ```

3. **Nginx Configuration Error**
   ```bash
   # Test nginx configuration
   nginx -t
   
   # Check nginx error logs
   tail -f /var/log/nginx/error.log
   ```

4. **Database Connection Issues**
   ```bash
   # Check MongoDB status
   systemctl status mongod
   
   # Check MongoDB logs
   tail -f /var/log/mongodb/mongod.log
   ```

## 📞 Support

For deployment issues:
1. Check the logs: `pm2 logs`
2. Verify environment variables
3. Test database connectivity
4. Check nginx configuration
5. Verify SSL certificates

## 📝 Notes

- Always backup before major updates
- Test in staging environment first
- Monitor server resources regularly
- Keep dependencies updated
- Document any custom configurations 