import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaRedo, FaHeadset } from 'react-icons/fa';
import './ServerError.css';

/**
 * ServerError (500) - Page affichée en cas d'erreur serveur
 * Informations claires et options de récupération
 */
function ServerError() {
  const navigate = useNavigate();

  const handleRetry = () => {
    window.location.reload();
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="server-error-page">
      <div className="server-error-container">
        {/* Icône d'erreur animée */}
        <div className="error-icon-wrapper">
          <div className="error-icon">
            <div className="server-rack">
              <div className="rack-light"></div>
              <div className="rack-light"></div>
              <div className="rack-light"></div>
              <div className="spark"></div>
              <div className="spark"></div>
            </div>
          </div>
        </div>

        {/* Code d'erreur */}
        <div className="error-code-box">
          <span className="error-number">500</span>
          <span className="error-label">Erreur Serveur</span>
        </div>

        {/* Contenu de l'erreur */}
        <div className="error-content">
          <h1 className="error-title">Oups ! Quelque chose s'est mal passé</h1>
          <p className="error-description">
            Une erreur inattendue s'est produite sur nos serveurs. 
            Nos équipes techniques ont été automatiquement notifiées et travaillent à résoudre le problème.
          </p>

          {/* Détails techniques (optionnel - à afficher si disponible) */}
          <div className="error-details">
            <p className="detail-label">Code d'erreur :</p>
            <code className="detail-code">ERR_INTERNAL_SERVER_ERROR_500</code>
            <p className="detail-timestamp">
              {new Date().toLocaleString('fr-FR', { 
                dateStyle: 'medium', 
                timeStyle: 'medium' 
              })}
            </p>
          </div>

          {/* Actions */}
          <div className="error-actions">
            <button onClick={handleRetry} className="action-btn primary">
              <FaRedo className="btn-icon" />
              Réessayer
            </button>
            
            <button onClick={handleGoBack} className="action-btn secondary">
              <FaHome className="btn-icon" />
              Page précédente
            </button>

            <Link to="/contact" className="action-btn tertiary">
              <FaHeadset className="btn-icon" />
              Contacter le support
            </Link>
          </div>

          {/* Conseils */}
          <div className="help-tips">
            <h3 className="tips-title">Que faire ?</h3>
            <ul className="tips-list">
              <li>✓ Actualisez la page (F5 ou Ctrl+R)</li>
              <li>✓ Vérifiez votre connexion internet</li>
              <li>✓ Réessayez dans quelques minutes</li>
              <li>✓ Contactez-nous si le problème persiste</li>
            </ul>
          </div>

          {/* Liens rapides */}
          <div className="quick-links">
            <p className="quick-links-title">Ou explorez :</p>
            <div className="links-grid">
              <Link to="/">Accueil</Link>
              <Link to="/feed">Feed</Link>
              <Link to="/leaderboard">Classement</Link>
              <Link to="/help">Aide</Link>
            </div>
          </div>
        </div>

        {/* Animation background */}
        <div className="error-bg">
          <div className="grid-line"></div>
          <div className="grid-line"></div>
          <div className="grid-line"></div>
          <div className="grid-line"></div>
        </div>
      </div>
    </div>
  );
}

export default ServerError;
