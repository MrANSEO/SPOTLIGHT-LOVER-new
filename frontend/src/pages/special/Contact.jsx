import { useState } from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaFacebook, FaTwitter, FaInstagram, FaPaperPlane } from 'react-icons/fa';
import './Contact.css';

/**
 * Contact - Page de contact avec formulaire et informations
 */
function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // TODO: Implémenter l'envoi réel du formulaire via API
      // await api.post('/contact', formData);
      
      // Simulation d'envoi
      await new Promise(resolve => setTimeout(resolve, 2000));

      setSubmitStatus({
        type: 'success',
        message: 'Message envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.'
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'Une erreur est survenue. Veuillez réessayer.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: <FaEnvelope />,
      title: 'Email',
      content: 'contact@spotlightlover.cm',
      link: 'mailto:contact@spotlightlover.cm'
    },
    {
      icon: <FaPhone />,
      title: 'Téléphone',
      content: '+237 6XX XX XX XX',
      link: 'tel:+2376XXXXXXXX'
    },
    {
      icon: <FaMapMarkerAlt />,
      title: 'Localisation',
      content: 'Douala, Cameroun',
      link: null
    }
  ];

  const socialLinks = [
    { icon: <FaFacebook />, name: 'Facebook', url: '#' },
    { icon: <FaTwitter />, name: 'Twitter', url: '#' },
    { icon: <FaInstagram />, name: 'Instagram', url: '#' }
  ];

  const faqItems = [
    {
      question: 'Quel est le délai de réponse ?',
      answer: 'Nous répondons généralement sous 24-48 heures ouvrables.'
    },
    {
      question: 'Comment signaler un problème urgent ?',
      answer: 'Pour les problèmes urgents, contactez-nous directement par téléphone.'
    },
    {
      question: 'Puis-je prendre rendez-vous ?',
      answer: 'Oui, contactez-nous par email pour prendre rendez-vous.'
    }
  ];

  return (
    <div className="contact-page">
      {/* Hero */}
      <section className="contact-hero">
        <h1 className="hero-title">Nous Contacter</h1>
        <p className="hero-subtitle">
          Une question ? Un problème ? Notre équipe est là pour vous aider.
        </p>
      </section>

      <div className="contact-container">
        {/* Contact Info Cards */}
        <section className="contact-info-section">
          <div className="info-cards">
            {contactInfo.map((info, index) => (
              <div key={index} className="info-card">
                <div className="info-icon">{info.icon}</div>
                <h3 className="info-title">{info.title}</h3>
                {info.link ? (
                  <a href={info.link} className="info-content link">
                    {info.content}
                  </a>
                ) : (
                  <p className="info-content">{info.content}</p>
                )}
              </div>
            ))}
          </div>
        </section>

        <div className="contact-content">
          {/* Contact Form */}
          <section className="contact-form-section">
            <h2 className="section-title">Envoyez-nous un message</h2>
            
            {submitStatus && (
              <div className={`alert alert-${submitStatus.type}`}>
                {submitStatus.message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name" className="form-label">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-input"
                    required
                    placeholder="Votre nom"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input"
                    required
                    placeholder="votre@email.com"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone" className="form-label">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="+237 6XX XX XX XX"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="subject" className="form-label">
                    Sujet *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="form-input"
                    required
                  >
                    <option value="">Sélectionnez un sujet</option>
                    <option value="general">Question générale</option>
                    <option value="technical">Support technique</option>
                    <option value="payment">Paiement / Votes</option>
                    <option value="content">Modération de contenu</option>
                    <option value="partnership">Partenariat</option>
                    <option value="other">Autre</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="message" className="form-label">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="form-textarea"
                  rows="6"
                  required
                  placeholder="Décrivez votre demande en détail..."
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>Envoi en cours...</>
                ) : (
                  <>
                    <FaPaperPlane className="btn-icon" />
                    Envoyer le message
                  </>
                )}
              </button>
            </form>
          </section>

          {/* Sidebar */}
          <aside className="contact-sidebar">
            {/* Social Links */}
            <div className="sidebar-card">
              <h3 className="sidebar-title">Suivez-nous</h3>
              <div className="social-links">
                {socialLinks.map((social, index) => (
                  <a 
                    key={index} 
                    href={social.url} 
                    className="social-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {social.icon}
                    <span>{social.name}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* FAQ */}
            <div className="sidebar-card">
              <h3 className="sidebar-title">Questions fréquentes</h3>
              <div className="faq-list">
                {faqItems.map((item, index) => (
                  <div key={index} className="faq-item">
                    <h4 className="faq-question">{item.question}</h4>
                    <p className="faq-answer">{item.answer}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Office Hours */}
            <div className="sidebar-card">
              <h3 className="sidebar-title">Horaires</h3>
              <div className="hours-list">
                <div className="hour-item">
                  <span className="hour-day">Lun - Ven</span>
                  <span className="hour-time">8h - 18h</span>
                </div>
                <div className="hour-item">
                  <span className="hour-day">Samedi</span>
                  <span className="hour-time">9h - 14h</span>
                </div>
                <div className="hour-item">
                  <span className="hour-day">Dimanche</span>
                  <span className="hour-time">Fermé</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default Contact;
