import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import BottomNav from './BottomNav';
import './MainLayout.css';

const MainLayout = () => {
  const location = useLocation();

  // Pages qui ne doivent pas afficher le Header/Footer (ex: Feed plein écran)
  const hideHeaderFooter = ['/feed', '/video/:id'].some(path => 
    location.pathname.startsWith(path.replace('/:id', ''))
  );

  // Pages qui ne doivent pas afficher la BottomNav
  const hideBottomNav = ['/', '/login', '/register', '/recover-password'].includes(location.pathname);

  return (
    <div className="main-layout">
      {/* Header (caché sur certaines pages) */}
      {!hideHeaderFooter && <Header />}

      {/* Contenu principal */}
      <main className={`main-content ${hideHeaderFooter ? 'full-screen' : ''}`}>
        <Outlet />
      </main>

      {/* Footer (caché sur certaines pages) */}
      {!hideHeaderFooter && <Footer />}

      {/* Bottom Navigation (uniquement mobile, caché sur certaines pages) */}
      {!hideBottomNav && <BottomNav />}
    </div>
  );
};

export default MainLayout;
