import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaSearch, FaVideo } from 'react-icons/fa';
import './NotFound.css';

/**
 * NotFound (404) - Page affichée quand l'utilisateur accède à une route inexistante
 * Design moderne avec animations et liens de navigation
 */
function NotFound() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="not-found-page">
      <div className="not-found-container">
        {/* Animation 404 avec spotlight effect */}
        <div className="error-code">
          <span className="digit">4</span>
          <span className="digit spotlight">0</span>
          <span className="digit">4</span>
        </div>

        <div className="error-content">
          <h1 className="error-title">Page introuvable</h1>
          <p className="error-description">
            Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
          </p>

          {/* Actions rapides */}
          <div className="error-actions">
            <Link to="/" className="action-btn primary">
              <FaHome className="btn-icon" />
              Retour à l'accueil
            </Link>
            
            <button onClick={handleGoBack} className="action-btn secondary">
              <FaSearch className="btn-icon" />
              Page précédente
            </button>

            <Link to="/feed" className="action-btn tertiary">
              <FaVideo className="btn-icon" />
              Voir les vidéos
            </Link>
          </div>

          {/* Suggestions */}
          <div className="suggestions">
            <p className="suggestions-title">Liens utiles :</p>
            <ul className="suggestions-list">
              <li><Link to="/feed">Feed des vidéos</Link></li>
              <li><Link to="/leaderboard">Classement</Link></li>
              <li><Link to="/gallery">Galerie</Link></li>
              <li><Link to="/upload">Publier une vidéo</Link></li>
              <li><Link to="/help">Centre d'aide</Link></li>
              <li><Link to="/contact">Nous contacter</Link></li>
            </ul>
          </div>
        </div>

        {/* Animation spotlight background */}
        <div className="spotlight-bg">
          <div className="spotlight"></div>
          <div className="spotlight"></div>
          <div className="spotlight"></div>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
