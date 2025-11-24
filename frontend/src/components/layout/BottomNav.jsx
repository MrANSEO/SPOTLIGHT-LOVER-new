import { Link, useLocation } from 'react-router-dom';
import './BottomNav.css';

const BottomNav = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  // Navigation items
  const navItems = [
    { path: '/feed', icon: '🏠', label: 'Accueil' },
    { path: '/leaderboard', icon: '🏆', label: 'Classement' },
    { path: '/upload', icon: '➕', label: 'Upload', special: true },
    { path: '/notifications', icon: '🔔', label: 'Notifs' },
    { path: '/profile', icon: '👤', label: 'Profil' },
  ];

  return (
    <nav className="bottom-nav">
      <div className="bottom-nav-container">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`bottom-nav-item ${isActive(item.path) ? 'active' : ''} ${item.special ? 'special' : ''}`}
          >
            <span className="nav-item-icon">{item.icon}</span>
            <span className="nav-item-label">{item.label}</span>
            
            {/* Badge pour notifications (optionnel) */}
            {item.path === '/notifications' && (
              <span className="nav-item-badge">3</span>
            )}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
