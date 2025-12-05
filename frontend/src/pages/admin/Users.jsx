import React, { useState, useEffect } from 'react';
import './Users.css';

/**
 * Admin - Gestion Utilisateurs
 * 
 * Fonctionnalités:
 * - Liste des utilisateurs avec filtres
 * - Recherche par nom/email
 * - Actions: Voir, Éditer, Bloquer, Supprimer
 * - Statistiques par utilisateur
 */

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all'); // all, user, admin
  const [filterStatus, setFilterStatus] = useState('all'); // all, active, blocked

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchQuery, filterRole, filterStatus]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      // TODO: Appel API réel
      setTimeout(() => {
        const mockUsers = [
          {
            id: 1,
            name: 'Alice Johnson',
            email: 'alice@example.com',
            phone: '237671234567',
            role: 'user',
            status: 'active',
            videosCount: 5,
            votesReceived: 245,
            createdAt: '2024-01-15'
          },
          {
            id: 2,
            name: 'Bob Smith',
            email: 'bob@example.com',
            phone: '237672345678',
            role: 'user',
            status: 'active',
            videosCount: 3,
            votesReceived: 189,
            createdAt: '2024-01-20'
          },
          {
            id: 3,
            name: 'Admin User',
            email: 'admin@spotlight.cm',
            phone: '237673456789',
            role: 'admin',
            status: 'active',
            videosCount: 0,
            votesReceived: 0,
            createdAt: '2024-01-01'
          }
        ];
        setUsers(mockUsers);
        setLoading(false);
      }, 1000);
    } catch (err) {
      console.error('Erreur:', err);
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = [...users];

    // Recherche
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(u =>
        u.name.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query) ||
        u.phone.includes(query)
      );
    }

    // Filtre rôle
    if (filterRole !== 'all') {
      filtered = filtered.filter(u => u.role === filterRole);
    }

    // Filtre statut
    if (filterStatus !== 'all') {
      filtered = filtered.filter(u => u.status === filterStatus);
    }

    setFilteredUsers(filtered);
  };

  const handleBlockUser = (userId) => {
    if (window.confirm('Bloquer cet utilisateur ?')) {
      // TODO: Appel API
      setUsers(prev => prev.map(u =>
        u.id === userId ? { ...u, status: 'blocked' } : u
      ));
    }
  };

  const handleUnblockUser = (userId) => {
    if (window.confirm('Débloquer cet utilisateur ?')) {
      setUsers(prev => prev.map(u =>
        u.id === userId ? { ...u, status: 'active' } : u
      ));
    }
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('ATTENTION: Supprimer définitivement cet utilisateur ?')) {
      setUsers(prev => prev.filter(u => u.id !== userId));
    }
  };

  if (loading) {
    return (
      <div className="admin-users">
        <div className="loading-center">
          <div className="spinner"></div>
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-users">
      <div className="users-header">
        <h1>👥 Gestion des Utilisateurs</h1>
        <p>{filteredUsers.length} utilisateur{filteredUsers.length > 1 ? 's' : ''}</p>
      </div>

      {/* Filtres */}
      <div className="users-filters">
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Rechercher par nom, email ou téléphone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
            <option value="all">Tous les rôles</option>
            <option value="user">Utilisateurs</option>
            <option value="admin">Admins</option>
          </select>

          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">Tous les statuts</option>
            <option value="active">Actifs</option>
            <option value="blocked">Bloqués</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="users-table-container">
        {filteredUsers.length === 0 ? (
          <div className="empty-state">
            <span>👤</span>
            <h3>Aucun utilisateur trouvé</h3>
            <p>Essayez de modifier vos filtres</p>
          </div>
        ) : (
          <table className="users-table">
            <thead>
              <tr>
                <th>Utilisateur</th>
                <th>Contact</th>
                <th>Rôle</th>
                <th>Statut</th>
                <th>Vidéos</th>
                <th>Votes</th>
                <th>Inscription</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id}>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar">{user.name.charAt(0)}</div>
                      <span className="user-name">{user.name}</span>
                    </div>
                  </td>
                  <td>
                    <div className="contact-cell">
                      <span>{user.email}</span>
                      <span>{user.phone}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`role-badge ${user.role}`}>
                      {user.role === 'admin' ? '👑 Admin' : '👤 User'}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${user.status}`}>
                      {user.status === 'active' ? '✅ Actif' : '🚫 Bloqué'}
                    </span>
                  </td>
                  <td>{user.videosCount}</td>
                  <td>{user.votesReceived}</td>
                  <td>{new Date(user.createdAt).toLocaleDateString('fr-FR')}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-action view" title="Voir">👁️</button>
                      {user.status === 'active' ? (
                        <button 
                          className="btn-action block" 
                          title="Bloquer"
                          onClick={() => handleBlockUser(user.id)}
                        >
                          🚫
                        </button>
                      ) : (
                        <button 
                          className="btn-action unblock" 
                          title="Débloquer"
                          onClick={() => handleUnblockUser(user.id)}
                        >
                          ✅
                        </button>
                      )}
                      <button 
                        className="btn-action delete" 
                        title="Supprimer"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Users;
