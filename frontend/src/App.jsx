import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { MainLayout } from './components/layout';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages publiques
import Home from './pages/public/Home';

// Pages authentification
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import RecoverPassword from './pages/auth/RecoverPassword';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Layout avec Header, Footer et BottomNav */}
          <Route element={<MainLayout />}>
            {/* Pages publiques */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<div className="container section"><h1 className="section-title">À propos - En construction 🚧</h1></div>} />
            <Route path="/gallery" element={<div className="container section"><h1 className="section-title">Galerie - En construction 🚧</h1></div>} />
            <Route path="/leaderboard" element={<div className="container section"><h1 className="section-title">Classement - En construction 🚧</h1></div>} />
            
            {/* Pages authentification */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/recover-password" element={<RecoverPassword />} />
            
            {/* Pages protégées (nécessitent authentification) */}
            <Route 
              path="/feed" 
              element={
                <ProtectedRoute>
                  <div className="container section"><h1 className="section-title">Feed - En construction 🚧</h1></div>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <div className="container section"><h1 className="section-title">Profil - En construction 🚧</h1></div>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <div className="container section"><h1 className="section-title">Paramètres - En construction 🚧</h1></div>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/upload" 
              element={
                <ProtectedRoute>
                  <div className="container section"><h1 className="section-title">Upload - En construction 🚧</h1></div>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/notifications" 
              element={
                <ProtectedRoute>
                  <div className="container section"><h1 className="section-title">Notifications - En construction 🚧</h1></div>
                </ProtectedRoute>
              } 
            />
            
            {/* Page 404 */}
            <Route path="*" element={<div className="container section"><h1 className="section-title">404 - Page non trouvée</h1></div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
