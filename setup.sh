#!/bin/bash
# ============================================
# LuxeWear — Automated Setup Script
# ============================================

set -e
GREEN='\033[0;32m'
GOLD='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GOLD}"
echo "  ██╗     ██╗   ██╗██╗  ██╗███████╗██╗    ██╗███████╗ █████╗ ██████╗ "
echo "  ██║     ██║   ██║╚██╗██╔╝██╔════╝██║    ██║██╔════╝██╔══██╗██╔══██╗"
echo "  ██║     ██║   ██║ ╚███╔╝ █████╗  ██║ █╗ ██║█████╗  ███████║██████╔╝"
echo "  ██║     ██║   ██║ ██╔██╗ ██╔══╝  ██║███╗██║██╔══╝  ██╔══██║██╔══██╗"
echo "  ███████╗╚██████╔╝██╔╝ ██╗███████╗╚███╔███╔╝███████╗██║  ██║██║  ██║"
echo "  ╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝ ╚══╝╚══╝ ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝"
echo -e "${NC}"
echo -e "${GOLD}  Premium Fashion E-Commerce Platform${NC}"
echo ""

# --- Check Node.js ---
if ! command -v node &> /dev/null; then
  echo -e "${RED}❌ Node.js not found. Please install Node.js >= 18${NC}"
  exit 1
fi
NODE_VER=$(node -v)
echo -e "${GREEN}✅ Node.js: $NODE_VER${NC}"

# --- Check MySQL ---
if ! command -v mysql &> /dev/null; then
  echo -e "${RED}❌ MySQL not found. Please install MySQL >= 8.0${NC}"
  exit 1
fi
echo -e "${GREEN}✅ MySQL found${NC}"

# --- Ask for DB credentials ---
echo ""
echo -e "${GOLD}🗄️  Database Configuration${NC}"
read -p "MySQL username [root]: " DB_USER
DB_USER=${DB_USER:-root}
read -s -p "MySQL password: " DB_PASS
echo ""
read -p "Database name [luxe_wear_db]: " DB_NAME
DB_NAME=${DB_NAME:-luxe_wear_db}

# --- Run Schema ---
echo -e "\n${GOLD}📊 Setting up database...${NC}"
mysql -u "$DB_USER" -p"$DB_PASS" < backend/config/schema.sql
echo -e "${GREEN}✅ Database created and seeded${NC}"

# --- Backend .env ---
echo -e "\n${GOLD}⚙️  Configuring backend...${NC}"
read -p "JWT Secret [auto-generate]: " JWT_SEC
if [ -z "$JWT_SEC" ]; then
  JWT_SEC=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
fi
read -p "Razorpay Key ID [rzp_test_xxx]: " RZP_KEY
read -p "Razorpay Secret [leave blank for now]: " RZP_SEC

cat > backend/.env << ENV
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASS
DB_NAME=$DB_NAME

JWT_SECRET=$JWT_SEC
JWT_EXPIRES_IN=7d

RAZORPAY_KEY_ID=${RZP_KEY:-rzp_test_your_key_id}
RAZORPAY_KEY_SECRET=${RZP_SEC:-your_razorpay_secret}

CLIENT_URL=http://localhost:3000
ENV
echo -e "${GREEN}✅ Backend .env created${NC}"

# --- Frontend .env ---
cat > frontend/.env << ENV
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_RAZORPAY_KEY_ID=${RZP_KEY:-rzp_test_your_key_id}
ENV
echo -e "${GREEN}✅ Frontend .env created${NC}"

# --- Install backend deps ---
echo -e "\n${GOLD}📦 Installing backend dependencies...${NC}"
cd backend && npm install
echo -e "${GREEN}✅ Backend dependencies installed${NC}"
cd ..

# --- Install frontend deps ---
echo -e "\n${GOLD}📦 Installing frontend dependencies...${NC}"
cd frontend && npm install

# Setup Tailwind if needed
if ! [ -f "tailwind.config.js" ]; then
  npm install -D tailwindcss postcss autoprefixer
  npx tailwindcss init -p
fi

# Add Tailwind directives to index.css if not using globals.css import
echo -e "${GREEN}✅ Frontend dependencies installed${NC}"
cd ..

echo ""
echo -e "${GOLD}╔═══════════════════════════════════════════╗${NC}"
echo -e "${GOLD}║         ✅ SETUP COMPLETE!                ║${NC}"
echo -e "${GOLD}╚═══════════════════════════════════════════╝${NC}"
echo ""
echo -e "  ${GREEN}Start backend:${NC}  cd backend && npm run dev"
echo -e "  ${GREEN}Start frontend:${NC} cd frontend && npm start"
echo ""
echo -e "  ${GOLD}Admin Login:${NC} admin@luxewear.com / Admin@123"
echo -e "  ${GOLD}User Login:${NC}  john@example.com / Admin@123"
echo ""
