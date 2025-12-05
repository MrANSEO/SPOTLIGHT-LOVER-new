import React, { useState, useEffect } from 'react';
import './Videos.css';

const Videos = () => {
  const [videos, setVideos] = useState([]);
  const [filter, setFilter] = useState('pending'); // pending, approved, rejected, all

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    // Mock data
    const mockVideos = [
      { id: 1, title: 'Danse Afrobeat', participant: 'Alice', status: 'pending', votes: 0, views: 0, createdAt: '2024-11-28' },
      { id: 2, title: 'Chant Gospel', participant: 'Bob', status: 'approved', votes: 245, views: 1250, createdAt: '2024-11-27' },
      { id: 3, title: 'Comedy Sketch', participant: 'Charlie', status: 'rejected', votes: 0, views: 0, createdAt: '2024-11-26' }
    ];
    setVideos(mockVideos);
  };

  const handleApprove = (id) => {
    setVideos(prev => prev.map(v => v.id === id ? {...v, status: 'approved'} : v));
  };

  const handleReject = (id) => {
    if (window.confirm('Rejeter cette vidéo ?')) {
      setVideos(prev => prev.map(v => v.id === id ? {...v, status: 'rejected'} : v));
    }
  };

  const filteredVideos = filter === 'all' ? videos : videos.filter(v => v.status === filter);

  return (
    <div className="admin-videos">
      <div className="videos-header">
        <h1>🎬 Modération des Vidéos</h1>
        <div className="filter-tabs">
          <button className={filter === 'pending' ? 'active' : ''} onClick={() => setFilter('pending')}>
            ⏳ En attente ({videos.filter(v => v.status === 'pending').length})
          </button>
          <button className={filter === 'approved' ? 'active' : ''} onClick={() => setFilter('approved')}>
            ✅ Approuvées ({videos.filter(v => v.status === 'approved').length})
          </button>
          <button className={filter === 'rejected' ? 'active' : ''} onClick={() => setFilter('rejected')}>
            ❌ Rejetées ({videos.filter(v => v.status === 'rejected').length})
          </button>
          <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>
            📋 Toutes ({videos.length})
          </button>
        </div>
      </div>

      <div className="videos-grid">
        {filteredVideos.map(video => (
          <div key={video.id} className="video-moderation-card">
            <div className="video-thumbnail">🎥</div>
            <div className="video-info">
              <h3>{video.title}</h3>
              <p>Par: {video.participant}</p>
              <div className="video-stats">
                <span>🔥 {video.votes} votes</span>
                <span>👁️ {video.views} vues</span>
              </div>
              <span className={`status-badge ${video.status}`}>
                {video.status === 'pending' && '⏳ En attente'}
                {video.status === 'approved' && '✅ Approuvée'}
                {video.status === 'rejected' && '❌ Rejetée'}
              </span>
            </div>
            {video.status === 'pending' && (
              <div className="video-actions">
                <button className="btn-approve" onClick={() => handleApprove(video.id)}>
                  ✅ Approuver
                </button>
                <button className="btn-reject" onClick={() => handleReject(video.id)}>
                  ❌ Rejeter
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Videos;
