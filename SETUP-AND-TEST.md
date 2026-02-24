# VelocityAI - Complete Setup and Testing Guide

## 🚨 Current Status

**✅ FULLY DEVELOPED:**
- ✅ All 6 features implemented (Infrastructure, Layout, Home, Services, FAQ, Contact)
- ✅ Backend builds successfully
- ✅ Frontend builds successfully
- ✅ All code complete and ready

**⏸️ BLOCKED: MySQL Not Installed**
- Neither Docker, local MySQL, nor Railway are currently set up
- Database configuration is the ONLY remaining requirement

---

## 🎯 Quick Start (3 Options)

### Option A: Railway MySQL (Recommended - 5 minutes)

**Fastest cloud setup - No local installation required**

1. **Create Railway Account**
   ```
   Visit: https://railway.app
   Sign up with GitHub (free tier available)
   ```

2. **Provision MySQL**
   ```
   - Click "New Project"
   - Select "Provision MySQL"
   - Wait 30 seconds for provisioning
   ```

3. **Get Connection Details**
   ```
   - Click on MySQL service
   - Go to "Variables" tab
   - Copy these values:
     * MYSQL_HOST
     * MYSQL_PORT (usually 3306)
     * MYSQL_DATABASE (usually "railway")
     * MYSQL_USER
     * MYSQL_PASSWORD
   ```

4. **Update Configuration**
   Edit: `backend/VelocityAI.Api/appsettings.Development.json`
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Server=YOUR_HOST;Port=YOUR_PORT;Database=railway;User=YOUR_USER;Password=YOUR_PASSWORD;"
     }
   }
   ```

5. **Apply Migrations**
   ```bash
   cd backend/VelocityAI.Api
   dotnet ef database update
   ```

   **Expected Output:**
   ```
   Build succeeded.
   Applying migration '20260219122341_InitialCreate'.
   Done.
   ```

6. **Verify Seed Data**
   ```bash
   # Railway provides a database GUI - click "Data" tab
   # Or use Railway CLI:
   railway connect mysql
   SELECT COUNT(*) FROM Services;  -- Should return 8
   SELECT COUNT(*) FROM Faqs;      -- Should return 6
   ```

---

### Option B: Local MySQL (15 minutes)

**Traditional local database setup**

1. **Download MySQL**
   - Windows: https://dev.mysql.com/downloads/installer/
   - Select "MySQL Installer for Windows"
   - Download "mysql-installer-community-8.x.x.msi"

2. **Install MySQL**
   - Run installer
   - Choose "Developer Default" or "Server only"
   - Set root password (remember this!)
   - Complete installation

3. **Create Database**
   ```bash
   mysql -u root -p
   # Enter your root password
   CREATE DATABASE velocityai_dev;
   exit;
   ```

4. **Update Configuration**
   Edit: `backend/VelocityAI.Api/appsettings.Development.json`
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Server=localhost;Port=3306;Database=velocityai_dev;User=root;Password=YOUR_ROOT_PASSWORD;"
     }
   }
   ```

5. **Apply Migrations**
   ```bash
   cd backend/VelocityAI.Api
   dotnet ef database update
   ```

---

### Option C: Docker MySQL (5 minutes, requires Docker Desktop)

**Containerized database - isolated from system**

1. **Install Docker Desktop**
   ```
   Download from: https://www.docker.com/products/docker-desktop
   Install and start Docker Desktop
   ```

2. **Start MySQL Container**
   ```bash
   docker run --name velocityai-mysql \
     -e MYSQL_ROOT_PASSWORD=dev_password \
     -e MYSQL_DATABASE=velocityai_dev \
     -p 3306:3306 \
     -d mysql:8.0
   ```

3. **Verify Container Running**
   ```bash
   docker ps
   # Should show velocityai-mysql container
   ```

4. **Configuration Already Set**
   The default `appsettings.Development.json` is configured for:
   - Server: localhost
   - Port: 3306
   - Database: velocityai_dev
   - User: root
   - Password: your_password (change to "dev_password")

5. **Apply Migrations**
   ```bash
   cd backend/VelocityAI.Api
   dotnet ef database update
   ```

**Docker Commands:**
```bash
# Stop MySQL
docker stop velocityai-mysql

# Start MySQL
docker start velocityai-mysql

# View logs
docker logs velocityai-mysql

# Remove container
docker rm -f velocityai-mysql
```

---

## 📧 Email Configuration

### Option 1: Gmail (Easiest for Testing)

1. **Enable 2-Factor Authentication**
   - Go to: https://myaccount.google.com/security
   - Enable "2-Step Verification"

2. **Generate App Password**
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Name it "VelocityAI Dev"
   - Copy the 16-character password

3. **Update Configuration**
   Edit: `backend/VelocityAI.Api/appsettings.Development.json`
   ```json
   {
     "Mail": {
       "Host": "smtp.gmail.com",
       "Port": 587,
       "Username": "your-email@gmail.com",
       "Password": "your-16-char-app-password",
       "From": "noreply@velocityai.com",
       "FromName": "VelocityAI",
       "ToOwner": "your-email@gmail.com",
       "EnableSsl": true
     }
   }
   ```

### Option 2: Mailtrap (Testing Only - Catches All Emails)

1. **Create Account**: https://mailtrap.io
2. **Get SMTP Credentials** from inbox settings
3. **Update Configuration**:
   ```json
   {
     "Mail": {
       "Host": "sandbox.smtp.mailtrap.io",
       "Port": 2525,
       "Username": "your-mailtrap-username",
       "Password": "your-mailtrap-password",
       "From": "noreply@velocityai.com",
       "FromName": "VelocityAI",
       "ToOwner": "admin@velocityai.com",
       "EnableSsl": true
     }
   }
   ```

### Option 3: Skip Email Testing (Disable Temporarily)

If you want to test without email:
- Emails will fail silently (logged as warnings)
- Contact form will still save to database
- No emails will be sent

---

## 🧪 Complete Testing Procedure

### Step 1: Apply Migrations (After MySQL Setup)

```bash
cd backend/VelocityAI.Api
dotnet ef database update
```

**Expected Output:**
```
Build succeeded.
info: Microsoft.EntityFrameworkCore.Database.Command[20101]
      Applying migration '20260219122341_InitialCreate'.
Done.
```

**Verify Tables Created:**
```sql
-- Connect to your MySQL database
SHOW TABLES;
```

**Expected Tables:**
- Contacts
- Faqs
- NewsletterSubscribers
- Services
- __EFMigrationsHistory

**Verify Seed Data:**
```sql
SELECT COUNT(*) FROM Services;  -- Should return 8
SELECT COUNT(*) FROM Faqs;      -- Should return 6
```

---

### Step 2: Start Backend

```bash
cd backend/VelocityAI.Api
dotnet run
```

**Expected Output:**
```
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: https://localhost:5001
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: http://localhost:5000
```

**Leave this terminal running**

---

### Step 3: Test Backend APIs

Open a new terminal:

```bash
# Test Services API
curl http://localhost:5000/api/services

# Expected: JSON with 8 services
```

```bash
# Test FAQ API
curl http://localhost:5000/api/faqs

# Expected: JSON with 6 FAQs
```

```bash
# Test Contact API (POST)
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "message": "This is a test message for the contact form.",
    "serviceInterest": "Not sure yet"
  }'

# Expected: 201 Created with contact data
```

---

### Step 4: Start Frontend

Open a new terminal:

```bash
cd frontend
npm start
```

**Expected Output:**
```
✔ Browser application bundle generation complete.
Local:   http://localhost:4200/
```

**Navigate to:** http://localhost:4200

---

### Step 5: Test Frontend Integration

#### Test 1: Home Page (/)
- ✅ Hero section displays
- ✅ Stats counter animates on scroll
- ✅ Process section displays
- ✅ Industries section displays

#### Test 2: Services Page (/services)
- ✅ 8 service cards display
- ✅ Hover reveals long description
- ✅ Data loaded from API (check browser console for HTTP request)

#### Test 3: FAQ Page (/faq)
- ✅ 6 FAQ items display
- ✅ Click to expand/collapse works
- ✅ Data loaded from API

#### Test 4: Pricing Page (/pricing)
- ✅ 3 pricing tiers display
- ✅ Featured card highlighted
- ✅ CTA buttons link to contact

#### Test 5: Contact Page (/contact) - **Full Test**

1. **Navigate to /contact**

2. **Test Validation**
   - Try submitting empty form → Errors display
   - Enter name "A" → "Name must be at least 2 characters"
   - Enter invalid email → "Please enter a valid email address"
   - Enter message "Short" → "Message must be at least 10 characters"

3. **Test Successful Submission**
   ```
   Name: John Doe
   Email: john@example.com
   Company: Acme Corp
   Phone: +1 555-123-4567
   Message: I'm interested in learning more about your AI automation services.
   Service Interest: AI Voice Agent — Inbound Support
   ```

   **Expected Result:**
   - ✅ Success message appears
   - ✅ Form resets
   - ✅ Success message disappears after 5 seconds

4. **Verify in Database**
   ```sql
   SELECT * FROM Contacts ORDER BY Id DESC LIMIT 1;
   ```

5. **Verify Emails Sent**
   - Check recipient inbox (or Mailtrap)
   - Confirmation email to john@example.com
   - Notification email to owner

6. **Test Spam Prevention**
   - Open browser console (F12)
   - Run: `document.querySelector('input[formControlName="honeypot"]').value = 'bot';`
   - Submit form
   - Expected: "Invalid submission detected" error

---

## 🎯 API Documentation

Once backend is running, visit:
- **Swagger UI**: http://localhost:5000/swagger
- **Swagger JSON**: http://localhost:5000/swagger/v1/swagger.json

**Available Endpoints:**
- `GET /api/services` - List all services
- `GET /api/faqs` - List all FAQs
- `POST /api/contact` - Submit contact form

---

## 🐛 Troubleshooting

### Backend won't start - MySQL connection error

**Error:** `Unable to connect to any of the specified MySQL hosts`

**Solution:**
1. Verify MySQL is running
2. Check connection string in appsettings.Development.json
3. Test connection: `mysql -h HOST -P PORT -u USER -p`

---

### Migration fails - Table already exists

**Error:** `Table 'Services' already exists`

**Solution:**
```bash
# Drop database and recreate
mysql -u root -p
DROP DATABASE velocityai_dev;
CREATE DATABASE velocityai_dev;
exit;

# Reapply migrations
dotnet ef database update
```

---

### Email fails - Authentication error

**Error:** `Authentication failed`

**Solution:**
1. Verify Gmail App Password is correct (not regular password)
2. Check username is full email address
3. Ensure 2FA is enabled on Gmail account
4. Try Mailtrap for testing instead

---

### Frontend API calls fail - CORS error

**Error:** `Access to XMLHttpRequest blocked by CORS policy`

**Solution:**
1. Verify backend is running on port 5000/5001
2. Check proxy.conf.json in frontend folder
3. Restart both frontend and backend

---

### Contact form submission fails

**Error:** `Validation failed`

**Check:**
1. Name: minimum 2 characters
2. Email: valid format
3. Message: minimum 10 characters
4. Service Interest: selected from dropdown
5. Honeypot: must be empty (don't touch it!)

---

## 📊 Success Checklist

- [ ] MySQL installed and running
- [ ] Migrations applied successfully
- [ ] 8 services seeded in database
- [ ] 6 FAQs seeded in database
- [ ] Backend running on https://localhost:5001
- [ ] Frontend running on http://localhost:4200
- [ ] GET /api/services returns 8 items
- [ ] GET /api/faqs returns 6 items
- [ ] Services page displays data
- [ ] FAQ page displays data
- [ ] Contact form submits successfully
- [ ] Contact record saved to database
- [ ] Confirmation email received
- [ ] Notification email received
- [ ] All 6 features fully functional

---

## 🚀 Production Deployment

Once everything works locally:

1. **Backend → Railway**
   - Push code to GitHub
   - Connect Railway to repo
   - Add environment variables (connection string, mail config)
   - Deploy automatically

2. **Frontend → Vercel**
   - Push code to GitHub
   - Connect Vercel to repo
   - Set environment variable: `API_URL=https://your-railway-api.railway.app`
   - Deploy automatically

3. **Database → Railway MySQL**
   - Already provisioned with backend
   - Run migrations: `railway run dotnet ef database update`

---

## 📝 Summary

**What's Complete:**
- ✅ Full-stack application developed
- ✅ 6 features implemented
- ✅ Backend API (Services, FAQ, Contact)
- ✅ Frontend UI (Angular 19)
- ✅ Email notifications (MailKit)
- ✅ Form validation (frontend + backend)
- ✅ Spam prevention (honeypot)
- ✅ Database schema with EF Core
- ✅ Seed data (8 services, 6 FAQs)

**What's Needed:**
- ⏸️ MySQL database setup (choose option A, B, or C above)
- ⏸️ Email configuration (optional for testing)

**Time to Full Functionality:** 5-15 minutes (depending on MySQL option chosen)

---

For support or questions, refer to the [MYSQL_SETUP_GUIDE.md](MYSQL_SETUP_GUIDE.md) for detailed MySQL setup instructions.
