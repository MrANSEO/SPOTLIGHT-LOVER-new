import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Notifications.css';

/**
 * Page Notifications - Centre de notifications
 * 
 * Types de notifications:
 * - Votes reçus
 * - Nouveaux commentaires
 * - Changements de statut vidéo
 * - Système (modération, etc.)
 */

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'votes', 'comments', 'system'

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      
      // TODO: Remplacer par l'appel API réel
      // Données mockées pour l'instant
      const mockNotifications = [
        {
          id: '1',
          type: 'vote',
          title: 'Nouveau vote !',
          message: 'Quelqu\'un a voté pour votre vidéo "Ma performance"',
          read: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString() // 5 min ago
        },
        {
          id: '2',
          type: 'comment',
          title: 'Nouveau commentaire',
          message: 'Alice a commenté votre vidéo',
          read: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString() // 30 min ago
        },
        {
          id: '3',
          type: 'system',
          title: 'Vidéo approuvée ✅',
          message: 'Votre vidéo "Talent show" a été approuvée et est maintenant visible',
          read: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() // 2h ago
        },
        {
          id: '4',
          type: 'vote',
          title: '5 nouveaux votes ! 🔥',
          message: 'Vous avez reçu 5 votes aujourd\'hui',
          read: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() // 1 day ago
        },
        {
          id: '5',
          type: 'system',
          title: 'Bienvenue sur Spotlight Lover ! 🎉',
          message: 'Merci de rejoindre notre plateforme. Soumettez votre première vidéo !',
          read: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString() // 7 days ago
        }
      ];

      setNotifications(mockNotifications);
    } catch (err) {
      console.error('Erreur chargement notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (notificationId) => {
    setNotifications(prev =>
      prev.filter(notif => notif.id !== notificationId)
    );
  };

  const clearAll = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer toutes les notifications ?')) {
      setNotifications([]);
    }
  };

  const getFilteredNotifications = () => {
    let filtered = notifications;

    if (filter === 'unread') {
      filtered = filtered.filter(n => !n.read);
    } else if (filter === 'votes') {
      filtered = filtered.filter(n => n.type === 'vote');
    } else if (filter === 'comments') {
      filtered = filtered.filter(n => n.type === 'comment');
    } else if (filter === 'system') {
      filtered = filtered.filter(n => n.type === 'system');
    }

    return filtered;
  };

  const getNotificationIcon = (type) => {
    const icons = {
      vote: '🔥',
      comment: '💬',
      system: '🔔',
      default: '📢'
    };
    return icons[type] || icons.default;
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return 'À l\'instant';
    if (seconds < 3600) return `Il y a ${Math.floor(seconds / 60)} min`;
    if (seconds < 86400) return `Il y a ${Math.floor(seconds / 3600)} h`;
    if (seconds < 604800) return `Il y a ${Math.floor(seconds / 86400)} j`;
    return date.toLocaleDateString('fr-FR');
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const filteredNotifications = getFilteredNotifications();

  if (loading) {
    return (
      <div className="notifications-page">
        <div className="notifications-loading">
          <div className="spinner"></div>
          <p>Chargement des notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="notifications-page">
      <div className="notifications-container">
        {/* Header */}
        <div className="notifications-header">
          <div className="header-title">
            <h1>🔔 Notifications</h1>
            {unreadCount > 0 && (
              <span className="unread-badge">{unreadCount} non lue{unreadCount > 1 ? 's' : ''}</span>
            )}
          </div>

          <div className="header-actions">
            {unreadCount > 0 && (
              <button className="btn btn-secondary" onClick={markAllAsRead}>
                ✓ Tout marquer comme lu
              </button>
            )}
            {notifications.length > 0 && (
              <button className="btn btn-danger" onClick={clearAll}>
                🗑️ Tout supprimer
              </button>
            )}
          </div>
        </div>

        {/* Filtres */}
        <div className="notifications-filters">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            📋 Toutes ({notifications.length})
          </button>
          <button 
            className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
            onClick={() => setFilter('unread')}
          >
            🔵 Non lues ({unreadCount})
          </button>
          <button 
            className={`filter-btn ${filter === 'votes' ? 'active' : ''}`}
            onClick={() => setFilter('votes')}
          >
            🔥 Votes
          </button>
          <button 
            className={`filter-btn ${filter === 'comments' ? 'active' : ''}`}
            onClick={() => setFilter('comments')}
          >
            💬 Commentaires
          </button>
          <button 
            className={`filter-btn ${filter === 'system' ? 'active' : ''}`}
            onClick={() => setFilter('system')}
          >
            🔔 Système
          </button>
        </div>

        {/* Liste des notifications */}
        <div className="notifications-list">
          {filteredNotifications.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">🔕</span>
              <h3>Aucune notification</h3>
              <p>
                {filter === 'all' 
                  ? 'Vous n\'avez pas encore de notifications' 
                  : `Aucune notification dans cette catégorie`}
              </p>
            </div>
          ) : (
            filteredNotifications.map(notification => (
              <div 
                key={notification.id} 
                className={`notification-item ${!notification.read ? 'unread' : ''}`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="notification-icon">
                  {getNotificationIcon(notification.type)}
                </div>

                <div className="notification-content">
                  <h3 className="notification-title">{notification.title}</h3>
                  <p className="notification-message">{notification.message}</p>
                  <span className="notification-time">{getTimeAgo(notification.createdAt)}</span>
                </div>

                <div className="notification-actions">
                  {!notification.read && (
                    <button 
                      className="mark-read-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsRead(notification.id);
                      }}
                      title="Marquer comme lu"
                    >
                      ✓
                    </button>
                  )}
                  <button 
                    className="delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notification.id);
                    }}
                    title="Supprimer"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
