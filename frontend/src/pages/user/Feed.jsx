import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { videosService } from '../../services/videos.service';
import { votesService } from '../../services/votes.service';
import VideoCard from '../../components/features/VideoCard';
import './Feed.css';

/**
 * Page Feed - Style TikTok
 * 
 * Fonctionnalités:
 * - Scroll vertical avec snap
 * - Auto-play/pause basé sur la visibilité
 * - Infinite scroll (chargement progressif)
 * - Vote avec MTN/Orange Money
 * - Gestion du chargement et des erreurs
 */

const Feed = () => {
  const { user } = useAuth();
  const [videos, setVideos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [votingVideo, setVotingVideo] = useState(null);

  const containerRef = useRef(null);
  const observerRef = useRef(null);

  // Charger les vidéos initiales
  useEffect(() => {
    loadVideos();
  }, []);

  // Fonction pour charger les vidéos
  const loadVideos = async (pageNum = 1) => {
    try {
      setLoading(true);
      setError(null);

      const response = await videosService.getVideos({
        page: pageNum,
        limit: 10,
        status: 'approved' // Seulement les vidéos approuvées
      });

      if (response.success) {
        if (pageNum === 1) {
          setVideos(response.data.videos || []);
        } else {
          setVideos(prev => [...prev, ...(response.data.videos || [])]);
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
    }
  };

  // Infinite scroll - charger plus de vidéos
  const loadMoreVideos = useCallback(() => {
    if (!loading && hasMore) {
      loadVideos(page + 1);
    }
  }, [loading, hasMore, page]);

  // Observer pour l'infinite scroll
  useEffect(() => {
    if (!containerRef.current) return;

    const options = {
      root: null,
      rootMargin: '200px',
      threshold: 0.1
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && hasMore && !loading) {
          loadMoreVideos();
        }
      });
    }, options);

    // Observer le dernier élément
    const lastVideo = containerRef.current.lastElementChild;
    if (lastVideo) {
      observerRef.current.observe(lastVideo);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [videos, hasMore, loading, loadMoreVideos]);

  // Gérer le scroll snap et l'index actuel
  useEffect(() => {
    if (!containerRef.current) return;

    const handleScroll = () => {
      const container = containerRef.current;
      const scrollPosition = container.scrollTop;
      const videoHeight = container.clientHeight;
      const newIndex = Math.round(scrollPosition / videoHeight);
      
      if (newIndex !== currentIndex && newIndex < videos.length) {
        setCurrentIndex(newIndex);
      }
    };

    const container = containerRef.current;
    container.addEventListener('scroll', handleScroll);

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [currentIndex, videos.length]);

  // Gérer le vote
  const handleVote = async (videoId, provider) => {
    try {
      setVotingVideo(videoId);
      setError(null);

      // Données de paiement
      const paymentData = {
        videoId,
        amount: 100, // 100 FCFA par vote
        currency: 'XAF',
        provider,
        phoneNumber: user?.phone || '', // Numéro de l'utilisateur
      };

      // Initier le paiement
      const response = await votesService.initPayment(paymentData);

      if (response.success) {
        // Afficher un message de succès
        alert(`✅ Paiement initié avec succès ! Veuillez confirmer sur votre téléphone.\n\nRéférence: ${response.data.reference}`);

        // TODO: Implémenter un système de notification pour le statut du paiement
        // Pour l'instant, on rafraîchit juste les vidéos après 3 secondes
        setTimeout(() => {
          loadVideos(1);
        }, 3000);
      } else {
        throw new Error(response.error || 'Erreur lors de l\'initiation du paiement');
      }
    } catch (err) {
      console.error('Erreur vote:', err);
      setError(err.message || 'Erreur lors du vote');
      alert(`❌ Erreur: ${err.message || 'Impossible de voter pour le moment'}`);
    } finally {
      setVotingVideo(null);
    }
  };

  // Gérer le refresh
  const handleRefresh = () => {
    setPage(1);
    setHasMore(true);
    loadVideos(1);
  };

  if (loading && videos.length === 0) {
    return (
      <div className="feed-container">
        <div className="feed-loading">
          <div className="spinner"></div>
          <p>Chargement des vidéos...</p>
        </div>
      </div>
    );
  }

  if (error && videos.length === 0) {
    return (
      <div className="feed-container">
        <div className="feed-error">
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

  if (videos.length === 0) {
    return (
      <div className="feed-container">
        <div className="feed-empty">
          <span className="empty-icon">🎬</span>
          <h3>Aucune vidéo disponible</h3>
          <p>Revenez plus tard pour découvrir de nouveaux contenus !</p>
          <button className="btn-refresh" onClick={handleRefresh}>
            🔄 Actualiser
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="feed-page">
      {/* Header avec indicateur de position */}
      <div className="feed-header">
        <div className="feed-info">
          <h2>🔥 Feed</h2>
          <span className="video-counter">
            {currentIndex + 1} / {videos.length}
          </span>
        </div>
        <button className="btn-refresh-icon" onClick={handleRefresh} title="Actualiser">
          🔄
        </button>
      </div>

      {/* Conteneur de scroll vertical avec snap */}
      <div className="feed-scroll-container" ref={containerRef}>
        {videos.map((video, index) => (
          <div 
            key={video.id} 
            className={`feed-item ${index === currentIndex ? 'active' : ''}`}
          >
            <VideoCard
              video={video}
              onVote={handleVote}
              showActions={true}
            />
          </div>
        ))}

        {/* Indicateur de chargement pour infinite scroll */}
        {loading && videos.length > 0 && (
          <div className="feed-loading-more">
            <div className="spinner-small"></div>
            <p>Chargement...</p>
          </div>
        )}

        {/* Message de fin */}
        {!hasMore && videos.length > 0 && (
          <div className="feed-end">
            <p>🎉 Vous avez tout vu !</p>
            <button className="btn-refresh" onClick={handleRefresh}>
              🔄 Recharger le feed
            </button>
          </div>
        )}
      </div>

      {/* Erreur flottante */}
      {error && videos.length > 0 && (
        <div className="feed-error-toast">
          <span>⚠️</span>
          <p>{error}</p>
          <button onClick={() => setError(null)}>✕</button>
        </div>
      )}

      {/* Indicateur de vote en cours */}
      {votingVideo && (
        <div className="voting-indicator">
          <div className="spinner-small"></div>
          <p>Vote en cours...</p>
        </div>
      )}
    </div>
  );
};

export default Feed;
