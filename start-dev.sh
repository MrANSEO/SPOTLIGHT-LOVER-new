#!/bin/bash

# ==========================================
# SPOTLIGHT LOVER - Script de Démarrage
# ==========================================

set -e

PROJECT_DIR="/home/user/spotlight-lover"
BACKEND_DIR="$PROJECT_DIR/backend"
FRONTEND_DIR="$PROJECT_DIR/frontend"

echo "🚀 Démarrage de Spotlight Lover..."
echo ""

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# ==========================================
# 1. Vérifier Node.js
# ==========================================
echo "📦 Vérification de Node.js..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js n'est pas installé${NC}"
    echo "   Installer avec: sudo apt install nodejs npm"
    exit 1
fi
echo -e "${GREEN}✅ Node.js $(node -v)${NC}"
echo ""

# ==========================================
# 2. Nettoyer les ports
# ==========================================
echo "🧹 Nettoyage des ports 3000 et 5173..."
fuser -k 3000/tcp 2>/dev/null || true
fuser -k 5173/tcp 2>/dev/null || true
sleep 1
echo -e "${GREEN}✅ Ports libérés${NC}"
echo ""

# ==========================================
# 3. Backend
# ==========================================
echo "🔧 Démarrage du Backend..."
cd "$BACKEND_DIR"

# Vérifier node_modules
if [ ! -d "node_modules" ]; then
    echo "   Installation des dépendances..."
    npm install --legacy-peer-deps
fi

# Vérifier .env
if [ ! -f ".env" ]; then
    echo -e "${RED}❌ Fichier .env manquant${NC}"
    exit 1
fi

# Vérifier base de données
if [ ! -f "dev.db" ]; then
    echo "   🗄️  Création de la base de données..."
    npx prisma generate
    npx prisma db push --accept-data-loss
    node seed-admin.js
fi

# Démarrer backend
echo "   Démarrage du serveur NestJS..."
npm run start:dev > /tmp/spotlight-backend.log 2>&1 &
BACKEND_PID=$!
echo $BACKEND_PID > /tmp/spotlight-backend.pid

echo -e "${GREEN}✅ Backend démarré (PID: $BACKEND_PID)${NC}"
echo "   Logs: tail -f /tmp/spotlight-backend.log"
echo ""

# ==========================================
# 4. Attendre le backend
# ==========================================
echo "⏳ Attente du backend (max 30s)..."
for i in {1..30}; do
    if curl -s http://localhost:3000/api/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Backend prêt !${NC}"
        break
    fi
    echo -n "."
    sleep 1
done
echo ""

# Vérifier si le backend est prêt
if ! curl -s http://localhost:3000/api/health > /dev/null 2>&1; then
    echo -e "${RED}❌ Le backend n'a pas démarré correctement${NC}"
    echo "   Voir les logs: tail -f /tmp/spotlight-backend.log"
    exit 1
fi
echo ""

# ==========================================
# 5. Frontend
# ==========================================
echo "🎨 Démarrage du Frontend..."
cd "$FRONTEND_DIR"

# Vérifier node_modules
if [ ! -d "node_modules" ]; then
    echo "   Installation des dépendances..."
    npm install
fi

# Démarrer frontend
echo "   Démarrage du serveur Vite..."
npm run dev > /tmp/spotlight-frontend.log 2>&1 &
FRONTEND_PID=$!
echo $FRONTEND_PID > /tmp/spotlight-frontend.pid

echo -e "${GREEN}✅ Frontend démarré (PID: $FRONTEND_PID)${NC}"
echo "   Logs: tail -f /tmp/spotlight-frontend.log"
echo ""

# ==========================================
# 6. Attendre le frontend
# ==========================================
echo "⏳ Attente du frontend (max 15s)..."
for i in {1..15}; do
    if curl -s http://localhost:5173 > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Frontend prêt !${NC}"
        break
    fi
    echo -n "."
    sleep 1
done
echo ""
echo ""

# ==========================================
# 7. Résumé
# ==========================================
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                   🎉 SPOTLIGHT LOVER                       ║"
echo "║                   Démarré avec succès !                    ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "📍 URLs:"
echo "   🌐 Frontend      : http://localhost:5173"
echo "   🔌 Backend API   : http://localhost:3000/api"
echo "   📚 Swagger Docs  : http://localhost:3000/api/docs"
echo "   ❤️  Health Check : http://localhost:3000/api/health"
echo ""
echo "🔐 Admin Login:"
echo "   📧 Email    : admin@spotlightlover.cm"
echo "   🔑 Password : Admin123!"
echo "   🌐 URL      : http://localhost:5173/login"
echo ""
echo "📊 Gestion:"
echo "   ▶  Logs Backend  : tail -f /tmp/spotlight-backend.log"
echo "   ▶  Logs Frontend : tail -f /tmp/spotlight-frontend.log"
echo "   ⏸  Arrêter       : fuser -k 3000/tcp 5173/tcp"
echo "   🔄 Redémarrer    : ./start-dev.sh"
echo ""
echo "🎯 Dashboard Admin : http://localhost:5173/admin"
echo ""
echo "✨ Bon développement ! 🚀"
echo ""
