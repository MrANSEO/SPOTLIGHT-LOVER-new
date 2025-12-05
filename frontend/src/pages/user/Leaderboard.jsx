import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { leaderboardService } from '../../services/leaderboard.service';
import './Leaderboard.css';

/**
 * Page Leaderboard avec WebSocket temps réel
 * 
 * Fonctionnalités:
 * - Classement en temps réel des participants
 * - WebSocket pour mises à jour automatiques
 * - Filtres: Top 10, Top 50, Top 100, Tous
 * - Statistiques détaillées par participant
 * - Recherche de participants
 * - Animation des changements de position
 */

const Leaderboard = () => {
  const { user } = useAuth();
  const [participants, setParticipants] = useState([]);
  const [filteredParticipants, setFilteredParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'top10', 'top50', 'top100', 'all'
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('votes'); // 'votes', 'views', 'likes'
  const [wsConnected, setWsConnected] = useState(false);

  const wsRef = useRef(null);

  // Charger le leaderboard initial
  useEffect(() => {
    loadLeaderboard();
  }, []);

  // Connecter WebSocket pour les mises à jour en temps réel
  useEffect(() => {
    connectWebSocket();

    return () => {
      disconnectWebSocket();
    };
  }, []);

  // Filtrer et trier les participants
  useEffect(() => {
    filterAndSortParticipants();
  }, [participants, filter, searchQuery, sortBy]);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await leaderboardService.getLeaderboard({
        limit: 1000 // Charger tous les participants
      });

      if (response.success) {
        setParticipants(response.data.participants || []);
      } else {
        throw new Error(response.error || 'Erreur lors du chargement du classement');
      }
    } catch (err) {
      console.error('Erreur chargement leaderboard:', err);
      setError(err.message || 'Impossible de charger le classement');
    } finally {
      setLoading(false);
    }
  };

  const connectWebSocket = () => {
    try {
      // TODO: Remplacer par l'URL réelle du serveur WebSocket
      const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3000';
      
      wsRef.current = new WebSocket(WS_URL);

      wsRef.current.onopen = () => {
        console.log('✅ WebSocket connecté');
        setWsConnected(true);
        
        // S'abonner aux mises à jour du leaderboard
        wsRef.current.send(JSON.stringify({
          type: 'subscribe',
          channel: 'leaderboard'
        }));
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === 'leaderboard_update') {
            // Mise à jour d'un participant
            updateParticipant(data.participant);
          } else if (data.type === 'leaderboard_refresh') {
            // Rafraîchissement complet
            setParticipants(data.participants || []);
          }
        } catch (err) {
          console.error('Erreur parsing WebSocket:', err);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('❌ WebSocket erreur:', error);
        setWsConnected(false);
      };

      wsRef.current.onclose = () => {
        console.log('🔌 WebSocket déconnecté');
        setWsConnected(false);
        
        // Reconnexion automatique après 5 secondes
        setTimeout(() => {
          if (wsRef.current?.readyState === WebSocket.CLOSED) {
            console.log('🔄 Tentative de reconnexion...');
            connectWebSocket();
          }
        }, 5000);
      };
    } catch (err) {
      console.error('Erreur connexion WebSocket:', err);
      setWsConnected(false);
    }
  };

  const disconnectWebSocket = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  };

  const updateParticipant = (updatedParticipant) => {
    setParticipants(prev => {
      const index = prev.findIndex(p => p.id === updatedParticipant.id);
      
      if (index !== -1) {
        // Mise à jour existant
        const newParticipants = [...prev];
        newParticipants[index] = { ...newParticipants[index], ...updatedParticipant };
        return newParticipants;
      } else {
        // Nouveau participant
        return [...prev, updatedParticipant];
      }
    });
  };

  const filterAndSortParticipants = () => {
    let filtered = [...participants];

    // Recherche
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name?.toLowerCase().includes(query) ||
        p.email?.toLowerCase().includes(query)
      );
    }

    // Tri
    filtered.sort((a, b) => {
      if (sortBy === 'votes') {
        return (b.voteCount || 0) - (a.voteCount || 0);
      } else if (sortBy === 'views') {
        return (b.viewCount || 0) - (a.viewCount || 0);
      } else if (sortBy === 'likes') {
        return (b.likeCount || 0) - (a.likeCount || 0);
      }
      return 0;
    });

    // Filtre top N
    if (filter === 'top10') {
      filtered = filtered.slice(0, 10);
    } else if (filter === 'top50') {
      filtered = filtered.slice(0, 50);
    } else if (filter === 'top100') {
      filtered = filtered.slice(0, 100);
    }

    setFilteredParticipants(filtered);
  };

  const formatNumber = (num) => {
    if (!num) return '0';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const getRankClass = (rank) => {
    if (rank === 1) return 'rank-1';
    if (rank === 2) return 'rank-2';
    if (rank === 3) return 'rank-3';
    return '';
  };

  if (loading) {
    return (
      <div className="leaderboard-page">
        <div className="leaderboard-loading">
          <div className="spinner"></div>
          <p>Chargement du classement...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="leaderboard-page">
        <div className="leaderboard-error">
          <span className="error-icon">⚠️</span>
          <h3>Erreur de chargement</h3>
          <p>{error}</p>
          <button className="btn-retry" onClick={loadLeaderboard}>
            🔄 Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="leaderboard-page">
      {/* Header */}
      <div className="leaderboard-header">
        <div className="header-title">
          <h1>🏆 Classement</h1>
          <div className="ws-status">
            <span className={`ws-indicator ${wsConnected ? 'connected' : 'disconnected'}`}></span>
            <span className="ws-text">{wsConnected ? 'En direct' : 'Hors ligne'}</span>
          </div>
        </div>

        {/* Filtres */}
        <div className="leaderboard-filters">
          <div className="filter-group">
            <button 
              className={`filter-btn ${filter === 'top10' ? 'active' : ''}`}
              onClick={() => setFilter('top10')}
            >
              Top 10
            </button>
            <button 
              className={`filter-btn ${filter === 'top50' ? 'active' : ''}`}
              onClick={() => setFilter('top50')}
            >
              Top 50
            </button>
            <button 
              className={`filter-btn ${filter === 'top100' ? 'active' : ''}`}
              onClick={() => setFilter('top100')}
            >
              Top 100
            </button>
            <button 
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              Tous
            </button>
          </div>

          <div className="sort-group">
            <label>Trier par:</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="votes">🔥 Votes</option>
              <option value="views">👁️ Vues</option>
              <option value="likes">❤️ Likes</option>
            </select>
          </div>
        </div>

        {/* Recherche */}
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Rechercher un participant..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-btn" onClick={() => setSearchQuery('')}>
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Leaderboard List */}
      <div className="leaderboard-content">
        {filteredParticipants.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">🔍</span>
            <h3>Aucun résultat</h3>
            <p>Essayez de modifier vos filtres ou votre recherche</p>
          </div>
        ) : (
          <div className="leaderboard-list">
            {filteredParticipants.map((participant, index) => {
              const rank = index + 1;
              return (
                <div 
                  key={participant.id} 
                  className={`leaderboard-item ${getRankClass(rank)} ${participant.id === user?.id ? 'current-user' : ''}`}
                >
                  <div className="rank-badge">
                    {getRankIcon(rank)}
                  </div>

                  <div className="participant-avatar">
                    {participant.avatarUrl ? (
                      <img src={participant.avatarUrl} alt={participant.name} />
                    ) : (
                      <span className="avatar-text">{participant.name?.charAt(0) || '?'}</span>
                    )}
                  </div>

                  <div className="participant-info">
                    <h3 className="participant-name">
                      {participant.name}
                      {participant.id === user?.id && <span className="you-badge">Vous</span>}
                    </h3>
                    <div className="participant-stats">
                      <span className="stat">
                        <span className="stat-icon">🔥</span>
                        <span className="stat-value">{formatNumber(participant.voteCount || 0)}</span>
                      </span>
                      <span className="stat">
                        <span className="stat-icon">👁️</span>
                        <span className="stat-value">{formatNumber(participant.viewCount || 0)}</span>
                      </span>
                      <span className="stat">
                        <span className="stat-icon">❤️</span>
                        <span className="stat-value">{formatNumber(participant.likeCount || 0)}</span>
                      </span>
                    </div>
                  </div>

                  <div className="participant-score">
                    <span className="score-value">{formatNumber(participant.voteCount || 0)}</span>
                    <span className="score-label">points</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
