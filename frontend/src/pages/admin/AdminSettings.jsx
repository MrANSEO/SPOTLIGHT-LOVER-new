import React, { useState } from 'react';
import './AdminSettings.css';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    siteName: 'Spotlight Lover',
    votePrice: 100,
    maxVideoDuration: 180,
    moderationEnabled: true,
    maintenanceMode: false
  });

  const handleSave = () => {
    alert('✅ Paramètres sauvegardés !');
  };

  return (
    <div className="admin-settings">
      <div className="settings-header">
        <h1>⚙️ Paramètres Système</h1>
      </div>

      <div className="settings-content">
        <div className="settings-section">
          <h2>🌐 Général</h2>
          <div className="form-group">
            <label>Nom du site</label>
            <input
              value={settings.siteName}
              onChange={(e) => setSettings({...settings, siteName: e.target.value})}
            />
          </div>
        </div>

        <div className="settings-section">
          <h2>💰 Votes & Paiements</h2>
          <div className="form-group">
            <label>Prix par vote (FCFA)</label>
            <input
              type="number"
              value={settings.votePrice}
              onChange={(e) => setSettings({...settings, votePrice: Number(e.target.value)})}
            />
          </div>
        </div>

        <div className="settings-section">
          <h2>🎬 Vidéos</h2>
          <div className="form-group">
            <label>Durée max vidéo (secondes)</label>
            <input
              type="number"
              value={settings.maxVideoDuration}
              onChange={(e) => setSettings({...settings, maxVideoDuration: Number(e.target.value)})}
            />
          </div>
        </div>

        <div className="settings-section">
          <h2>🔧 Modération</h2>
          <div className="form-group checkbox">
            <label>
              <input
                type="checkbox"
                checked={settings.moderationEnabled}
                onChange={(e) => setSettings({...settings, moderationEnabled: e.target.checked})}
              />
              <span>Activer la modération obligatoire</span>
            </label>
          </div>
          <div className="form-group checkbox">
            <label>
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={(e) => setSettings({...settings, maintenanceMode: e.target.checked})}
              />
              <span>Mode maintenance</span>
            </label>
          </div>
        </div>

        <button className="btn-save" onClick={handleSave}>
          💾 Sauvegarder les paramètres
        </button>
      </div>
    </div>
  );
};

export default AdminSettings;
