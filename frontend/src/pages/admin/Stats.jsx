import React from 'react';
import './Stats.css';

const Stats = () => {
  return (
    <div className="admin-stats">
      <div className="stats-header">
        <h1>📊 Statistiques Avancées</h1>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>📈 Évolution des Inscriptions</h3>
          <div className="chart-placeholder">Graphique ici</div>
        </div>
        <div className="chart-card">
          <h3>🎬 Vidéos par Catégorie</h3>
          <div className="chart-placeholder">Graphique ici</div>
        </div>
        <div className="chart-card">
          <h3>💰 Revenus Mensuels</h3>
          <div className="chart-placeholder">Graphique ici</div>
        </div>
        <div className="chart-card">
          <h3>🔥 Top Participants</h3>
          <div className="chart-placeholder">Graphique ici</div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
