import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo avec effet glow */}
        <Link to="/" className="header-logo glow">
          <span className="logo-icon">⭐</span>
          <span className="logo-text">Spotlight Lover</span>
        </Link>

        {/* Navigation Desktop */}
        <nav className="header-nav desktop-nav">
          <Link 
            to="/" 
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
          >
            Accueil
          </Link>
          <Link 
            to="/about" 
            className={`nav-link ${isActive('/about') ? 'active' : ''}`}
          >
            À propos
          </Link>
          <Link 
            to="/gallery" 
            className={`nav-link ${isActive('/gallery') ? 'active' : ''}`}
          >
            Galerie
          </Link>
          <Link 
            to="/leaderboard" 
            className={`nav-link ${isActive('/leaderboard') ? 'active' : ''}`}
          >
            Classement
          </Link>
          <Link 
            to="/become-candidate" 
            className={`nav-link ${isActive('/become-candidate') ? 'active' : ''}`}
          >
            Devenir candidat
          </Link>
        </nav>

        {/* Boutons Auth / User Menu */}
        <div className="header-actions">
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="user-avatar" title={user?.name || 'Profil'}>
                <span className="avatar-text">{user?.name?.charAt(0) || '👤'}</span>
              </Link>
              <button onClick={handleLogout} className="btn btn-outline btn-sm">
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline btn-sm">
                Connexion
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                S'inscrire
              </Link>
            </>
          )}

          {/* Menu Burger Mobile */}
          <button 
            className="menu-burger"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span className={`burger-line ${menuOpen ? 'open' : ''}`}></span>
            <span className={`burger-line ${menuOpen ? 'open' : ''}`}></span>
            <span className={`burger-line ${menuOpen ? 'open' : ''}`}></span>
          </button>
        </div>
      </div>

      {/* Navigation Mobile */}
      {menuOpen && (
        <>
          <div className="menu-overlay" onClick={toggleMenu}></div>
          <nav className="header-nav mobile-nav slide-in-right">
            <Link 
              to="/" 
              className={`nav-link ${isActive('/') ? 'active' : ''}`}
              onClick={toggleMenu}
            >
              <span className="nav-icon">🏠</span>
              Accueil
            </Link>
            <Link 
              to="/about" 
              className={`nav-link ${isActive('/about') ? 'active' : ''}`}
              onClick={toggleMenu}
            >
              <span className="nav-icon">ℹ️</span>
              À propos
            </Link>
            <Link 
              to="/gallery" 
              className={`nav-link ${isActive('/gallery') ? 'active' : ''}`}
              onClick={toggleMenu}
            >
              <span className="nav-icon">🎬</span>
              Galerie
            </Link>
            <Link 
              to="/leaderboard" 
              className={`nav-link ${isActive('/leaderboard') ? 'active' : ''}`}
              onClick={toggleMenu}
            >
              <span className="nav-icon">🏆</span>
              Classement
            </Link>
            <Link 
              to="/become-candidate" 
              className={`nav-link ${isActive('/become-candidate') ? 'active' : ''}`}
              onClick={toggleMenu}
            >
              <span className="nav-icon">🎬</span>
              Devenir candidat
            </Link>
            <div className="divider"></div>
            {isAuthenticated ? (
              <>
                <Link 
                  to="/profile" 
                  className="nav-link"
                  onClick={toggleMenu}
                >
                  <span className="nav-icon">👤</span>
                  Mon Profil
                </Link>
                <Link 
                  to="/settings" 
                  className="nav-link"
                  onClick={toggleMenu}
                >
                  <span className="nav-icon">⚙️</span>
                  Paramètres
                </Link>
                <button 
                  onClick={handleLogout}
                  className="nav-link"
                  style={{ width: '100%', textAlign: 'left', border: 'none', background: 'transparent', cursor: 'pointer' }}
                >
                  <span className="nav-icon">🚪</span>
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="nav-link"
                  onClick={toggleMenu}
                >
                  <span className="nav-icon">🔐</span>
                  Connexion
                </Link>
                <Link 
                  to="/register" 
                  className="nav-link"
                  onClick={toggleMenu}
                >
                  <span className="nav-icon">✨</span>
                  S'inscrire
                </Link>
              </>
            )}
          </nav>
        </>
      )}
    </header>
  );
};

export default Header;
