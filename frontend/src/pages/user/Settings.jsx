import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/auth.service';
import './Settings.css';

const Settings = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    voteNotifications: true
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      const response = await authService.changePassword(passwordData);
      if (response.success) {
        alert('✅ Mot de passe changé !');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (err) {
      alert(`❌ Erreur: ${err.message}`);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'SUPPRIMER') {
      alert('❌ Tapez "SUPPRIMER" pour confirmer');
      return;
    }
    try {
      await authService.deleteAccount();
      await logout();
      navigate('/');
    } catch (err) {
      alert(`❌ Erreur: ${err.message}`);
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-container">
        <div className="settings-header">
          <h1>⚙️ Paramètres</h1>
        </div>

        <div className="settings-section">
          <h2>🔒 Changer le mot de passe</h2>
          <form onSubmit={handleChangePassword}>
            <div className="form-group">
              <label>Mot de passe actuel</label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Nouveau mot de passe</label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Confirmer</label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
              />
            </div>
            <button type="submit" className="btn btn-primary">💾 Changer</button>
          </form>
        </div>

        <div className="settings-section">
          <h2>🔔 Notifications</h2>
          <div className="notifications-settings">
            <div className="setting-item">
              <div className="setting-info">
                <h3>📧 Email</h3>
                <p>Recevoir par email</p>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={notifications.emailNotifications}
                  onChange={(e) => setNotifications({...notifications, emailNotifications: e.target.checked})}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>
        </div>

        <div className="settings-section danger-zone">
          <h2>⚠️ Zone dangereuse</h2>
          <div className="danger-content">
            <div className="danger-info">
              <h3>Supprimer le compte</h3>
              <p>Action irréversible</p>
            </div>
            <button className="btn btn-danger" onClick={() => setShowDeleteModal(true)}>
              🗑️ Supprimer
            </button>
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <div className="modal" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>⚠️ Supprimer le compte</h3>
            <p>Tapez "SUPPRIMER" pour confirmer</p>
            <input
              type="text"
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              className="confirmation-input"
            />
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>
                Annuler
              </button>
              <button className="btn btn-danger" onClick={handleDeleteAccount}>
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
