import React, { useState } from 'react';
import './Settings.css';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    siteName: 'Spotlight Lover',
    votePrice: 100,
    maintenanceMode: false,
    registrationOpen: true,
    maxVideoSize: 100,
    maxVideoDuration: 180
  });

  const handleSave = () => {
    alert('✅ Paramètres sauvegardés !');
  };

  return (
    <div className="admin-settings">
      <div className="settings-header">
        <h1>⚙️ Paramètres Système</h1>
      </div>

      <div className="settings-sections">
        <div className="settings-section">
          <h2>🌐 Général</h2>
          <div className="form-group">
            <label>Nom du site</label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) => setSettings({...settings, siteName: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Prix du vote (FCFA)</label>
            <input
              type="number"
              value={settings.votePrice}
              onChange={(e) => setSettings({...settings, votePrice: parseInt(e.target.value)})}
            />
          </div>
        </div>

        <div className="settings-section">
          <h2>🎬 Vidéos</h2>
          <div className="form-group">
            <label>Taille max (MB)</label>
            <input
              type="number"
              value={settings.maxVideoSize}
              onChange={(e) => setSettings({...settings, maxVideoSize: parseInt(e.target.value)})}
            />
          </div>
          <div className="form-group">
            <label>Durée max (secondes)</label>
            <input
              type="number"
              value={settings.maxVideoDuration}
              onChange={(e) => setSettings({...settings, maxVideoDuration: parseInt(e.target.value)})}
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
                onChange={(e) => setSettings({...settings, maintenanceMode: e.target.checked})}
              />
              <span>Mode maintenance</span>
            </label>
          </div>
          <div className="toggle-group">
            <label>
              <input
                type="checkbox"
                checked={settings.registrationOpen}
                onChange={(e) => setSettings({...settings, registrationOpen: e.target.checked})}
              />
              <span>Inscriptions ouvertes</span>
            </label>
          </div>
        </div>

        <button className="btn-save" onClick={handleSave}>
          💾 Sauvegarder
        </button>
      </div>
    </div>
  );
};

export default AdminSettings;
