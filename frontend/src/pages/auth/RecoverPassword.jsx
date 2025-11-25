import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as authService from '../../services/auth.service';
import './Auth.css';

const RecoverPassword = () => {
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1); // 1: Email, 2: Code, 3: New Password
  const [formData, setFormData] = useState({
    email: '',
    code: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Step 1: Request reset code
  const handleStep1Submit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    
    if (!formData.email) {
      setErrors({ email: 'Email requis' });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await authService.requestPasswordReset(formData.email);
      setSuccessMessage('Code de vérification envoyé à votre email !');
      setTimeout(() => setStep(2), 2000);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Erreur lors de l\'envoi du code');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify code
  const handleStep2Submit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    
    if (!formData.code) {
      setErrors({ code: 'Code requis' });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await authService.verifyResetCode(formData.email, formData.code);
      setSuccessMessage('Code vérifié avec succès !');
      setTimeout(() => setStep(3), 1500);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Code invalide ou expiré');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Reset password
  const handleStep3Submit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    
    const newErrors = {};
    
    if (!formData.newPassword) {
      newErrors.newPassword = 'Mot de passe requis';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Minimum 6 caractères';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirmation requise';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsLoading(true);
    
    try {
      await authService.resetPassword(formData.email, formData.code, formData.newPassword);
      setSuccessMessage('Mot de passe réinitialisé avec succès ! Redirection...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Erreur lors de la réinitialisation');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="auth-page recover-password-page">
      <div className="auth-container fade-in">
        <div className="auth-card card">
          {/* Logo */}
          <div className="auth-logo">
            <span className="logo-icon twinkle glow">⭐</span>
            <h1 className="glow">Spotlight Lover</h1>
          </div>
          
          {/* Titre */}
          <h2 className="auth-title">Récupération mot de passe</h2>
          <p className="auth-subtitle">
            {step === 1 && 'Étape 1/3 : Entrez votre email'}
            {step === 2 && 'Étape 2/3 : Vérifiez votre code'}
            {step === 3 && 'Étape 3/3 : Nouveau mot de passe'}
          </p>
          
          {/* Progress bar */}
          <div className="progress-bar">
            <div className={`progress-step ${step >= 1 ? 'active' : ''}`}></div>
            <div className={`progress-step ${step >= 2 ? 'active' : ''}`}></div>
            <div className={`progress-step ${step >= 3 ? 'active' : ''}`}></div>
          </div>
          
          {/* Messages */}
          {errorMessage && (
            <div className="alert alert-error shake">
              {errorMessage}
            </div>
          )}
          
          {successMessage && (
            <div className="alert alert-success fade-in">
              {successMessage}
            </div>
          )}
          
          {/* Step 1: Email */}
          {step === 1 && (
            <form onSubmit={handleStep1Submit} className="auth-form">
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
              
              <button
                type="submit"
                className="btn btn-primary btn-lg w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner spinner-sm"></span>
                    Envoi...
                  </>
                ) : (
                  <>📧 Envoyer le code</>
                )}
              </button>
            </form>
          )}
          
          {/* Step 2: Code */}
          {step === 2 && (
            <form onSubmit={handleStep2Submit} className="auth-form">
              <div className="form-group">
                <label htmlFor="code">Code de vérification</label>
                <input
                  type="text"
                  id="code"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  placeholder="123456"
                  className={errors.code ? 'error' : ''}
                  maxLength="6"
                />
                {errors.code && <span className="error-message">{errors.code}</span>}
                <p className="text-sm text-gray">
                  Un code à 6 chiffres a été envoyé à {formData.email}
                </p>
              </div>
              
              <button
                type="submit"
                className="btn btn-primary btn-lg w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner spinner-sm"></span>
                    Vérification...
                  </>
                ) : (
                  <>✅ Vérifier le code</>
                )}
              </button>
            </form>
          )}
          
          {/* Step 3: New Password */}
          {step === 3 && (
            <form onSubmit={handleStep3Submit} className="auth-form">
              <div className="form-group">
                <label htmlFor="newPassword">Nouveau mot de passe</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={errors.newPassword ? 'error' : ''}
                  autoComplete="new-password"
                />
                {errors.newPassword && <span className="error-message">{errors.newPassword}</span>}
              </div>
              
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
              
              <button
                type="submit"
                className="btn btn-primary btn-lg w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner spinner-sm"></span>
                    Réinitialisation...
                  </>
                ) : (
                  <>🔒 Réinitialiser</>
                )}
              </button>
            </form>
          )}
          
          {/* Footer */}
          <div className="auth-footer">
            <p>
              <Link to="/login" className="link-primary">
                ← Retour à la connexion
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecoverPassword;
