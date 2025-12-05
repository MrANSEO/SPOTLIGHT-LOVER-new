#!/bin/bash

##############################################################################
# 🚀 SPOTLIGHT LOVER - Script de démarrage automatique
# Ce script démarre le backend (NestJS) et le frontend (React + Vite)
##############################################################################

set -e  # Arrêter en cas d'erreur

# Couleurs pour les logs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonctions utilitaires
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[✓]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[⚠]${NC} $1"
}

log_error() {
    echo -e "${RED}[✗]${NC} $1"
}

# Header
clear
echo "╔════════════════════════════════════════════════════════════════════╗"
echo "║                                                                    ║"
echo "║           🎬 SPOTLIGHT LOVER - Démarrage Automatique              ║"
echo "║                                                                    ║"
echo "╚════════════════════════════════════════════════════════════════════╝"
echo ""

# 1. Vérifier Node.js et npm
log_info "Vérification des prérequis..."
if ! command -v node &> /dev/null; then
    log_error "Node.js n'est pas installé !"
    exit 1
fi
if ! command -v npm &> /dev/null; then
    log_error "npm n'est pas installé !"
    exit 1
fi
log_success "Node.js $(node --version) et npm $(npm --version) détectés"

# 2. Vérifier PostgreSQL
log_info "Vérification de PostgreSQL..."
if ! command -v psql &> /dev/null; then
    log_warning "PostgreSQL CLI non détecté (peut être normal si DB distante)"
else
    log_success "PostgreSQL CLI détecté"
fi

# 3. Installer les dépendances backend (si nécessaire)
log_info "Vérification des dépendances backend..."
cd /home/user/spotlight-lover/backend
if [ ! -d "node_modules" ]; then
    log_info "Installation des dépendances backend (peut prendre quelques minutes)..."
    npm install
    log_success "Dépendances backend installées"
else
    log_success "Dépendances backend OK"
fi

# 4. Vérifier le fichier .env du backend
if [ ! -f ".env" ]; then
    log_warning "Fichier .env manquant dans /backend"
    log_info "Création du fichier .env avec valeurs par défaut..."
    cat > .env << 'EOL'
# Server
NODE_ENV=development
PORT=3000
API_PREFIX=api

# Database (PostgreSQL)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/spotlight_lover?schema=public"

# JWT
JWT_ACCESS_SECRET=super-secret-change-this-in-production
JWT_REFRESH_SECRET=another-super-secret-change-this-too

# Cloudinary (pour upload vidéos)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# MeSomb (Paiements MTN/Orange Money)
MESOMB_API_KEY=your-mesomb-api-key
MESOMB_SECRET_KEY=your-mesomb-secret-key
MESOMB_APPLICATION_KEY=your-mesomb-app-key

# Frontend
FRONTEND_URL=http://localhost:5173
CORS_ORIGINS=http://localhost:5173

# Autres
BCRYPT_ROUNDS=10
EOL
    log_success "Fichier .env créé avec valeurs par défaut"
    log_warning "⚠️  IMPORTANT : Configurez les variables d'environnement dans backend/.env"
fi

# 5. Générer Prisma Client
log_info "Génération du client Prisma..."
npx prisma generate > /dev/null 2>&1 || log_warning "Erreur génération Prisma (peut être ignoré si DB non configurée)"
log_success "Client Prisma OK"

# 6. Vérifier/Créer la base de données
log_info "Vérification de la base de données..."
if npx prisma db push --skip-generate > /dev/null 2>&1; then
    log_success "Base de données synchronisée"
else
    log_warning "Impossible de synchroniser la DB (configurez DATABASE_URL dans .env)"
fi

# 7. Installer les dépendances frontend
log_info "Vérification des dépendances frontend..."
cd /home/user/spotlight-lover/frontend
if [ ! -d "node_modules" ]; then
    log_info "Installation des dépendances frontend..."
    npm install
    log_success "Dépendances frontend installées"
else
    log_success "Dépendances frontend OK"
fi

# 8. Vérifier le fichier .env du frontend
if [ ! -f ".env" ]; then
    log_info "Création du fichier .env frontend..."
    cat > .env << 'EOL'
VITE_API_URL=http://localhost:3000/api
VITE_WS_URL=ws://localhost:3000
VITE_ENV=development
EOL
    log_success "Fichier .env frontend créé"
fi

# 9. Nettoyer les ports utilisés
log_info "Nettoyage des ports 3000 et 5173..."
fuser -k 3000/tcp 2>/dev/null || true
fuser -k 5173/tcp 2>/dev/null || true
log_success "Ports nettoyés"

# 10. Démarrer le backend
log_info "Démarrage du backend (port 3000)..."
cd /home/user/spotlight-lover/backend
npm run start:dev > /tmp/spotlight-backend.log 2>&1 &
BACKEND_PID=$!
echo $BACKEND_PID > /tmp/spotlight-backend.pid
log_success "Backend démarré (PID: $BACKEND_PID)"

# Attendre que le backend soit prêt
log_info "Attente du backend (max 30s)..."
for i in {1..30}; do
    if curl -s http://localhost:3000/api/health > /dev/null 2>&1; then
        log_success "Backend opérationnel !"
        break
    fi
    sleep 1
    if [ $i -eq 30 ]; then
        log_error "Backend n'a pas démarré dans les 30 secondes"
        log_info "Consultez les logs : tail -f /tmp/spotlight-backend.log"
    fi
done

# 11. Démarrer le frontend
log_info "Démarrage du frontend (port 5173)..."
cd /home/user/spotlight-lover/frontend
npm run dev > /tmp/spotlight-frontend.log 2>&1 &
FRONTEND_PID=$!
echo $FRONTEND_PID > /tmp/spotlight-frontend.pid
log_success "Frontend démarré (PID: $FRONTEND_PID)"

# Attendre que le frontend soit prêt
log_info "Attente du frontend (max 15s)..."
for i in {1..15}; do
    if curl -s http://localhost:5173 > /dev/null 2>&1; then
        log_success "Frontend opérationnel !"
        break
    fi
    sleep 1
done

# 12. Résumé final
echo ""
echo "╔════════════════════════════════════════════════════════════════════╗"
echo "║                 🎉 SPOTLIGHT LOVER EST EN LIGNE !                 ║"
echo "╚════════════════════════════════════════════════════════════════════╝"
echo ""
log_success "Backend :  http://localhost:3000/api"
log_success "Swagger :  http://localhost:3000/api/docs"
log_success "Frontend : http://localhost:5173"
echo ""
log_info "PIDs sauvegardés dans /tmp/spotlight-*.pid"
log_info "Logs disponibles : tail -f /tmp/spotlight-{backend,frontend}.log"
echo ""
log_warning "Pour arrêter : kill \$(cat /tmp/spotlight-backend.pid) \$(cat /tmp/spotlight-frontend.pid)"
echo ""
log_info "🔐 Pour créer le compte admin initial :"
echo "   cd /home/user/spotlight-lover/backend"
echo "   npm run create-admin"
echo ""
log_success "Bonne utilisation ! 🚀"
