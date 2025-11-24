import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/layout';
import Home from './pages/public/Home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Layout avec Header, Footer et BottomNav */}
        <Route element={<MainLayout />}>
          {/* Pages publiques */}
          <Route path="/" element={<Home />} />
          
          {/* Pages temporaires (à créer) */}
          <Route path="/about" element={<div className="container section"><h1 className="section-title">À propos - En construction 🚧</h1></div>} />
          <Route path="/gallery" element={<div className="container section"><h1 className="section-title">Galerie - En construction 🚧</h1></div>} />
          <Route path="/leaderboard" element={<div className="container section"><h1 className="section-title">Classement - En construction 🚧</h1></div>} />
          <Route path="/login" element={<div className="container section"><h1 className="section-title">Connexion - En construction 🚧</h1></div>} />
          <Route path="/register" element={<div className="container section"><h1 className="section-title">Inscription - En construction 🚧</h1></div>} />
          
          {/* Page 404 */}
          <Route path="*" element={<div className="container section"><h1 className="section-title">404 - Page non trouvée</h1></div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
