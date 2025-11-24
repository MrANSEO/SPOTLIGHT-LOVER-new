import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content slide-up">
          <h1 className="hero-title glow">
            <span className="hero-icon twinkle">⭐</span>
            Spotlight Lover
          </h1>
          <p className="hero-subtitle fade-in delay-1">
            Découvrez et votez pour les meilleurs talents camerounais
          </p>
          <p className="hero-description fade-in delay-2">
            Une plateforme innovante pour mettre en lumière les artistes, influenceurs et créateurs de contenu du Cameroun 🇨🇲
          </p>
          <div className="hero-actions fade-in delay-3">
            <Link to="/register" className="btn btn-primary btn-lg hover-glow">
              🚀 Commencer maintenant
            </Link>
            <Link to="/gallery" className="btn btn-outline btn-lg hover-scale">
              🎬 Voir la galerie
            </Link>
          </div>
        </div>

        {/* Stats Section */}
        <div className="hero-stats fade-in delay-4">
          <div className="stat-card card hover-lift">
            <div className="stat-icon">👥</div>
            <div className="stat-value">1,200+</div>
            <div className="stat-label">Participants</div>
          </div>
          <div className="stat-card card hover-lift">
            <div className="stat-icon">🎥</div>
            <div className="stat-value">500+</div>
            <div className="stat-label">Vidéos</div>
          </div>
          <div className="stat-card card hover-lift">
            <div className="stat-icon">⭐</div>
            <div className="stat-value">50K+</div>
            <div className="stat-label">Votes</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section section">
        <div className="container">
          <h2 className="section-title">Comment ça marche ?</h2>
          <div className="features-grid grid grid-cols-3">
            <div className="feature-card card fade-in delay-1">
              <div className="feature-icon">📱</div>
              <h3 className="feature-title">1. Créez votre compte</h3>
              <p className="feature-description">
                Inscrivez-vous gratuitement en quelques secondes et rejoignez la communauté.
              </p>
            </div>
            <div className="feature-card card fade-in delay-2">
              <div className="feature-icon">🎬</div>
              <h3 className="feature-title">2. Partagez votre talent</h3>
              <p className="feature-description">
                Uploadez vos meilleures vidéos et montrez votre créativité au monde.
              </p>
            </div>
            <div className="feature-card card fade-in delay-3">
              <div className="feature-icon">🏆</div>
              <h3 className="feature-title">3. Gagnez des votes</h3>
              <p className="feature-description">
                Recevez des votes de la communauté et grimpez au classement !
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title glow">Prêt à briller ? ✨</h2>
          <p className="cta-description">
            Rejoignez des centaines de créateurs camerounais et mettez en avant votre talent unique !
          </p>
          <Link to="/register" className="btn btn-primary btn-lg hover-glow">
            🚀 Créer mon compte gratuitement
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
