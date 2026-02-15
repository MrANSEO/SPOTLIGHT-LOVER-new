import React, { useEffect, useState } from 'react';
import adminService from '../../services/admin.service';
import './Settings.css';

const DEFAULT_SETTINGS = {
  votePrice: 100,
  candidateRegistrationFee: 500,
  maintenanceMode: false,
  registrationEnabled: true,
  votingEnabled: true,
  maxVideoDurationSeconds: 90,
  platformFee: 0.1,
};

const AdminSettings = () => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadSettings = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await adminService.getSystemSettings();
      setSettings((prev) => ({ ...prev, ...data }));
    } catch {
      setError('Impossible de charger les paramètres système.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const updateNumber = (field, value) => {
    const parsed = Number(value);
    setSettings((prev) => ({
      ...prev,
      [field]: Number.isNaN(parsed) ? 0 : parsed,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError('');
    setMessage('');

    try {
      const payload = {
        votePrice: settings.votePrice,
        candidateRegistrationFee: settings.candidateRegistrationFee,
        maintenanceMode: settings.maintenanceMode,
        registrationEnabled: settings.registrationEnabled,
        votingEnabled: settings.votingEnabled,
        maxVideoDurationSeconds: settings.maxVideoDurationSeconds,
        platformFee: settings.platformFee,
      };

      const updated = await adminService.updateSystemSettings(payload);
      setSettings((prev) => ({ ...prev, ...updated }));
      setMessage('✅ Paramètres sauvegardés avec succès !');
    } catch {
      setError('Échec de sauvegarde des paramètres. Réessayez.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="admin-settings">
        <div className="settings-header">
          <h1>⚙️ Paramètres Système</h1>
        </div>
        <p>Chargement des paramètres...</p>
      </div>
    );
  }

  return (
    <div className="admin-settings">
      <div className="settings-header">
        <h1>⚙️ Paramètres Système</h1>
      </div>

      {error && <p style={{ color: '#ff6b6b' }}>{error}</p>}
      {message && <p style={{ color: '#6bff95' }}>{message}</p>}

      <div className="settings-sections">
        <div className="settings-section">
          <h2>🌐 Général</h2>
          <div className="form-group">
            <label>Prix du vote (FCFA)</label>
            <input
              type="number"
              value={settings.votePrice}
              onChange={(e) => updateNumber('votePrice', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Frais inscription candidat (FCFA)</label>
            <input
              type="number"
              value={settings.candidateRegistrationFee}
              onChange={(e) => updateNumber('candidateRegistrationFee', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Commission plateforme (0 à 1)</label>
            <input
              type="number"
              min="0"
              max="1"
              step="0.01"
              value={settings.platformFee}
              onChange={(e) => updateNumber('platformFee', e.target.value)}
            />
          </div>
        </div>

        <div className="settings-section">
          <h2>🎬 Vidéos</h2>
          <div className="form-group">
            <label>Durée max (secondes)</label>
            <input
              type="number"
              value={settings.maxVideoDurationSeconds}
              onChange={(e) => updateNumber('maxVideoDurationSeconds', e.target.value)}
            />
          </div>
        </div>

        <div className="settings-section">
          <h2>🔧 Système</h2>
          <div className="toggle-group">
            <label>
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
              />
              <span>Mode maintenance</span>
            </label>
          </div>
          <div className="toggle-group">
            <label>
              <input
                type="checkbox"
                checked={settings.registrationEnabled}
                onChange={(e) => setSettings({ ...settings, registrationEnabled: e.target.checked })}
              />
              <span>Inscriptions ouvertes</span>
            </label>
          </div>
          <div className="toggle-group">
            <label>
              <input
                type="checkbox"
                checked={settings.votingEnabled}
                onChange={(e) => setSettings({ ...settings, votingEnabled: e.target.checked })}
              />
              <span>Votes autorisés</span>
            </label>
          </div>
        </div>

        <button className="btn-save" onClick={handleSave} disabled={isSaving}>
          {isSaving ? '⏳ Sauvegarde...' : '💾 Sauvegarder'}
        </button>
      </div>
    </div>
  );
};

export default AdminSettings;
