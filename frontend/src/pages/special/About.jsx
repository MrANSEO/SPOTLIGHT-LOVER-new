import { Link } from 'react-router-dom';
import { FaRocket, FaStar, FaUsers, FaVideo, FaHeart, FaTrophy } from 'react-icons/fa';
import './About.css';

/**
 * About - Page À propos de Spotlight Lover
 * Présentation de la plateforme, mission, vision et valeurs
 */
function About() {
  const stats = [
    { icon: <FaUsers />, value: '10,000+', label: 'Utilisateurs actifs' },
    { icon: <FaVideo />, value: '50,000+', label: 'Vidéos publiées' },
    { icon: <FaStar />, value: '500,000+', label: 'Votes enregistrés' },
    { icon: <FaTrophy />, value: '200+', label: 'Gagnants mensuels' }
  ];

  const values = [
    {
      icon: <FaRocket />,
      title: 'Innovation',
      description: 'Nous repoussons constamment les limites de la créativité et de la technologie.'
    },
    {
      icon: <FaHeart />,
      title: 'Communauté',
      description: 'Une plateforme construite par et pour les créateurs de contenu camerounais.'
    },
    {
      icon: <FaStar />,
      title: 'Excellence',
      description: 'Nous valorisons la qualité, l\'authenticité et le talent dans chaque vidéo.'
    },
    {
      icon: <FaTrophy />,
      title: 'Récompense',
      description: 'Chaque vote compte et chaque créateur mérite d\'être rémunéré équitablement.'
    }
  ];

  const team = [
    {
      name: 'Équipe Technique',
      role: 'Développement & Infrastructure',
      description: 'Des experts passionnés qui construisent et maintiennent la plateforme.'
    },
    {
      name: 'Modération',
      role: 'Qualité du contenu',
      description: 'Une équipe dédiée qui assure la qualité et la sécurité du contenu.'
    },
    {
      name: 'Support',
      role: 'Assistance utilisateurs',
      description: 'Toujours prêts à aider notre communauté à réussir.'
    }
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-content">
          <h1 className="hero-title">
            <FaStar className="title-icon" />
            À propos de Spotlight Lover
          </h1>
          <p className="hero-subtitle">
            La plateforme camerounaise qui met en lumière les talents 
            et récompense la créativité vidéo
          </p>
        </div>
        <div className="hero-background">
          <div className="spotlight-circle"></div>
          <div className="spotlight-circle"></div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="about-section mission-section">
        <div className="container">
          <h2 className="section-title">Notre Mission</h2>
          <div className="mission-content">
            <p className="mission-text">
              <strong>Spotlight Lover</strong> est née d'une vision simple mais puissante : 
              donner aux créateurs de contenu camerounais une plateforme où leur talent 
              est non seulement reconnu, mais aussi récompensé de manière juste et transparente.
            </p>
            <p className="mission-text">
              Nous croyons que chaque vidéo mérite d'être vue, chaque vote compte, 
              et chaque créateur mérite d'être rémunéré pour son travail. 
              Notre système de votes payants via <strong>MTN Mobile Money</strong> et 
              <strong> Orange Money</strong> garantit une monétisation directe et équitable.
            </p>
            <p className="mission-text">
              Que vous soyez danseur, humoriste, musicien, acteur ou simplement 
              quelqu'un avec une histoire à raconter, Spotlight Lover est votre scène.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="about-section stats-section">
        <div className="container">
          <h2 className="section-title">Nos Chiffres</h2>
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="about-section values-section">
        <div className="container">
          <h2 className="section-title">Nos Valeurs</h2>
          <div className="values-grid">
            {values.map((value, index) => (
              <div key={index} className="value-card">
                <div className="value-icon">{value.icon}</div>
                <h3 className="value-title">{value.title}</h3>
                <p className="value-description">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="about-section team-section">
        <div className="container">
          <h2 className="section-title">Notre Équipe</h2>
          <div className="team-grid">
            {team.map((member, index) => (
              <div key={index} className="team-card">
                <h3 className="team-name">{member.name}</h3>
                <p className="team-role">{member.role}</p>
                <p className="team-description">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="about-section how-it-works">
        <div className="container">
          <h2 className="section-title">Comment ça marche ?</h2>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3 className="step-title">Créez votre compte</h3>
              <p className="step-description">
                Inscrivez-vous gratuitement avec votre email ou numéro de téléphone camerounais.
              </p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3 className="step-title">Publiez vos vidéos</h3>
              <p className="step-description">
                Uploadez vos créations vidéo (max 2 minutes) et partagez votre talent.
              </p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3 className="step-title">Recevez des votes</h3>
              <p className="step-description">
                Les utilisateurs votent pour vos vidéos via MTN ou Orange Money.
              </p>
            </div>
            <div className="step-card">
              <div className="step-number">4</div>
              <h3 className="step-title">Gagnez de l'argent</h3>
              <p className="step-description">
                70% de chaque vote vous revient directement. Plus de votes = plus de revenus !
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-section cta-section">
        <div className="container">
          <div className="cta-card">
            <h2 className="cta-title">Prêt à briller ?</h2>
            <p className="cta-description">
              Rejoignez des milliers de créateurs qui partagent leur passion 
              et gagnent de l'argent avec Spotlight Lover.
            </p>
            <div className="cta-buttons">
              <Link to="/register" className="cta-btn primary">
                Créer un compte
              </Link>
              <Link to="/feed" className="cta-btn secondary">
                Découvrir les vidéos
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
