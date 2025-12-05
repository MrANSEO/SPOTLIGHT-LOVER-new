import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { videosService } from '../../services/videos.service';
import './Upload.css';

const Upload = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    participantName: user?.name || '',
    participantPhone: user?.phone || '',
    participantEmail: user?.email || '',
    videoFile: null,
    acceptTerms: false
  });

  const [videoPreview, setVideoPreview] = useState(null);

  const categories = [
    { value: 'dance', label: '💃 Danse' },
    { value: 'music', label: '🎵 Musique' },
    { value: 'comedy', label: '😂 Comédie' },
    { value: 'talent', label: '🎭 Talent' }
  ];

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({...formData, videoFile: file});
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const uploadData = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key]) uploadData.append(key, formData[key]);
      });
      
      const response = await videosService.uploadVideo(uploadData);
      if (response.success) {
        alert('✅ Vidéo soumise !');
        navigate('/profile');
      }
    } catch (err) {
      alert(`❌ Erreur: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-page">
      <div className="upload-container">
        <h1>📤 Soumettre une vidéo</h1>
        
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${(step/3)*100}%` }}></div>
          <div className="progress-steps">
            <div className={`step ${step >= 1 ? 'active' : ''}`}>
              <span>1</span><span>Vidéo</span>
            </div>
            <div className={`step ${step >= 2 ? 'active' : ''}`}>
              <span>2</span><span>Info</span>
            </div>
            <div className={`step ${step >= 3 ? 'active' : ''}`}>
              <span>3</span><span>Confirmer</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div>
              <h2>🎬 Votre vidéo</h2>
              {!videoPreview ? (
                <div className="upload-zone">
                  <label htmlFor="video">
                    <span>🎥</span>
                    <span>Cliquez pour uploader</span>
                    <input id="video" type="file" accept="video/*" onChange={handleVideoChange} style={{display:'none'}} />
                  </label>
                </div>
              ) : (
                <video src={videoPreview} controls style={{width:'100%', borderRadius:'12px'}} />
              )}
              
              <div className="form-group">
                <label>Titre *</label>
                <input
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Titre accrocheur..."
                />
              </div>

              <div className="form-group">
                <label>Catégorie *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option value="">Sélectionner...</option>
                  {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>

              <button type="button" className="btn btn-primary" onClick={() => setStep(2)}>
                Suivant →
              </button>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2>👤 Vos informations</h2>
              <div className="form-group">
                <label>Nom *</label>
                <input
                  value={formData.participantName}
                  onChange={(e) => setFormData({...formData, participantName: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Téléphone *</label>
                <input
                  value={formData.participantPhone}
                  onChange={(e) => setFormData({...formData, participantPhone: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={formData.participantEmail}
                  onChange={(e) => setFormData({...formData, participantEmail: e.target.value})}
                />
              </div>
              <button type="button" className="btn btn-secondary" onClick={() => setStep(1)}>
                ← Retour
              </button>
              <button type="button" className="btn btn-primary" onClick={() => setStep(3)}>
                Suivant →
              </button>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2>✅ Confirmation</h2>
              <div className="summary-box">
                <p><strong>Titre:</strong> {formData.title}</p>
                <p><strong>Catégorie:</strong> {formData.category}</p>
                <p><strong>Participant:</strong> {formData.participantName}</p>
              </div>
              
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.acceptTerms}
                  onChange={(e) => setFormData({...formData, acceptTerms: e.target.checked})}
                />
                <span>J'accepte les conditions</span>
              </label>

              <button type="button" className="btn btn-secondary" onClick={() => setStep(2)}>
                ← Retour
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? '📤 Envoi...' : '🚀 Soumettre'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Upload;
