import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Section 1: À propos */}
        <div className="footer-section">
          <h3 className="footer-title glow">
            <span className="footer-logo-icon">⭐</span>
            Spotlight Lover
          </h3>
          <p className="footer-description">
            La plateforme ultime pour découvrir et voter pour les meilleurs talents camerounais !
          </p>
          <div className="footer-social">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link hover-glow">
              📘
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link hover-glow">
              📷
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link hover-glow">
              🐦
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-link hover-glow">
              🎥
            </a>
          </div>
        </div>

        {/* Section 2: Liens rapides */}
        <div className="footer-section">
          <h4 className="footer-section-title">Liens rapides</h4>
          <ul className="footer-links">
            <li><Link to="/" className="footer-link">Accueil</Link></li>
            <li><Link to="/about" className="footer-link">À propos</Link></li>
            <li><Link to="/gallery" className="footer-link">Galerie</Link></li>
            <li><Link to="/leaderboard" className="footer-link">Classement</Link></li>
            <li><Link to="/faq" className="footer-link">FAQ</Link></li>
          </ul>
        </div>

        {/* Section 3: Légal */}
        <div className="footer-section">
          <h4 className="footer-section-title">Légal</h4>
          <ul className="footer-links">
            <li><Link to="/terms" className="footer-link">Conditions d'utilisation</Link></li>
            <li><Link to="/privacy" className="footer-link">Politique de confidentialité</Link></li>
            <li><Link to="/cookies" className="footer-link">Politique des cookies</Link></li>
            <li><Link to="/contact" className="footer-link">Contact</Link></li>
          </ul>
        </div>

        {/* Section 4: Newsletter */}
        <div className="footer-section">
          <h4 className="footer-section-title">Newsletter</h4>
          <p className="footer-newsletter-text">
            Restez informé des dernières actualités et des nouveaux talents !
          </p>
          <form className="footer-newsletter-form">
            <input 
              type="email" 
              placeholder="Votre email..." 
              className="footer-newsletter-input"
              required
            />
            <button type="submit" className="btn btn-primary btn-sm">
              S'abonner
            </button>
          </form>
        </div>
      </div>

      {/* Copyright */}
      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <p className="footer-copyright">
            © {currentYear} Spotlight Lover. Tous droits réservés.
          </p>
          <p className="footer-made-with">
            Fait avec <span className="heart-icon">💜</span> au Cameroun 🇨🇲
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
