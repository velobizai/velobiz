# MySQL Setup Guide for Velobiz

## Current Status
- ✅ EF Core migrations created (`InitialCreate` migration exists)
- ✅ Backend build successful
- ❌ MySQL database not configured (no local MySQL or Railway connection)

## Quick Start Options

### Option A: Railway (Recommended - No Installation Required)

**Why Railway?**
- Free tier available
- Managed MySQL 8.x
- No local installation needed
- Automatic backups
- Easy scaling to production

**Setup Steps:**
1. Go to https://railway.app and create a free account
2. Click "New Project" → "Provision MySQL"
3. Click on the MySQL service → "Variables" tab
4. Copy the connection details:
   ```
   MYSQL_HOST: [copy this]
   MYSQL_PORT: [copy this]
   MYSQL_DATABASE: railway
   MYSQL_USER: [copy this]
   MYSQL_PASSWORD: [copy this]
   ```

5. Update `backend/Velobiz.Api/appsettings.Development.json`:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Server=YOUR_HOST;Port=YOUR_PORT;Database=railway;User=YOUR_USER;Password=YOUR_PASSWORD;"
     }
   }
   ```

6. Apply migrations:
   ```bash
   cd backend/Velobiz.Api
   dotnet ef database update
   ```

### Option B: Local MySQL Installation

**Requirements:**
- MySQL Community Server 8.x
- At least 2GB free disk space

**Setup Steps:**
1. Download MySQL Community Server:
   - Windows: https://dev.mysql.com/downloads/installer/
   - macOS: `brew install mysql` or download DMG
   - Linux: `sudo apt-get install mysql-server` (Ubuntu/Debian)

2. During installation:
   - Set root password (remember this!)
   - Use port 3306 (default)
   - Start MySQL as a service

3. Verify MySQL is running:
   ```bash
   mysql --version
   # Should show: mysql Ver 8.x.x
   ```

4. Create the database:
   ```bash
   mysql -u root -p
   # Enter your password, then:
   CREATE DATABASE velocityai_dev;
   exit;
   ```

5. Update `backend/Velobiz.Api/appsettings.Development.json`:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Server=localhost;Port=3306;Database=velocityai_dev;User=root;Password=YOUR_ACTUAL_PASSWORD;"
     }
   }
   ```

6. Apply migrations:
   ```bash
   cd backend/Velobiz.Api
   dotnet ef database update
   ```

### Option C: Docker MySQL (Fastest for Development)

If you have Docker installed:

```bash
# Start MySQL in Docker
docker run --name velocityai-mysql \
  -e MYSQL_ROOT_PASSWORD=dev_password \
  -e MYSQL_DATABASE=velocityai_dev \
  -p 3306:3306 \
  -d mysql:8.0

# Update connection string in appsettings.Development.json:
# Server=localhost;Port=3306;Database=velocityai_dev;User=root;Password=dev_password;

# Apply migrations
cd backend/Velobiz.Api
dotnet ef database update
```

## Verifying the Setup

After applying migrations, verify seed data:

```bash
# Check if migrations were applied
dotnet ef migrations list
# Should show: 20260219122341_InitialCreate (Applied)

# Or connect to MySQL and check:
mysql -u root -p velocityai_dev
# Then run:
SHOW TABLES;
# Should show: Services, Faqs, Contacts, NewsletterSubscribers

SELECT COUNT(*) FROM Services;
# Should return: 8 (AI Voice Agent Inbound, Outbound, Email, etc.)

SELECT COUNT(*) FROM Faqs;
# Should return: 6 (FAQ questions)
```

## Testing the API

Once migrations are applied:

```bash
# Start the API
cd backend/Velobiz.Api
dotnet run

# In another terminal, test endpoints:
curl http://localhost:5000/api/services
curl http://localhost:5000/api/faqs
```

Expected response format:
```json
{
  "success": true,
  "data": [...],
  "message": "Services retrieved successfully"
}
```

## Troubleshooting

**Error: "Unable to connect to any of the specified MySQL hosts"**
- Check if MySQL is running: `sc query MySQL80` (Windows) or `systemctl status mysql` (Linux)
- Verify connection string host/port/password
- Check firewall isn't blocking port 3306

**Error: "Access denied for user 'root'@'localhost'"**
- Verify password in connection string matches MySQL root password
- Try resetting MySQL root password

**Error: "Unknown database 'velocityai_dev'"**
- Create the database manually: `CREATE DATABASE velocityai_dev;`
- Or let EF Core create it automatically (if server permissions allow)

## Next Steps

Once MySQL is configured and migrations are applied:

1. ✅ Verify seed data (8 services, 6 FAQs)
2. ✅ Test API endpoints
3. ✅ Start frontend and test integration
4. ✅ Move to Feature 4 (Pricing) or Feature 6 (Contact)

## Railway Production Setup

For production deployment on Railway:

1. Create Railway project with MySQL
2. Create `.env.production` or set environment variables:
   ```
   ConnectionStrings__DefaultConnection=Server=...;Port=...;Database=...;User=...;Password=...;
   ```
3. Deploy backend to Railway (automatic migration on startup)
4. Deploy frontend to Vercel with Railway API URL
