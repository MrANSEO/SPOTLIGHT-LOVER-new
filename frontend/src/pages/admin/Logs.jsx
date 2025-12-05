import React, { useState, useEffect } from 'react';
import './Logs.css';

const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState('all'); // all, info, warning, error

  useEffect(() => {
    const mockLogs = [
      { id: 1, type: 'info', message: 'Utilisateur Alice s\'est connecté', timestamp: '2024-11-28 16:45:30' },
      { id: 2, type: 'info', message: 'Nouvelle vidéo soumise par Bob', timestamp: '2024-11-28 16:30:15' },
      { id: 3, type: 'warning', message: 'Tentative de connexion échouée pour user@example.com', timestamp: '2024-11-28 15:20:45' },
      { id: 4, type: 'error', message: 'Erreur lors du paiement MTN #12345', timestamp: '2024-11-28 14:10:00' },
      { id: 5, type: 'info', message: '5 vidéos approuvées par admin', timestamp: '2024-11-28 13:00:00' }
    ];
    setLogs(mockLogs);
  }, []);

  const filteredLogs = filter === 'all' ? logs : logs.filter(l => l.type === filter);

  return (
    <div className="admin-logs">
      <div className="logs-header">
        <h1>📋 Logs et Activité</h1>
        <div className="filter-buttons">
          <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>
            Tous ({logs.length})
          </button>
          <button className={filter === 'info' ? 'active' : ''} onClick={() => setFilter('info')}>
            ℹ️ Info ({logs.filter(l => l.type === 'info').length})
          </button>
          <button className={filter === 'warning' ? 'active' : ''} onClick={() => setFilter('warning')}>
            ⚠️ Warning ({logs.filter(l => l.type === 'warning').length})
          </button>
          <button className={filter === 'error' ? 'active' : ''} onClick={() => setFilter('error')}>
            ❌ Error ({logs.filter(l => l.type === 'error').length})
          </button>
        </div>
      </div>

      <div className="logs-list">
        {filteredLogs.map(log => (
          <div key={log.id} className={`log-item ${log.type}`}>
            <div className="log-icon">
              {log.type === 'info' && 'ℹ️'}
              {log.type === 'warning' && '⚠️'}
              {log.type === 'error' && '❌'}
            </div>
            <div className="log-content">
              <p className="log-message">{log.message}</p>
              <span className="log-timestamp">{log.timestamp}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Logs;
