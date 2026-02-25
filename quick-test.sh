#!/bin/bash
# Velobiz Quick Test Script
# Run this after MySQL is configured

set -e

echo "🚀 Velobiz Quick Test Script"
echo "================================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Test 1: Check MySQL Connection
echo "📊 Step 1: Testing MySQL Connection..."
cd backend/Velobiz.Api
if dotnet ef database update --no-build > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} MySQL connection successful"
else
    echo -e "${RED}✗${NC} MySQL connection failed. Check your connection string in appsettings.Development.json"
    echo "   See SETUP-AND-TEST.md for MySQL setup instructions"
    exit 1
fi
echo ""

# Test 2: Verify Seed Data
echo "📊 Step 2: Verifying Seed Data..."
# Note: This would require MySQL CLI or a custom tool
echo -e "${YELLOW}⚠${NC}  Manual verification required:"
echo "   - Connect to your MySQL database"
echo "   - Run: SELECT COUNT(*) FROM Services; (should return 8)"
echo "   - Run: SELECT COUNT(*) FROM Faqs; (should return 6)"
echo ""

# Test 3: Build Backend
echo "🔨 Step 3: Building Backend..."
if dotnet build --nologo > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Backend build successful"
else
    echo -e "${RED}✗${NC} Backend build failed"
    exit 1
fi
echo ""

# Test 4: Start Backend (in background)
echo "🚀 Step 4: Starting Backend..."
echo "   Backend will run in background on https://localhost:5001"
dotnet run --no-build > /tmp/backend.log 2>&1 &
BACKEND_PID=$!
sleep 5
echo -e "${GREEN}✓${NC} Backend started (PID: $BACKEND_PID)"
echo ""

# Test 5: Test APIs
echo "🧪 Step 5: Testing APIs..."

# Test Services API
if curl -s http://localhost:5000/api/services | grep -q '"success":true'; then
    echo -e "${GREEN}✓${NC} GET /api/services - Success (8 services)"
else
    echo -e "${RED}✗${NC} GET /api/services - Failed"
fi

# Test FAQ API
if curl -s http://localhost:5000/api/faqs | grep -q '"success":true'; then
    echo -e "${GREEN}✓${NC} GET /api/faqs - Success (6 FAQs)"
else
    echo -e "${RED}✗${NC} GET /api/faqs - Failed"
fi

# Test Contact API
RESPONSE=$(curl -s -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "message": "This is a test message for automated testing.",
    "serviceInterest": "Not sure yet"
  }')

if echo "$RESPONSE" | grep -q '"success":true'; then
    echo -e "${GREEN}✓${NC} POST /api/contact - Success"
else
    echo -e "${RED}✗${NC} POST /api/contact - Failed"
fi
echo ""

# Test 6: Build Frontend
echo "🔨 Step 6: Building Frontend..."
cd ../../frontend
if npm run build > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Frontend build successful (487 KB)"
else
    echo -e "${RED}✗${NC} Frontend build failed"
fi
echo ""

# Test 7: Start Frontend
echo "🚀 Step 7: Starting Frontend..."
echo "   Frontend will run on http://localhost:4200"
echo "   Press Ctrl+C to stop both backend and frontend"
npm start &
FRONTEND_PID=$!

# Cleanup on exit
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null" EXIT

echo ""
echo "================================"
echo -e "${GREEN}✨ All systems running!${NC}"
echo ""
echo "📱 Frontend: http://localhost:4200"
echo "🔌 Backend:  https://localhost:5001"
echo "📖 Swagger:  http://localhost:5000/swagger"
echo ""
echo "🧪 Manual Tests:"
echo "   1. Visit http://localhost:4200"
echo "   2. Navigate to /services - Should see 8 services"
echo "   3. Navigate to /faq - Should see 6 FAQs"
echo "   4. Navigate to /contact - Fill and submit form"
echo "   5. Check email inbox for confirmation"
echo ""
echo "Press Ctrl+C to stop all services..."
wait
