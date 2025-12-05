import { useState } from 'react';
import { FaSearch, FaChevronDown, FaChevronUp, FaQuestionCircle, FaUserCircle, FaVideo, FaMoneyBillWave, FaShieldAlt } from 'react-icons/fa';
import './FAQ.css';

/**
 * FAQ - Foire aux questions
 * Questions/réponses organisées par catégories avec recherche
 */
function FAQ() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedQuestions, setExpandedQuestions] = useState([]);

  const categories = [
    { id: 'all', name: 'Toutes', icon: <FaQuestionCircle /> },
    { id: 'account', name: 'Compte', icon: <FaUserCircle /> },
    { id: 'videos', name: 'Vidéos', icon: <FaVideo /> },
    { id: 'payment', name: 'Paiement', icon: <FaMoneyBillWave /> },
    { id: 'security', name: 'Sécurité', icon: <FaShieldAlt /> }
  ];

  const faqData = [
    // Compte
    {
      category: 'account',
      question: 'Comment créer un compte sur Spotlight Lover ?',
      answer: 'Pour créer un compte, cliquez sur "S\'inscrire" en haut à droite, puis remplissez le formulaire avec votre nom, email et numéro de téléphone camerounais (format: 237 suivi de 6 ou 2 + 8 chiffres). Validez votre email et votre compte sera activé.'
    },
    {
      category: 'account',
      question: 'J\'ai oublié mon mot de passe, que faire ?',
      answer: 'Cliquez sur "Mot de passe oublié" sur la page de connexion. Entrez votre email ou numéro de téléphone, et vous recevrez un lien de réinitialisation par email ou SMS.'
    },
    {
      category: 'account',
      question: 'Comment modifier mes informations de profil ?',
      answer: 'Connectez-vous, allez dans Paramètres > Profil. Vous pouvez y modifier votre nom, bio, photo de profil, et vos informations de contact.'
    },
    {
      category: 'account',
      question: 'Puis-je supprimer mon compte ?',
      answer: 'Oui. Allez dans Paramètres > Compte > Supprimer mon compte. Attention : cette action est irréversible et supprimera toutes vos vidéos et données.'
    },

    // Vidéos
    {
      category: 'videos',
      question: 'Quelles sont les spécifications des vidéos acceptées ?',
      answer: 'Format: MP4, MOV, AVI. Durée maximale: 2 minutes (120 secondes). Taille maximale: 100 MB. Résolution recommandée: 1080p (Full HD). Ratio: 9:16 (vertical) ou 16:9 (horizontal).'
    },
    {
      category: 'videos',
      question: 'Comment publier une vidéo ?',
      answer: 'Cliquez sur "Publier" dans le menu, sélectionnez votre vidéo, ajoutez un titre et une description, choisissez une catégorie, puis cliquez sur "Publier". Votre vidéo sera modérée avant publication.'
    },
    {
      category: 'videos',
      question: 'Combien de temps prend la modération ?',
      answer: 'La modération prend généralement entre 2 à 24 heures. Vous recevrez une notification une fois votre vidéo approuvée ou rejetée.'
    },
    {
      category: 'videos',
      question: 'Puis-je modifier ou supprimer une vidéo publiée ?',
      answer: 'Oui. Allez sur votre profil, cliquez sur la vidéo, puis sélectionnez "Modifier" ou "Supprimer". Note : la suppression est définitive.'
    },
    {
      category: 'videos',
      question: 'Quels types de contenu sont interdits ?',
      answer: 'Contenu violent, pornographique, haineux, discriminatoire, ou portant atteinte aux droits d\'auteur. Consultez nos Conditions d\'Utilisation pour plus de détails.'
    },

    // Paiement
    {
      category: 'payment',
      question: 'Comment voter pour une vidéo ?',
      answer: 'Cliquez sur "Voter" sous une vidéo, choisissez le montant (100 FCFA, 250 FCFA, 500 FCFA), sélectionnez votre méthode de paiement (MTN Mobile Money ou Orange Money), et suivez les instructions.'
    },
    {
      category: 'payment',
      question: 'Quels sont les montants de vote disponibles ?',
      answer: 'Vous pouvez voter avec 100 FCFA, 250 FCFA, ou 500 FCFA. Chaque montant donne un nombre de votes différent.'
    },
    {
      category: 'payment',
      question: 'Comment récupérer mes gains ?',
      answer: '70% de chaque vote revient au créateur. Allez dans Paramètres > Paiements > Retirer. Minimum de retrait : 5 000 FCFA. Délai : 3 à 5 jours ouvrables.'
    },
    {
      category: 'payment',
      question: 'Quels sont les frais de transaction ?',
      answer: 'Spotlight Lover prend 30% de commission sur chaque vote. Les frais de Mobile Money (MTN/Orange) sont à la charge de l\'utilisateur.'
    },
    {
      category: 'payment',
      question: 'Mon paiement a échoué, que faire ?',
      answer: 'Vérifiez votre solde Mobile Money, assurez-vous d\'avoir entré le bon PIN, et réessayez. Si le problème persiste, contactez notre support.'
    },
    {
      category: 'payment',
      question: 'Puis-je annuler un vote ?',
      answer: 'Non, les votes sont définitifs une fois le paiement validé. Assurez-vous de vouloir voter avant de confirmer.'
    },

    // Sécurité
    {
      category: 'security',
      question: 'Mes données sont-elles sécurisées ?',
      answer: 'Oui. Nous utilisons le cryptage SSL/TLS pour toutes les communications, et vos données personnelles sont stockées de manière sécurisée conformément au RGPD.'
    },
    {
      category: 'security',
      question: 'Comment signaler un contenu inapproprié ?',
      answer: 'Cliquez sur les trois points (...) sur une vidéo, puis "Signaler". Choisissez la raison et ajoutez des détails. Notre équipe examinera le signalement sous 24h.'
    },
    {
      category: 'security',
      question: 'Comment activer l\'authentification à deux facteurs (2FA) ?',
      answer: 'Allez dans Paramètres > Sécurité > Authentification à deux facteurs. Activez l\'option et suivez les instructions pour configurer via SMS ou application d\'authentification.'
    },
    {
      category: 'security',
      question: 'Que faire si mon compte est piraté ?',
      answer: 'Changez immédiatement votre mot de passe via "Mot de passe oublié", contactez notre support à support@spotlightlover.cm, et vérifiez les activités suspectes dans l\'historique.'
    }
  ];

  const toggleQuestion = (index) => {
    setExpandedQuestions(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const filteredFAQs = faqData.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch = searchTerm === '' ||
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="faq-page">
      {/* Hero */}
      <section className="faq-hero">
        <h1 className="hero-title">
          <FaQuestionCircle className="title-icon" />
          Questions Fréquentes
        </h1>
        <p className="hero-subtitle">
          Trouvez rapidement des réponses à vos questions
        </p>
      </section>

      <div className="faq-container">
        {/* Search Bar */}
        <div className="search-section">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Rechercher une question..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="categories-section">
          {categories.map(category => (
            <button
              key={category.id}
              className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.icon}
              <span>{category.name}</span>
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <div className="faq-list">
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map((faq, index) => (
              <div
                key={index}
                className={`faq-item ${expandedQuestions.includes(index) ? 'expanded' : ''}`}
              >
                <button
                  className="faq-question-btn"
                  onClick={() => toggleQuestion(index)}
                >
                  <span className="question-text">{faq.question}</span>
                  <span className="question-icon">
                    {expandedQuestions.includes(index) ? <FaChevronUp /> : <FaChevronDown />}
                  </span>
                </button>
                {expandedQuestions.includes(index) && (
                  <div className="faq-answer">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="no-results">
              <FaQuestionCircle className="no-results-icon" />
              <p>Aucune question trouvée pour "{searchTerm}"</p>
              <p className="no-results-sub">Essayez avec d'autres mots-clés ou contactez-nous</p>
            </div>
          )}
        </div>

        {/* Contact CTA */}
        <div className="faq-cta">
          <h3 className="cta-title">Vous ne trouvez pas votre réponse ?</h3>
          <p className="cta-description">
            Notre équipe de support est là pour vous aider
          </p>
          <a href="/contact" className="cta-btn">
            Nous contacter
          </a>
        </div>
      </div>
    </div>
  );
}

export default FAQ;
