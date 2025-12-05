import { useState } from 'react';
import { FaFileContract, FaShieldAlt, FaUserShield, FaCookie } from 'react-icons/fa';
import './Legal.css';

/**
 * Legal - Page des mentions légales, CGU, Politique de confidentialité
 */
function Legal() {
  const [activeTab, setActiveTab] = useState('terms');

  const tabs = [
    { id: 'terms', name: 'Conditions d\'Utilisation', icon: <FaFileContract /> },
    { id: 'privacy', name: 'Politique de Confidentialité', icon: <FaUserShield /> },
    { id: 'cookies', name: 'Politique des Cookies', icon: <FaCookie /> },
    { id: 'mentions', name: 'Mentions Légales', icon: <FaShieldAlt /> }
  ];

  return (
    <div className="legal-page">
      {/* Hero */}
      <section className="legal-hero">
        <h1 className="hero-title">Informations Légales</h1>
        <p className="hero-subtitle">
          Transparence et conformité RGPD
        </p>
      </section>

      <div className="legal-container">
        {/* Navigation Tabs */}
        <nav className="legal-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>

        {/* Content */}
        <div className="legal-content">
          {/* Conditions d'Utilisation */}
          {activeTab === 'terms' && (
            <section className="legal-section">
              <h2 className="section-title">Conditions Générales d'Utilisation (CGU)</h2>
              <p className="update-date">Dernière mise à jour : 01/12/2024</p>

              <div className="legal-text">
                <h3>1. Acceptation des Conditions</h3>
                <p>
                  En accédant et en utilisant Spotlight Lover (ci-après "la Plateforme"), vous acceptez 
                  d'être lié par ces Conditions Générales d'Utilisation. Si vous n'acceptez pas ces conditions, 
                  veuillez ne pas utiliser la Plateforme.
                </p>

                <h3>2. Présentation du Service</h3>
                <p>
                  Spotlight Lover est une plateforme camerounaise de partage de vidéos courtes avec système 
                  de votes payants via Mobile Money (MTN et Orange). Les créateurs peuvent publier du contenu 
                  et être rémunérés via les votes des utilisateurs.
                </p>

                <h3>3. Inscription et Compte Utilisateur</h3>
                <ul>
                  <li>Vous devez avoir au moins 18 ans ou avoir l'autorisation parentale</li>
                  <li>Les informations fournies doivent être exactes et à jour</li>
                  <li>Vous êtes responsable de la confidentialité de vos identifiants</li>
                  <li>Un compte par personne/entité</li>
                  <li>Nous nous réservons le droit de suspendre ou supprimer tout compte</li>
                </ul>

                <h3>4. Contenu Utilisateur</h3>
                <h4>4.1 Publications</h4>
                <ul>
                  <li>Vous conservez tous les droits sur votre contenu</li>
                  <li>Vous accordez à Spotlight Lover une licence mondiale non-exclusive pour diffuser votre contenu</li>
                  <li>Durée maximale des vidéos : 2 minutes (120 secondes)</li>
                  <li>Formats acceptés : MP4, MOV, AVI</li>
                  <li>Taille maximale : 100 MB</li>
                </ul>

                <h4>4.2 Contenu Interdit</h4>
                <p>Il est strictement interdit de publier :</p>
                <ul>
                  <li>Contenu pornographique ou sexuellement explicite</li>
                  <li>Contenu violent, haineux ou discriminatoire</li>
                  <li>Contenu portant atteinte aux droits d'auteur</li>
                  <li>Fausses informations ou désinformation</li>
                  <li>Harcèlement, intimidation ou menaces</li>
                  <li>Promotion d'activités illégales</li>
                </ul>

                <h3>5. Système de Votes et Paiements</h3>
                <h4>5.1 Votes</h4>
                <ul>
                  <li>Montants de vote : 100 FCFA, 250 FCFA, 500 FCFA</li>
                  <li>Paiement via MTN Mobile Money ou Orange Money</li>
                  <li>Les votes sont définitifs et non remboursables</li>
                </ul>

                <h4>5.2 Rémunération des Créateurs</h4>
                <ul>
                  <li>70% de chaque vote revient au créateur</li>
                  <li>30% de commission plateforme (incluant frais de traitement)</li>
                  <li>Retrait minimum : 5 000 FCFA</li>
                  <li>Délai de traitement : 3 à 5 jours ouvrables</li>
                  <li>Frais Mobile Money à la charge de l'utilisateur</li>
                </ul>

                <h3>6. Modération et Sanctions</h3>
                <p>Nous nous réservons le droit de :</p>
                <ul>
                  <li>Modérer tout contenu avant ou après publication</li>
                  <li>Supprimer tout contenu non conforme</li>
                  <li>Suspendre ou bannir tout compte enfreignant les règles</li>
                  <li>Refuser tout paiement en cas de fraude détectée</li>
                </ul>

                <h3>7. Propriété Intellectuelle</h3>
                <p>
                  Tous les éléments de la Plateforme (logo, design, code source) sont la propriété exclusive 
                  de Spotlight Lover et protégés par les lois sur la propriété intellectuelle.
                </p>

                <h3>8. Limitation de Responsabilité</h3>
                <p>
                  Spotlight Lover ne peut être tenu responsable de :
                </p>
                <ul>
                  <li>La qualité ou l'exactitude du contenu publié par les utilisateurs</li>
                  <li>Les pertes financières liées à l'utilisation de la Plateforme</li>
                  <li>Les interruptions de service temporaires</li>
                  <li>Les problèmes de paiement Mobile Money indépendants de notre contrôle</li>
                </ul>

                <h3>9. Modifications des CGU</h3>
                <p>
                  Nous nous réservons le droit de modifier ces CGU à tout moment. 
                  Les utilisateurs seront notifiés des changements majeurs.
                </p>

                <h3>10. Droit Applicable et Juridiction</h3>
                <p>
                  Ces CGU sont régies par le droit camerounais. Tout litige relève de la compétence 
                  exclusive des tribunaux de Douala, Cameroun.
                </p>
              </div>
            </section>
          )}

          {/* Politique de Confidentialité */}
          {activeTab === 'privacy' && (
            <section className="legal-section">
              <h2 className="section-title">Politique de Confidentialité</h2>
              <p className="update-date">Dernière mise à jour : 01/12/2024</p>

              <div className="legal-text">
                <h3>1. Introduction</h3>
                <p>
                  Spotlight Lover s'engage à protéger la confidentialité de vos données personnelles 
                  conformément au Règlement Général sur la Protection des Données (RGPD).
                </p>

                <h3>2. Données Collectées</h3>
                <h4>2.1 Données d'Inscription</h4>
                <ul>
                  <li>Nom et prénom</li>
                  <li>Adresse email</li>
                  <li>Numéro de téléphone (format camerounais)</li>
                  <li>Mot de passe (crypté)</li>
                </ul>

                <h4>2.2 Données d'Utilisation</h4>
                <ul>
                  <li>Vidéos publiées</li>
                  <li>Votes donnés et reçus</li>
                  <li>Historique de navigation</li>
                  <li>Interactions (likes, commentaires, partages)</li>
                  <li>Adresse IP et données de connexion</li>
                </ul>

                <h4>2.3 Données de Paiement</h4>
                <ul>
                  <li>Numéro Mobile Money (MTN ou Orange)</li>
                  <li>Historique des transactions</li>
                  <li>Montants des votes et retraits</li>
                </ul>

                <h3>3. Utilisation des Données</h3>
                <p>Vos données sont utilisées pour :</p>
                <ul>
                  <li>Fournir et améliorer nos services</li>
                  <li>Traiter les paiements et votes</li>
                  <li>Personnaliser votre expérience</li>
                  <li>Lutter contre la fraude</li>
                  <li>Vous envoyer des notifications importantes</li>
                  <li>Respecter nos obligations légales</li>
                </ul>

                <h3>4. Partage des Données</h3>
                <p>
                  Nous ne vendons jamais vos données. Elles peuvent être partagées avec :
                </p>
                <ul>
                  <li>Prestataires de paiement (MeSomb, MTN, Orange)</li>
                  <li>Services d'hébergement et d'infrastructure (Cloudflare, AWS)</li>
                  <li>Autorités légales sur demande judiciaire</li>
                </ul>

                <h3>5. Conservation des Données</h3>
                <ul>
                  <li>Données de compte : Durée de vie du compte + 1 an après suppression</li>
                  <li>Données de paiement : 5 ans (obligation légale comptable)</li>
                  <li>Logs de connexion : 1 an maximum</li>
                </ul>

                <h3>6. Vos Droits (RGPD)</h3>
                <p>Vous disposez des droits suivants :</p>
                <ul>
                  <li><strong>Droit d'accès :</strong> Obtenir une copie de vos données</li>
                  <li><strong>Droit de rectification :</strong> Corriger vos données inexactes</li>
                  <li><strong>Droit à l'effacement :</strong> Supprimer vos données ("droit à l'oubli")</li>
                  <li><strong>Droit à la portabilité :</strong> Récupérer vos données dans un format lisible</li>
                  <li><strong>Droit d'opposition :</strong> Refuser certains traitements</li>
                  <li><strong>Droit de limitation :</strong> Restreindre le traitement de vos données</li>
                </ul>

                <p>
                  Pour exercer vos droits, contactez-nous à : <strong>privacy@spotlightlover.cm</strong>
                </p>

                <h3>7. Sécurité</h3>
                <p>Nous mettons en œuvre :</p>
                <ul>
                  <li>Cryptage SSL/TLS pour toutes les communications</li>
                  <li>Stockage sécurisé des mots de passe (hashing bcrypt)</li>
                  <li>Authentification à deux facteurs (2FA) disponible</li>
                  <li>Audits de sécurité réguliers</li>
                  <li>Surveillance anti-fraude en temps réel</li>
                </ul>

                <h3>8. Cookies et Technologies Similaires</h3>
                <p>
                  Nous utilisons des cookies essentiels pour le fonctionnement de la Plateforme 
                  et des cookies analytiques avec votre consentement. Voir notre Politique des Cookies.
                </p>

                <h3>9. Contact</h3>
                <p>
                  Pour toute question sur cette politique :<br />
                  Email : <strong>privacy@spotlightlover.cm</strong><br />
                  Adresse : Douala, Cameroun
                </p>
              </div>
            </section>
          )}

          {/* Politique des Cookies */}
          {activeTab === 'cookies' && (
            <section className="legal-section">
              <h2 className="section-title">Politique des Cookies</h2>
              <p className="update-date">Dernière mise à jour : 01/12/2024</p>

              <div className="legal-text">
                <h3>1. Qu'est-ce qu'un Cookie ?</h3>
                <p>
                  Un cookie est un petit fichier texte stocké sur votre appareil lors de votre visite 
                  sur notre site web. Il permet de mémoriser vos préférences et d'améliorer votre expérience.
                </p>

                <h3>2. Types de Cookies Utilisés</h3>
                
                <h4>2.1 Cookies Essentiels (Obligatoires)</h4>
                <p>Nécessaires au fonctionnement du site :</p>
                <ul>
                  <li><strong>auth_token</strong> : Maintien de votre session connectée (JWT)</li>
                  <li><strong>refresh_token</strong> : Renouvellement automatique de session</li>
                  <li><strong>csrf_token</strong> : Protection contre les attaques CSRF</li>
                  <li><strong>Durée :</strong> Session ou 15 jours (si "Se souvenir de moi")</li>
                </ul>

                <h4>2.2 Cookies de Performance (Avec consentement)</h4>
                <p>Analyse de l'utilisation du site :</p>
                <ul>
                  <li><strong>_ga, _gid</strong> : Google Analytics (statistiques de visite)</li>
                  <li><strong>Durée :</strong> 2 ans (_ga) / 24 heures (_gid)</li>
                </ul>

                <h4>2.3 Cookies Fonctionnels (Avec consentement)</h4>
                <ul>
                  <li><strong>theme_preference</strong> : Mode clair/sombre</li>
                  <li><strong>language</strong> : Préférence de langue</li>
                  <li><strong>video_quality</strong> : Qualité vidéo préférée</li>
                  <li><strong>Durée :</strong> 1 an</li>
                </ul>

                <h3>3. Cookies Tiers</h3>
                <ul>
                  <li><strong>Cloudflare</strong> : Protection DDoS et CDN (__cflb, __cf_bm)</li>
                  <li><strong>MeSomb</strong> : Traitement des paiements Mobile Money</li>
                </ul>

                <h3>4. Gestion des Cookies</h3>
                <p>Vous pouvez gérer vos préférences de cookies :</p>
                <ul>
                  <li>Via le bandeau de consentement lors de votre première visite</li>
                  <li>Dans Paramètres &gt; Confidentialité &gt; Cookies</li>
                  <li>Via les paramètres de votre navigateur</li>
                </ul>

                <h3>5. Désactiver les Cookies</h3>
                <p>
                  Vous pouvez désactiver les cookies dans votre navigateur, mais cela peut affecter 
                  le fonctionnement du site (impossibilité de se connecter, perte de préférences).
                </p>

                <h4>Instructions par navigateur :</h4>
                <ul>
                  <li><strong>Chrome :</strong> Paramètres &gt; Confidentialité &gt; Cookies</li>
                  <li><strong>Firefox :</strong> Paramètres &gt; Vie privée &gt; Cookies</li>
                  <li><strong>Safari :</strong> Préférences &gt; Confidentialité</li>
                  <li><strong>Edge :</strong> Paramètres &gt; Cookies et autorisations</li>
                </ul>

                <h3>6. Contact</h3>
                <p>
                  Questions sur les cookies ? Contactez-nous à <strong>privacy@spotlightlover.cm</strong>
                </p>
              </div>
            </section>
          )}

          {/* Mentions Légales */}
          {activeTab === 'mentions' && (
            <section className="legal-section">
              <h2 className="section-title">Mentions Légales</h2>
              <p className="update-date">Dernière mise à jour : 01/12/2024</p>

              <div className="legal-text">
                <h3>1. Éditeur du Site</h3>
                <p>
                  <strong>Spotlight Lover</strong><br />
                  Plateforme de partage vidéo et système de votes<br />
                  Siège social : Douala, Cameroun<br />
                  Email : <strong>contact@spotlightlover.cm</strong><br />
                  Téléphone : <strong>+237 6XX XX XX XX</strong>
                </p>

                <h3>2. Directeur de Publication</h3>
                <p>
                  [Nom du responsable légal]<br />
                  Email : <strong>legal@spotlightlover.cm</strong>
                </p>

                <h3>3. Hébergement</h3>
                <p>
                  <strong>Hébergeur Web :</strong><br />
                  [Nom de l'hébergeur]<br />
                  Adresse : [Adresse complète]<br />
                  Téléphone : [Numéro]
                </p>

                <p>
                  <strong>Services Cloud :</strong><br />
                  Cloudflare, Inc.<br />
                  101 Townsend St, San Francisco, CA 94107, USA<br />
                  <a href="https://www.cloudflare.com" target="_blank" rel="noopener noreferrer">www.cloudflare.com</a>
                </p>

                <h3>4. Propriété Intellectuelle</h3>
                <p>
                  L'ensemble du contenu de ce site (textes, images, vidéos, logos, graphismes, code source) 
                  est la propriété exclusive de Spotlight Lover et est protégé par les lois sur la propriété 
                  intellectuelle camerounaises et internationales.
                </p>
                <p>
                  Toute reproduction, distribution ou utilisation sans autorisation préalable est strictement interdite 
                  et peut entraîner des poursuites judiciaires.
                </p>

                <h3>5. Crédits</h3>
                <ul>
                  <li><strong>Technologies :</strong> React, Node.js, Express, PostgreSQL, Prisma</li>
                  <li><strong>Icônes :</strong> React Icons (Font Awesome)</li>
                  <li><strong>Paiements :</strong> MeSomb API (MTN & Orange Money)</li>
                  <li><strong>Stockage Vidéo :</strong> Cloudflare R2</li>
                </ul>

                <h3>6. Liens Externes</h3>
                <p>
                  La Plateforme peut contenir des liens vers des sites tiers. 
                  Spotlight Lover n'est pas responsable du contenu ou des pratiques de ces sites externes.
                </p>

                <h3>7. Signalement de Contenu Illicite</h3>
                <p>
                  Conformément à la législation camerounaise, tout utilisateur peut signaler un contenu 
                  illicite ou inapproprié en utilisant le bouton "Signaler" sur chaque vidéo ou en nous contactant à :
                </p>
                <p>
                  <strong>abuse@spotlightlover.cm</strong>
                </p>

                <h3>8. Données Légales Complémentaires</h3>
                <p>
                  <strong>Numéro d'identification fiscale :</strong> [À compléter]<br />
                  <strong>Registre du Commerce :</strong> [À compléter]<br />
                  <strong>Capital social :</strong> [À compléter]
                </p>

                <h3>9. Médiateur de la Consommation</h3>
                <p>
                  En cas de litige, vous pouvez recourir à un médiateur de la consommation.<br />
                  Coordonnées : [À compléter si applicable]
                </p>

                <h3>10. Contact Légal</h3>
                <p>
                  Pour toute question juridique :<br />
                  Email : <strong>legal@spotlightlover.cm</strong><br />
                  Adresse postale : Spotlight Lover, Douala, Cameroun
                </p>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

export default Legal;
