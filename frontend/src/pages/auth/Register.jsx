import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const validateForm = () => {
    const newErrors = {};
    
    // Valider nom
    if (!formData.name) {
      newErrors.name = 'Nom requis';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Minimum 2 caractères';
    }
    
    // Valider email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email requis';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }
    
    // Valider phone (Cameroun format)
    const phoneRegex = /^(237)?[26]\d{8}$/;
    if (!formData.phone) {
      newErrors.phone = 'Téléphone requis';
    } else if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Format: 237XXXXXXXXX ou 6XXXXXXXX';
    }
    
    // Valider password
    if (!formData.password) {
      newErrors.password = 'Mot de passe requis';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Minimum 6 caractères';
    }
    
    // Valider confirmation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirmation requise';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const result = await register(
        formData.name,
        formData.email,
        formData.phone,
        formData.password
      );
      
      if (result.success) {
        navigate('/feed'); // Auto-login après inscription
      } else {
        setErrorMessage(result.error || "Erreur lors de l'inscription");
      }
    } catch (error) {
      setErrorMessage('Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Effacer erreur du champ modifié
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="auth-page register-page">
      <div className="auth-container fade-in">
        <div className="auth-card card">
          {/* Logo */}
          <div className="auth-logo">
            <span className="logo-icon twinkle glow">⭐</span>
            <h1 className="glow">Spotlight Lover</h1>
          </div>
          
          {/* Titre */}
          <h2 className="auth-title">Inscription</h2>
          <p className="auth-subtitle">Rejoins la communauté ! ✨</p>
          
          {/* Message d'erreur global */}
          {errorMessage && (
            <div className="alert alert-error shake">
              {errorMessage}
            </div>
          )}
          
          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="auth-form">
            {/* Nom */}
            <div className="form-group">
              <label htmlFor="name">Nom complet</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className={errors.name ? 'error' : ''}
                autoComplete="name"
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>
            
            {/* Email */}
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="exemple@email.com"
                className={errors.email ? 'error' : ''}
                autoComplete="email"
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
            
            {/* Phone */}
            <div className="form-group">
              <label htmlFor="phone">Téléphone (Cameroun)</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="237XXXXXXXXX ou 6XXXXXXXX"
                className={errors.phone ? 'error' : ''}
                autoComplete="tel"
              />
              {errors.phone && <span className="error-message">{errors.phone}</span>}
            </div>
            
            {/* Password */}
            <div className="form-group">
              <label htmlFor="password">Mot de passe</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={errors.password ? 'error' : ''}
                autoComplete="new-password"
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>
            
            {/* Confirm Password */}
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmer mot de passe</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className={errors.confirmPassword ? 'error' : ''}
                autoComplete="new-password"
              />
              {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
            </div>
            
            {/* Submit button */}
            <button
              type="submit"
              className="btn btn-primary btn-lg w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner spinner-sm"></span>
                  Inscription...
                </>
              ) : (
                <>✨ S'inscrire</>
              )}
            </button>
          </form>
          
          {/* Lien connexion */}
          <div className="auth-footer">
            <p>
              Déjà un compte ?{' '}
              <Link to="/login" className="link-primary">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
