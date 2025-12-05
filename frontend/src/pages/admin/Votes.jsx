import React, { useState, useEffect } from 'react';
import './Votes.css';

const Votes = () => {
  const [votes, setVotes] = useState([]);
  
  useEffect(() => {
    const mockVotes = [
      { id: 1, user: 'Alice', video: 'Danse Afrobeat', amount: 100, provider: 'MTN', status: 'completed', date: '2024-11-28 14:30' },
      { id: 2, user: 'Bob', video: 'Chant Gospel', amount: 100, provider: 'Orange', status: 'completed', date: '2024-11-28 12:15' },
      { id: 3, user: 'Charlie', video: 'Comedy', amount: 100, provider: 'MTN', status: 'pending', date: '2024-11-28 16:45' }
    ];
    setVotes(mockVotes);
  }, []);

  return (
    <div className="admin-votes">
      <div className="votes-header">
        <h1>💳 Gestion des Votes</h1>
        <div className="stats-row">
          <div className="stat">
            <span className="stat-label">Total votes</span>
            <span className="stat-value">{votes.length}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Revenus</span>
            <span className="stat-value">{votes.reduce((sum, v) => sum + v.amount, 0)} FCFA</span>
          </div>
        </div>
      </div>

      <div className="votes-table-container">
        <table className="votes-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Utilisateur</th>
              <th>Vidéo</th>
              <th>Montant</th>
              <th>Provider</th>
              <th>Statut</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {votes.map(vote => (
              <tr key={vote.id}>
                <td>#{vote.id}</td>
                <td>{vote.user}</td>
                <td>{vote.video}</td>
                <td>{vote.amount} FCFA</td>
                <td>
                  <span className={`provider-badge ${vote.provider.toLowerCase()}`}>
                    {vote.provider === 'MTN' ? '📱 MTN' : '🍊 Orange'}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${vote.status}`}>
                    {vote.status === 'completed' ? '✅ Complété' : '⏳ En attente'}
                  </span>
                </td>
                <td>{vote.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Votes;