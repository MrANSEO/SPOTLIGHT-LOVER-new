import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { videosService } from '../../services/videos.service';
import { leaderboardService } from '../../services/leaderboard.service';
import VideoCard from '../../components/features/VideoCard';
import './Profile.css';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [userVideos, setUserVideos] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      const videosResponse = await videosService.getMyVideos();
      if (videosResponse.success) {
        setUserVideos(videosResponse.data.videos || []);
      }
      const statsResponse = await leaderboardService.getParticipantStats(user?.id);
      if (statsResponse.success) {
        setStats(statsResponse.data);
      }
    } catch (err) {
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await updateProfile(profileData);
      setEditMode(false);
      alert('✅ Profil mis à jour !');
    } catch (err) {
      alert(`❌ Erreur: ${err.message}`);
    }
  };

  const formatNumber = (num) => {
    if (!num) return '0';
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            <span>{user?.name?.charAt(0) || '👤'}</span>
          </div>
          <div className="profile-info">
            {editMode ? (
              <input
                value={profileData.name}
                onChange={(e) => setProfileData({...profileData, name: e.target.value})}
              />
            ) : (
              <h1>{user?.name}</h1>
            )}
          </div>
          <div className="profile-actions">
            {editMode ? (
              <>
                <button className="btn btn-secondary" onClick={() => setEditMode(false)}>
                  Annuler
                </button>
                <button className="btn btn-primary" onClick={handleSave}>
                  💾 Sauvegarder
                </button>
              </>
            ) : (
              <button className="btn btn-primary" onClick={() => setEditMode(true)}>
                ✏️ Modifier
              </button>
            )}
          </div>
        </div>

        {stats && (
          <div className="stats-section">
            <div className="stat-card">
              <div className="stat-icon">🏆</div>
              <div>
                <div className="stat-value">{stats.rank || '-'}</div>
                <div className="stat-label">Position</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🔥</div>
              <div>
                <div className="stat-value">{formatNumber(stats.totalVotes)}</div>
                <div className="stat-label">Votes</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">👁️</div>
              <div>
                <div className="stat-value">{formatNumber(stats.totalViews)}</div>
                <div className="stat-label">Vues</div>
              </div>
            </div>
          </div>
        )}

        <div className="videos-section">
          <h2>🎬 Mes vidéos ({userVideos.length})</h2>
          {userVideos.length === 0 ? (
            <div className="empty-state">
              <span>🎥</span>
              <h3>Aucune vidéo</h3>
              <button className="btn btn-primary" onClick={() => window.location.href = '/upload'}>
                📤 Soumettre
              </button>
            </div>
          ) : (
            <div className="videos-grid">
              {userVideos.map(video => (
                <VideoCard key={video.id} video={video} showActions={video.status === 'approved'} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
