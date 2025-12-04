#!/bin/bash

# ==========================================
# SPOTLIGHT LOVER - Script de Démarrage
# ==========================================

echo "🌟 Spotlight Lover - Démarrage..."
echo ""

# Couleurs pour les logs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction pour afficher les erreurs
error() {
  echo -e "${RED}❌ ERREUR: $1${NC}"
  exit 1
}

# Fonction pour afficher les succès
success() {
  echo -e "${GREEN}✅ $1${NC}"
}

# Fonction pour afficher les infos
info() {
  echo -e "${BLUE}ℹ️  $1${NC}"
}

# Fonction pour afficher les warnings
warning() {
  echo -e "${YELLOW}⚠️  $1${NC}"
}

# ==========================================
# 1. VÉRIFICATIONS PRÉALABLES
# ==========================================

info "Vérification des prérequis..."

# Vérifier Node.js
if ! command -v node &> /dev/null; then
  error "Node.js n'est pas installé. Installez Node.js 18+ d'abord."
fi
success "Node.js $(node --version) détecté"

# Vérifier npm
if ! command -v npm &> /dev/null; then
  error "npm n'est pas installé."
fi
success "npm $(npm --version) détecté"

# Vérifier que nous sommes dans le bon dossier
if [ ! -f "package.json" ] && [ ! -d "backend" ] && [ ! -d "frontend" ]; then
  error "Ce script doit être exécuté depuis la racine du projet Spotlight Lover"
fi

echo ""
info "Tous les prérequis sont satisfaits !"
echo ""

# ==========================================
# 2. INSTALLATION DES DÉPENDANCES
# ==========================================

# Backend
if [ ! -d "backend/node_modules" ]; then
  info "Installation des dépendances backend..."
  cd backend && npm install || error "Échec de l'installation des dépendances backend"
  cd ..
  success "Dépendances backend installées"
else
  success "Dépendances backend déjà installées"
fi

# Frontend
if [ ! -d "frontend/node_modules" ]; then
  info "Installation des dépendances frontend..."
  cd frontend && npm install || error "Échec de l'installation des dépendances frontend"
  cd ..
  success "Dépendances frontend installées"
else
  success "Dépendances frontend déjà installées"
fi

echo ""

# ==========================================
# 3. CONFIGURATION ENVIRONNEMENT
# ==========================================

info "Vérification des fichiers .env..."

# Backend .env
if [ ! -f "backend/.env" ]; then
  warning "Fichier backend/.env non trouvé"
  if [ -f "backend/.env.example" ]; then
    info "Copie de .env.example vers .env..."
    cp backend/.env.example backend/.env
    warning "IMPORTANT: Éditez backend/.env avec vos vraies configurations !"
    warning "Notamment: DATABASE_URL, JWT_SECRET, MESOMB_*, CLOUDINARY_*"
    read -p "Appuyez sur Entrée quand c'est fait, ou Ctrl+C pour annuler..."
  else
    error "Fichier backend/.env.example non trouvé"
  fi
else
  success "Fichier backend/.env existe"
fi

# Frontend .env
if [ ! -f "frontend/.env" ]; then
  warning "Fichier frontend/.env non trouvé"
  echo "VITE_API_URL=http://localhost:4000/api" > frontend/.env
  echo "VITE_WS_URL=ws://localhost:4000" >> frontend/.env
  success "Fichier frontend/.env créé avec valeurs par défaut"
else
  success "Fichier frontend/.env existe"
fi

echo ""

# ==========================================
# 4. CONFIGURATION BASE DE DONNÉES
# ==========================================

info "Configuration de la base de données..."

# Vérifier si PostgreSQL est en cours d'exécution
if command -v psql &> /dev/null; then
  info "PostgreSQL détecté"
  
  # Générer le client Prisma
  if [ -d "backend/node_modules/.prisma" ]; then
    success "Client Prisma déjà généré"
  else
    info "Génération du client Prisma..."
    cd backend && npx prisma generate || warning "Échec de la génération du client Prisma"
    cd ..
    success "Client Prisma généré"
  fi
  
  # Exécuter les migrations
  read -p "Voulez-vous exécuter les migrations Prisma ? (y/N) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    info "Exécution des migrations..."
    cd backend && npx prisma migrate deploy || warning "Échec des migrations"
    cd ..
    success "Migrations exécutées"
  else
    warning "Migrations ignorées - Pensez à les exécuter manuellement : cd backend && npx prisma migrate deploy"
  fi
else
  warning "PostgreSQL non détecté. Assurez-vous qu'il est installé et en cours d'exécution."
  warning "Installation PostgreSQL : https://www.postgresql.org/download/"
fi

echo ""

# ==========================================
# 5. BUILD (optionnel pour dev)
# ==========================================

read -p "Voulez-vous builder le frontend avant de démarrer ? (y/N) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  info "Build du frontend..."
  cd frontend && npm run build || warning "Échec du build frontend"
  cd ..
  success "Frontend buildé"
fi

echo ""

# ==========================================
# 6. DÉMARRAGE DES SERVICES
# ==========================================

info "Démarrage des services..."

# Fonction pour tuer les processus sur les ports
kill_port() {
  local port=$1
  local pid=$(lsof -ti:$port)
  if [ ! -z "$pid" ]; then
    warning "Processus trouvé sur le port $port (PID: $pid). Arrêt..."
    kill -9 $pid 2>/dev/null || true
    sleep 1
  fi
}

# Nettoyer les ports si déjà utilisés
kill_port 4000  # Backend
kill_port 5173  # Frontend Vite dev

# Démarrage du backend
info "Démarrage du backend sur http://localhost:4000..."
cd backend
npm run start:dev > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
cd ..
success "Backend démarré (PID: $BACKEND_PID)"

# Attendre que le backend soit prêt
info "Attente du backend (max 30s)..."
for i in {1..30}; do
  if curl -s http://localhost:4000/api/health > /dev/null 2>&1; then
    success "Backend prêt !"
    break
  fi
  if [ $i -eq 30 ]; then
    warning "Le backend met du temps à démarrer. Vérifiez les logs : tail -f logs/backend.log"
  fi
  sleep 1
done

# Démarrage du frontend
info "Démarrage du frontend sur http://localhost:5173..."
cd frontend
npm run dev > ../logs/frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..
success "Frontend démarré (PID: $FRONTEND_PID)"

# Créer le dossier logs si nécessaire
mkdir -p logs

# Attendre que le frontend soit prêt
info "Attente du frontend (max 20s)..."
for i in {1..20}; do
  if curl -s http://localhost:5173 > /dev/null 2>&1; then
    success "Frontend prêt !"
    break
  fi
  if [ $i -eq 20 ]; then
    warning "Le frontend met du temps à démarrer. Vérifiez les logs : tail -f logs/frontend.log"
  fi
  sleep 1
done

echo ""
echo "=========================================="
echo "🎉 Spotlight Lover est démarré !"
echo "=========================================="
echo ""
echo "📍 URLs:"
echo "   Frontend: ${GREEN}http://localhost:5173${NC}"
echo "   Backend:  ${GREEN}http://localhost:4000/api${NC}"
echo "   Swagger:  ${GREEN}http://localhost:4000/api/docs${NC}"
echo ""
echo "📊 Processus:"
echo "   Backend PID:  ${BACKEND_PID}"
echo "   Frontend PID: ${FRONTEND_PID}"
echo ""
echo "📝 Logs:"
echo "   Backend:  ${BLUE}tail -f logs/backend.log${NC}"
echo "   Frontend: ${BLUE}tail -f logs/frontend.log${NC}"
echo ""
echo "🛑 Pour arrêter:"
echo "   ${RED}kill ${BACKEND_PID} ${FRONTEND_PID}${NC}"
echo "   ou appuyez sur Ctrl+C"
echo ""
echo "=========================================="

# Garder le script en vie et surveiller les processus
trap "echo ''; warning 'Arrêt des services...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0" INT TERM

# Attendre que l'utilisateur arrête manuellement
wait
