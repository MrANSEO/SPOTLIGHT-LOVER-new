import { useState } from 'react';
import { Link } from 'react-router-dom';
import './VideoCard.css';

const VideoCard = ({ video, onVote, showActions = true }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showVoteModal, setShowVoteModal] = useState(false);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleVote = (provider) => {
    if (onVote) {
      onVote(video.id, provider);
    }
    setShowVoteModal(false);
  };

  return (
    <div className="video-card">
      {/* Thumbnail / Video */}
      <div className="video-media" onClick={handlePlayPause}>
        {video.thumbnailUrl ? (
          <img src={video.thumbnailUrl} alt={video.title} className="video-thumbnail" />
        ) : (
          <div className="video-placeholder">
            <span className="placeholder-icon">🎬</span>
          </div>
        )}
        
        {/* Play/Pause overlay */}
        <div className="video-overlay">
          <button className="play-pause-btn">
            {isPlaying ? '⏸️' : '▶️'}
          </button>
        </div>

        {/* Duration badge */}
        {video.duration && (
          <div className="video-duration">{video.duration}s</div>
        )}
      </div>

      {/* Video Info */}
      <div className="video-info">
        <Link to={`/video/${video.id}`} className="video-title">
          {video.title}
        </Link>
        
        <div className="video-meta">
          <Link to={`/participant/${video.participantId}`} className="participant-name">
            👤 {video.participantName}
          </Link>
          <span className="video-stats">
            ⭐ {video.voteCount || 0} votes
          </span>
        </div>

        {video.description && (
          <p className="video-description line-clamp-2">
            {video.description}
          </p>
        )}
      </div>

      {/* Actions */}
      {showActions && (
        <div className="video-actions">
          <button 
            className="btn btn-primary btn-sm"
            onClick={() => setShowVoteModal(true)}
          >
            ⭐ Voter (100 FCFA)
          </button>
          <button className="btn btn-outline btn-sm btn-icon">
            ❤️
          </button>
          <button className="btn btn-outline btn-sm btn-icon">
            💬
          </button>
          <button className="btn btn-outline btn-sm btn-icon">
            📤
          </button>
        </div>
      )}

      {/* Vote Modal */}
      {showVoteModal && (
        <>
          <div className="modal-overlay" onClick={() => setShowVoteModal(false)}></div>
          <div className="modal vote-modal fade-in">
            <h3 className="modal-title">Choisir le mode de paiement</h3>
            <p className="modal-subtitle">1 vote = 100 FCFA</p>
            
            <div className="payment-options">
              <button 
                className="payment-btn mtn-btn"
                onClick={() => handleVote('MTN_MOBILE_MONEY')}
              >
                <span className="payment-icon">📱</span>
                <span className="payment-name">MTN Mobile Money</span>
              </button>
              
              <button 
                className="payment-btn orange-btn"
                onClick={() => handleVote('ORANGE_MONEY')}
              >
                <span className="payment-icon">🍊</span>
                <span className="payment-name">Orange Money</span>
              </button>
            </div>
            
            <button 
              className="btn btn-outline w-full mt-lg"
              onClick={() => setShowVoteModal(false)}
            >
              Annuler
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default VideoCard;
