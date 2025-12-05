import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Dashboard.css';

/**
 * Admin Dashboard - Vue d'ensemble
 * 
 * Affiche:
 * - Statistiques clés (utilisateurs, vidéos, votes, revenus)
 * - Graphiques d'activité
 * - Dernières activités
 * - Actions rapides
 */

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalVideos: 0,
    totalVotes: 0,
    totalRevenue: 0,
    pendingVideos: 0,
    activeUsers: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // TODO: Remplacer par vrais appels API
      // Données mockées pour l'instant
      setTimeout(() => {
        setStats({
          totalUsers: 1247,
          totalVideos: 356,
          totalVotes: 12458,
          totalRevenue: 1245800, // en FCFA
          pendingVideos: 23,
          activeUsers: 89
        });

        setRecentActivities([
          {
            id: 1,
            type: 'video',
            message: 'Nouvelle vidéo soumise par Alice',
            time: '2 min ago',
            icon: '🎬'
          },
          {
            id: 2,
            type: 'user',
            message: '5 nouveaux utilisateurs inscrits',
            time: '15 min ago',
            icon: '👥'
          },
          {
            id: 3,
            type: 'vote',
            message: '150 votes reçus (MTN Mobile Money)',
            time: '1h ago',
            icon: '🔥'
          },
          {
            id: 4,
            type: 'moderation',
            message: '3 vidéos approuvées',
            time: '2h ago',
            icon: '✅'
          }
        ]);

        setLoading(false);
      }, 1000);
    } catch (err) {
      console.error('Erreur chargement dashboard:', err);
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('fr-FR').format(num);
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="dashboard-loading">
          <div className="spinner"></div>
          <p>Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1>👑 Admin Dashboard</h1>
          <p>Bienvenue, {user?.name}</p>
        </div>
        <button className="btn btn-refresh" onClick={loadDashboardData}>
          🔄 Actualiser
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <span className="stat-value">{formatNumber(stats.totalUsers)}</span>
            <span className="stat-label">Utilisateurs</span>
            <span className="stat-change positive">+{stats.activeUsers} actifs</span>
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-icon">🎬</div>
          <div className="stat-content">
            <span className="stat-value">{formatNumber(stats.totalVideos)}</span>
            <span className="stat-label">Vidéos</span>
            <span className="stat-change warning">{stats.pendingVideos} en attente</span>
          </div>
        </div>

        <div className="stat-card info">
          <div className="stat-icon">🔥</div>
          <div className="stat-content">
            <span className="stat-value">{formatNumber(stats.totalVotes)}</span>
            <span className="stat-label">Votes</span>
            <span className="stat-change positive">+245 aujourd'hui</span>
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <span className="stat-value">{formatCurrency(stats.totalRevenue)}</span>
            <span className="stat-label">Revenus</span>
            <span className="stat-change positive">+15% ce mois</span>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Quick Actions */}
        <div className="quick-actions-section">
          <h2>⚡ Actions Rapides</h2>
          <div className="quick-actions-grid">
            <Link to="/admin/users" className="quick-action-card">
              <span className="action-icon">👥</span>
              <span className="action-label">Gérer Utilisateurs</span>
            </Link>
            <Link to="/admin/videos" className="quick-action-card">
              <span className="action-icon">🎬</span>
              <span className="action-label">Modérer Vidéos</span>
              {stats.pendingVideos > 0 && (
                <span className="action-badge">{stats.pendingVideos}</span>
              )}
            </Link>
            <Link to="/admin/votes" className="quick-action-card">
              <span className="action-icon">🔥</span>
              <span className="action-label">Gérer Votes</span>
            </Link>
            <Link to="/admin/stats" className="quick-action-card">
              <span className="action-icon">📊</span>
              <span className="action-label">Statistiques</span>
            </Link>
            <Link to="/admin/settings" className="quick-action-card">
              <span className="action-icon">⚙️</span>
              <span className="action-label">Paramètres</span>
            </Link>
            <Link to="/admin/logs" className="quick-action-card">
              <span className="action-icon">📋</span>
              <span className="action-label">Logs</span>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="recent-activity-section">
          <h2>📈 Activité Récente</h2>
          <div className="activity-list">
            {recentActivities.length === 0 ? (
              <div className="empty-state">
                <span>📭</span>
                <p>Aucune activité récente</p>
              </div>
            ) : (
              recentActivities.map(activity => (
                <div key={activity.id} className="activity-item">
                  <div className="activity-icon">{activity.icon}</div>
                  <div className="activity-content">
                    <p className="activity-message">{activity.message}</p>
                    <span className="activity-time">{activity.time}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="pending-tasks-section">
          <h2>⏳ Tâches en Attente</h2>
          <div className="tasks-list">
            <div className="task-item">
              <div className="task-icon">🎬</div>
              <div className="task-content">
                <span className="task-title">{stats.pendingVideos} vidéos à modérer</span>
                <Link to="/admin/videos?filter=pending" className="task-link">
                  Voir →
                </Link>
              </div>
            </div>
            <div className="task-item">
              <div className="task-icon">🚨</div>
              <div className="task-content">
                <span className="task-title">5 signalements utilisateurs</span>
                <Link to="/admin/users?filter=reported" className="task-link">
                  Voir →
                </Link>
              </div>
            </div>
            <div className="task-item">
              <div className="task-icon">💳</div>
              <div className="task-content">
                <span className="task-title">2 paiements en attente</span>
                <Link to="/admin/votes?filter=pending" className="task-link">
                  Voir →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="system-status">
        <h3>🔧 État du Système</h3>
        <div className="status-grid">
          <div className="status-item">
            <span className="status-label">API</span>
            <span className="status-indicator online">●</span>
            <span className="status-text">En ligne</span>
          </div>
          <div className="status-item">
            <span className="status-label">Base de données</span>
            <span className="status-indicator online">●</span>
            <span className="status-text">Connectée</span>
          </div>
          <div className="status-item">
            <span className="status-label">Stockage</span>
            <span className="status-indicator online">●</span>
            <span className="status-text">75% utilisé</span>
          </div>
          <div className="status-item">
            <span className="status-label">Paiements</span>
            <span className="status-indicator online">●</span>
            <span className="status-text">Opérationnel</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
