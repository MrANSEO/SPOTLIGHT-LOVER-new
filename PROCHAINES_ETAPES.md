# 🚀 Prochaines Étapes - Spotlight Lover

> **Mis à jour:** 24 Novembre 2025  
> **Phase actuelle:** 2 - Authentification  
> **Priorité:** 🔴 HAUTE

---

## 📋 Ce qui est déjà fait ✅

### Backend (100%)
- [x] NestJS + Prisma + PostgreSQL configurés
- [x] 8 modules complets (Auth, Videos, Votes, Payments, Leaderboard, etc.)
- [x] Intégration MeSomb (MTN + Orange Money)
- [x] WebSocket temps réel pour leaderboard
- [x] Cloudinary pour stockage vidéos
- [x] JWT Authentication (access + refresh tokens)
- [x] Profile management (update, change password, delete)
- [x] Documentation complète (3 guides)

### Frontend Phase 1 (100%)
- [x] Design System complet (variables, animations, global CSS)
- [x] Thème violet avec gradient animé
- [x] Layout components (Header, Footer, BottomNav, MainLayout)
- [x] Page d'accueil (Home) complète
- [x] React Router v6 configuré
- [x] Build + Dev server fonctionnels

---

## 🎯 Phase 2 : Authentification (À faire maintenant)

### 1️⃣ Créer AuthContext (Priorité 1)

**Fichier:** `/frontend/src/context/AuthContext.jsx`

**Fonctionnalités requises:**
```javascript
// État à gérer
- user (null | { id, email, name, phone, role, ... })
- accessToken (string | null)
- refreshToken (string | null)
- isAuthenticated (boolean)
- isLoading (boolean)
- error (string | null)

// Fonctions à implémenter
- login(email, password, rememberMe)
- register(name, email, phone, password)
- logout()
- refreshAccessToken()
- updateUserProfile(data)
- checkAuthStatus()

// Persistance
- localStorage pour tokens si rememberMe = true
- sessionStorage sinon
- Auto-refresh du token avant expiration
```

**Structure:**
```jsx
import { createContext, useContext, useState, useEffect } from 'react';
import * as authService from '../services/auth.service';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Vérifier si tokens existent au chargement
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Auto-refresh token toutes les 14 minutes (access token expire à 15min)
  useEffect(() => {
    if (isAuthenticated && refreshToken) {
      const interval = setInterval(() => {
        refreshAccessToken();
      }, 14 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, refreshToken]);

  const checkAuthStatus = async () => {
    // Récupérer tokens depuis storage
    // Vérifier validité
    // Charger infos user
  };

  const login = async (email, password, rememberMe = false) => {
    // Appeler authService.login()
    // Stocker tokens (localStorage ou sessionStorage selon rememberMe)
    // Charger infos user
    // Mettre à jour état
  };

  const register = async (name, email, phone, password) => {
    // Appeler authService.register()
    // Auto-login après inscription
  };

  const logout = () => {
    // Nettoyer tous les tokens
    // Réinitialiser état
    // Rediriger vers page login
  };

  const refreshAccessToken = async () => {
    // Appeler authService.refresh(refreshToken)
    // Mettre à jour accessToken
  };

  const value = {
    user,
    accessToken,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    refreshAccessToken,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

**Intégration dans App.jsx:**
```jsx
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* ... routes ... */}
      </BrowserRouter>
    </AuthProvider>
  );
}
```

---

### 2️⃣ Créer Services API (Priorité 2)

**Fichiers à créer:**

#### `/frontend/src/services/api.js` (Configuration Axios)
```javascript
import axios from 'axios';

// URL du backend (à mettre dans .env)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Instance Axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur REQUEST : Ajouter token automatiquement
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur RESPONSE : Gérer erreurs et refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Si 401 et pas déjà retry, tenter refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken') || sessionStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });
          const { accessToken } = response.data;
          
          // Stocker nouveau token
          if (localStorage.getItem('accessToken')) {
            localStorage.setItem('accessToken', accessToken);
          } else {
            sessionStorage.setItem('accessToken', accessToken);
          }
          
          // Retry requête originale
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh échoué, déconnecter user
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
```

#### `/frontend/src/services/auth.service.js`
```javascript
import api from './api';

export const login = (email, password) => {
  return api.post('/auth/login', { email, password });
};

export const register = (name, email, phone, password) => {
  return api.post('/auth/register', { name, email, phone, password });
};

export const logout = () => {
  return api.post('/auth/logout');
};

export const refresh = (refreshToken) => {
  return api.post('/auth/refresh', { refreshToken });
};

export const getProfile = () => {
  return api.get('/auth/profile');
};

export const updateProfile = (data) => {
  return api.patch('/auth/profile', data);
};

export const changePassword = (oldPassword, newPassword) => {
  return api.post('/auth/change-password', { oldPassword, newPassword });
};

export const deleteAccount = () => {
  return api.delete('/auth/account');
};

export const requestPasswordReset = (email) => {
  return api.post('/auth/forgot-password', { email });
};

export const verifyResetCode = (email, code) => {
  return api.post('/auth/verify-reset-code', { email, code });
};

export const resetPassword = (email, code, newPassword) => {
  return api.post('/auth/reset-password', { email, code, newPassword });
};
```

#### `/frontend/src/services/videos.service.js`
```javascript
import api from './api';

export const getVideos = (params) => {
  return api.get('/videos', { params });
};

export const getVideoById = (id) => {
  return api.get(`/videos/${id}`);
};

export const uploadVideo = (formData, onUploadProgress) => {
  return api.post('/videos', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress,
  });
};

export const updateVideo = (id, data) => {
  return api.patch(`/videos/${id}`, data);
};

export const deleteVideo = (id) => {
  return api.delete(`/videos/${id}`);
};

export const getMyVideos = () => {
  return api.get('/videos/my-videos');
};
```

#### `/frontend/src/services/votes.service.js`
```javascript
import api from './api';

export const initPayment = (videoId, provider, amount, customerPhone) => {
  return api.post('/votes/init-payment', {
    videoId,
    provider,
    amount,
    customerPhone,
  });
};

export const getPaymentStatus = (reference) => {
  return api.get(`/votes/payment-status/${reference}`);
};

export const getMyVotes = () => {
  return api.get('/votes/my-votes');
};
```

#### `/frontend/src/services/leaderboard.service.js`
```javascript
import api from './api';

export const getLeaderboard = (params) => {
  return api.get('/leaderboard', { params });
};

export const getParticipantStats = (participantId) => {
  return api.get(`/leaderboard/participant/${participantId}`);
};
```

#### Créer fichier `.env` pour URL backend
```bash
# Créer le fichier
cd /home/user/spotlight-lover/frontend
touch .env

# Ajouter
VITE_API_URL=http://localhost:3000/api
```

---

### 3️⃣ Créer Pages Auth (Priorité 3)

#### Page Login (`/frontend/src/pages/auth/Login.jsx`)

**Features:**
- Formulaire email + password
- Checkbox "Se souvenir de moi" (rememberMe)
- Lien "Mot de passe oublié ?"
- Bouton "Connexion" avec loading
- Message d'erreur stylisé
- Redirect vers `/feed` après login réussi
- Validation email format
- Animations entrée (fadeIn, slideUp)

**Structure:**
```jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const validateForm = () => {
    const newErrors = {};
    
    // Valider email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email requis';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }
    
    // Valider password
    if (!formData.password) {
      newErrors.password = 'Mot de passe requis';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Minimum 6 caractères';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      await login(formData.email, formData.password, formData.rememberMe);
      navigate('/feed'); // Redirect vers Feed après login
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Effacer erreur du champ modifié
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="auth-page login-page">
      <div className="auth-container fade-in">
        <div className="auth-card card">
          {/* Logo */}
          <div className="auth-logo glow">
            <span className="logo-icon twinkle">⭐</span>
            <h1>Spotlight Lover</h1>
          </div>
          
          {/* Titre */}
          <h2 className="auth-title">Connexion</h2>
          <p className="auth-subtitle">Bon retour parmi nous ! 👋</p>
          
          {/* Message d'erreur global */}
          {errorMessage && (
            <div className="alert alert-error shake">
              {errorMessage}
            </div>
          )}
          
          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="auth-form">
            {/* Email */}
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="exemple@email.com"
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
            
            {/* Password */}
            <div className="form-group">
              <label htmlFor="password">Mot de passe</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={errors.password ? 'error' : ''}
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>
            
            {/* Remember me + Forgot password */}
            <div className="form-row">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />
                <span>Se souvenir de moi</span>
              </label>
              
              <Link to="/recover-password" className="link-primary">
                Mot de passe oublié ?
              </Link>
            </div>
            
            {/* Submit button */}
            <button
              type="submit"
              className="btn btn-primary btn-lg w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner spinner-sm"></span>
                  Connexion...
                </>
              ) : (
                <>🔐 Se connecter</>
              )}
            </button>
          </form>
          
          {/* Lien inscription */}
          <div className="auth-footer">
            <p>
              Pas encore de compte ?{' '}
              <Link to="/register" className="link-primary">
                S'inscrire gratuitement
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
```

#### CSS Login (`/frontend/src/pages/auth/Login.css`)
```css
/* Auth pages styling */
.auth-page {
  min-height: calc(100vh - var(--header-height));
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl);
}

.auth-container {
  max-width: 480px;
  width: 100%;
}

.auth-card {
  padding: var(--spacing-3xl);
}

.auth-logo {
  text-align: center;
  margin-bottom: var(--spacing-xl);
}

.auth-logo h1 {
  font-size: var(--font-size-3xl);
  margin: var(--spacing-md) 0 0;
  background: linear-gradient(90deg, var(--violet-light), var(--violet-lighter));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.auth-title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  text-align: center;
  margin-bottom: var(--spacing-sm);
}

.auth-subtitle {
  text-align: center;
  color: var(--gray-light);
  margin-bottom: var(--spacing-2xl);
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.form-group label {
  font-weight: var(--font-weight-semibold);
  color: var(--white);
  font-size: var(--font-size-sm);
}

.form-group input {
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  border: 2px solid var(--border-light);
  background: var(--bg-input);
  color: var(--white);
  font-size: var(--font-size-base);
  transition: all var(--transition-base);
}

.form-group input:focus {
  border-color: var(--violet-light);
  box-shadow: 0 0 0 3px rgba(199, 125, 255, 0.1);
}

.form-group input.error {
  border-color: var(--error);
}

.error-message {
  color: var(--error);
  font-size: var(--font-size-xs);
  margin-top: -4px;
}

.form-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
  flex-wrap: wrap;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  cursor: pointer;
  font-size: var(--font-size-sm);
  color: var(--gray-light);
}

.checkbox-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.link-primary {
  color: var(--violet-light);
  font-size: var(--font-size-sm);
  text-decoration: none;
  transition: color var(--transition-base);
}

.link-primary:hover {
  color: var(--violet-lighter);
  text-decoration: underline;
}

.alert {
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-lg);
  text-align: center;
}

.alert-error {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid var(--error);
  color: var(--error);
}

.alert-success {
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid var(--success);
  color: var(--success);
}

.auth-footer {
  text-align: center;
  margin-top: var(--spacing-xl);
  padding-top: var(--spacing-xl);
  border-top: 1px solid var(--border-light);
}

.auth-footer p {
  color: var(--gray-light);
  margin: 0;
}

/* Responsive */
@media (max-width: 480px) {
  .auth-card {
    padding: var(--spacing-xl);
  }
  
  .form-row {
    flex-direction: column;
    align-items: flex-start;
  }
}
```

#### Autres pages Auth à créer
Suivre le même pattern pour :
- **Register.jsx** : Formulaire avec nom, email, phone, password, confirmPassword
- **RecoverPassword.jsx** : 3 étapes (email → code → nouveau password)

---

### 4️⃣ Protected Routes

Créer un composant pour protéger les routes authentifiées :

**Fichier:** `/frontend/src/components/common/ProtectedRoute.jsx`

```jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner spinner-lg"></div>
        <p>Chargement...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
```

**Utilisation dans App.jsx:**
```jsx
import ProtectedRoute from './components/common/ProtectedRoute';

// Routes protégées
<Route
  path="/feed"
  element={
    <ProtectedRoute>
      <Feed />
    </ProtectedRoute>
  }
/>
```

---

## 📂 Structure Finale Phase 2

Après Phase 2, ta structure devrait ressembler à ça :

```
frontend/
├── src/
│   ├── context/
│   │   └── AuthContext.jsx           ✅ À créer
│   ├── services/
│   │   ├── api.js                    ✅ À créer
│   │   ├── auth.service.js           ✅ À créer
│   │   ├── videos.service.js         ✅ À créer
│   │   ├── votes.service.js          ✅ À créer
│   │   └── leaderboard.service.js    ✅ À créer
│   ├── pages/
│   │   └── auth/
│   │       ├── Login.jsx + .css      ✅ À créer
│   │       ├── Register.jsx + .css   ✅ À créer
│   │       └── RecoverPassword.jsx   ✅ À créer
│   ├── components/
│   │   └── common/
│   │       └── ProtectedRoute.jsx    ✅ À créer
│   └── App.jsx                       ✅ À mettre à jour
├── .env                              ✅ À créer
└── FRONTEND_STATUS.md                ✅ À mettre à jour
```

---

## ⏱️ Estimation Temps Phase 2

- **AuthContext:** 1-2 heures
- **Services API:** 1-2 heures
- **Pages Auth (3 pages):** 3-4 heures
- **ProtectedRoute + Tests:** 1 heure
- **Total:** 6-9 heures

---

## 🎯 Après Phase 2

Une fois la Phase 2 terminée, tu pourras :
- ✅ Te connecter/déconnecter
- ✅ Créer un compte
- ✅ Récupérer ton mot de passe
- ✅ Accéder aux pages protégées (Feed, Profile, etc.)
- ✅ Auto-refresh des tokens
- ✅ Gestion erreurs API

Tu seras alors prêt pour la **Phase 3: Feed + Leaderboard** ! 🚀

---

**Bon courage pour la suite ! 💪**
