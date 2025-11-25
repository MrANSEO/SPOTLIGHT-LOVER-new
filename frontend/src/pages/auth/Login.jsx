import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const validateForm = () => {
    const newErrors = {};
    
    // Valider email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email requis';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }
    
    // Valider password
    if (!formData.password) {
      newErrors.password = 'Mot de passe requis';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Minimum 6 caractères';
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
      const result = await login(formData.email, formData.password, formData.rememberMe);
      
      if (result.success) {
        navigate('/feed'); // Redirect vers Feed après login
      } else {
        setErrorMessage(result.error || 'Erreur de connexion');
      }
    } catch (error) {
      setErrorMessage('Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    
    // Effacer erreur du champ modifié
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="auth-page login-page">
      <div className="auth-container fade-in">
        <div className="auth-card card">
          {/* Logo */}
          <div className="auth-logo">
            <span className="logo-icon twinkle glow">⭐</span>
            <h1 className="glow">Spotlight Lover</h1>
          </div>
          
          {/* Titre */}
          <h2 className="auth-title">Connexion</h2>
          <p className="auth-subtitle">Bon retour parmi nous ! 👋</p>
          
          {/* Message d'erreur global */}
          {errorMessage && (
            <div className="alert alert-error shake">
              {errorMessage}
            </div>
          )}
          
          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="auth-form">
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
                autoComplete="current-password"
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>
            
            {/* Remember me + Forgot password */}
            <div className="form-row">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />
                <span>Se souvenir de moi</span>
              </label>
              
              <Link to="/recover-password" className="link-primary">
                Mot de passe oublié ?
              </Link>
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
                  Connexion...
                </>
              ) : (
                <>🔐 Se connecter</>
              )}
            </button>
          </form>
          
          {/* Lien inscription */}
          <div className="auth-footer">
            <p>
              Pas encore de compte ?{' '}
              <Link to="/register" className="link-primary">
                S'inscrire gratuitement
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
