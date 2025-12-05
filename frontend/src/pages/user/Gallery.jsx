import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { videosService } from '../../services/videos.service';
import { votesService } from '../../services/votes.service';
import VideoCard from '../../components/features/VideoCard';
import './Gallery.css';

/**
 * Page Gallery - Grille de vidéos avec filtres
 * 
 * Fonctionnalités:
 * - Grille responsive de vidéos
 * - Filtres: Toutes, Tendances, Populaires, Récentes
 * - Recherche par titre/participant
 * - Pagination ou infinite scroll
 * - Vote depuis la galerie
 */

const Gallery = () => {
  const { user } = useAuth();
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'trending', 'popular', 'recent'
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent'); // 'recent', 'popular', 'mostVoted'
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Charger les vidéos initiales
  useEffect(() => {
    loadVideos(1);
  }, [sortBy]);

  // Filtrer les vidéos
  useEffect(() => {
    filterVideos();
  }, [videos, filter, searchQuery]);

  const loadVideos = async (pageNum = 1, append = false) => {
    try {
      if (pageNum === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError(null);

      // Paramètres de requête selon le tri
      let params = {
        page: pageNum,
        limit: 12,
        status: 'approved'
      };

      if (sortBy === 'popular') {
        params.sortBy = 'viewCount';
        params.order = 'desc';
      } else if (sortBy === 'mostVoted') {
        params.sortBy = 'voteCount';
        params.order = 'desc';
      } else {
        params.sortBy = 'createdAt';
        params.order = 'desc';
      }

      const response = await videosService.getVideos(params);

      if (response.success) {
        const newVideos = response.data.videos || [];
        
        if (append) {
          setVideos(prev => [...prev, ...newVideos]);
        } else {
          setVideos(newVideos);
        }

        // Vérifier s'il y a plus de vidéos
        const totalPages = Math.ceil(response.data.total / response.data.limit);
        setHasMore(pageNum < totalPages);
        setPage(pageNum);
      } else {
        throw new Error(response.error || 'Erreur lors du chargement des vidéos');
      }
    } catch (err) {
      console.error('Erreur chargement vidéos:', err);
      setError(err.message || 'Impossible de charger les vidéos');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      loadVideos(page + 1, true);
    }
  };

  const filterVideos = () => {
    let filtered = [...videos];

    // Recherche
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(v => 
        v.title?.toLowerCase().includes(query) ||
        v.participantName?.toLowerCase().includes(query) ||
        v.description?.toLowerCase().includes(query)
      );
    }

    // Filtre par catégorie
    if (filter === 'trending') {
      // Trending = beaucoup de votes récents (simulé)
      const now = Date.now();
      filtered = filtered.filter(v => {
        const createdAt = new Date(v.createdAt).getTime();
        const daysSinceCreation = (now - createdAt) / (1000 * 60 * 60 * 24);
        return daysSinceCreation <= 7 && (v.voteCount || 0) > 10;
      });
    } else if (filter === 'popular') {
      // Popular = plus de vues
      filtered = filtered.filter(v => (v.viewCount || 0) > 100);
    } else if (filter === 'recent') {
      // Recent = moins de 3 jours
      const now = Date.now();
      filtered = filtered.filter(v => {
        const createdAt = new Date(v.createdAt).getTime();
        const daysSinceCreation = (now - createdAt) / (1000 * 60 * 60 * 24);
        return daysSinceCreation <= 3;
      });
    }

    setFilteredVideos(filtered);
  };

  const handleVote = async (videoId, provider) => {
    try {
      setError(null);

      const paymentData = {
        videoId,
        amount: 100,
        currency: 'XAF',
        provider,
        phoneNumber: user?.phone || '',
      };

      const response = await votesService.initPayment(paymentData);

      if (response.success) {
        alert(`✅ Paiement initié avec succès !\n\nRéférence: ${response.data.reference}`);
        
        // Rafraîchir les vidéos
        setTimeout(() => {
          loadVideos(1);
        }, 3000);
      } else {
        throw new Error(response.error || 'Erreur lors de l\'initiation du paiement');
      }
    } catch (err) {
      console.error('Erreur vote:', err);
      setError(err.message || 'Erreur lors du vote');
      alert(`❌ Erreur: ${err.message}`);
    }
  };

  const handleRefresh = () => {
    setPage(1);
    setHasMore(true);
    loadVideos(1);
  };

  if (loading && videos.length === 0) {
    return (
      <div className="gallery-page">
        <div className="gallery-loading">
          <div className="spinner"></div>
          <p>Chargement de la galerie...</p>
        </div>
      </div>
    );
  }

  if (error && videos.length === 0) {
    return (
      <div className="gallery-page">
        <div className="gallery-error">
          <span className="error-icon">⚠️</span>
          <h3>Erreur de chargement</h3>
          <p>{error}</p>
          <button className="btn-retry" onClick={handleRefresh}>
            🔄 Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="gallery-page">
      {/* Header */}
      <div className="gallery-header">
        <div className="header-title">
          <h1>🎬 Galerie</h1>
          <span className="video-count">{filteredVideos.length} vidéos</span>
        </div>

        {/* Filtres */}
        <div className="gallery-filters">
          <div className="filter-tabs">
            <button 
              className={`tab ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              🌟 Toutes
            </button>
            <button 
              className={`tab ${filter === 'trending' ? 'active' : ''}`}
              onClick={() => setFilter('trending')}
            >
              🔥 Tendances
            </button>
            <button 
              className={`tab ${filter === 'popular' ? 'active' : ''}`}
              onClick={() => setFilter('popular')}
            >
              ⭐ Populaires
            </button>
            <button 
              className={`tab ${filter === 'recent' ? 'active' : ''}`}
              onClick={() => setFilter('recent')}
            >
              🆕 Récentes
            </button>
          </div>

          <div className="sort-controls">
            <label>Trier:</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="recent">🕐 Plus récentes</option>
              <option value="popular">👁️ Plus vues</option>
              <option value="mostVoted">🔥 Plus votées</option>
            </select>
          </div>
        </div>

        {/* Recherche */}
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Rechercher une vidéo ou un participant..."
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

      {/* Grille de vidéos */}
      <div className="gallery-content">
        {filteredVideos.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">🎬</span>
            <h3>Aucune vidéo trouvée</h3>
            <p>
              {searchQuery 
                ? 'Essayez avec d\'autres mots-clés' 
                : 'Aucune vidéo ne correspond à ce filtre'}
            </p>
            {(searchQuery || filter !== 'all') && (
              <button 
                className="btn-reset" 
                onClick={() => {
                  setSearchQuery('');
                  setFilter('all');
                }}
              >
                🔄 Réinitialiser les filtres
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="gallery-grid">
              {filteredVideos.map(video => (
                <VideoCard
                  key={video.id}
                  video={video}
                  onVote={handleVote}
                  showActions={true}
                />
              ))}
            </div>

            {/* Bouton charger plus */}
            {hasMore && !searchQuery && filter === 'all' && (
              <div className="load-more-section">
                {loadingMore ? (
                  <div className="loading-more">
                    <div className="spinner-small"></div>
                    <p>Chargement...</p>
                  </div>
                ) : (
                  <button className="btn-load-more" onClick={loadMore}>
                    📥 Charger plus de vidéos
                  </button>
                )}
              </div>
            )}

            {/* Message de fin */}
            {!hasMore && videos.length > 0 && filter === 'all' && (
              <div className="end-message">
                <p>🎉 Vous avez tout vu !</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Erreur flottante */}
      {error && videos.length > 0 && (
        <div className="gallery-error-toast">
          <span>⚠️</span>
          <p>{error}</p>
          <button onClick={() => setError(null)}>✕</button>
        </div>
      )}
    </div>
  );
};

export default Gallery;
