import { Edit3, Trash2 } from "lucide-react";
import { STATUS_CONFIG } from "../../config/profileStatusConfig";
import StarRating from "../StarRating";
import { useState } from "react";
import ConfirmDialog from "../ui/ConfirmDialog";

const ProfileGameCard = ({ game, isMe, onEdit, onDelete, style }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const statusConfig = STATUS_CONFIG[game.status] || STATUS_CONFIG.Backlog;
  const progress = game.progress || 0;

  // Progress circle calculation
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  // Dynamic progress color
  const getProgressColor = (p) => {
    if (p === 100) return "#10b981";
    if (p >= 70) return "#00d9ff";
    if (p >= 30) return "#3b82f6";
    return "#f59e0b";
  };

  const progressColor = getProgressColor(progress);

  return (
    <article className="lx-profile-game-card" style={style}>
      {/* Cover + Status + Actions */}
      <div className="lx-profile-game-cover">
        {game.coverUrl && <img src={game.coverUrl} alt={game.title} loading="lazy" />}

        <div
          className="lx-profile-game-status-pill"
          style={{
            background: statusConfig.gradient,
            boxShadow: `0 0 18px ${statusConfig.color}40`,
          }}
        >
          {statusConfig.label}
        </div>

        {isMe && (
          <div className="lx-profile-game-actions-overlay">
            <button type="button" className="lx-profile-game-action-btn lx-profile-game-action-btn--edit" onClick={() => onEdit?.(game)} title="Modifica">
              <Edit3 size={20} />
            </button>
            <button
              type="button"
              className="lx-profile-game-action-btn lx-profile-game-action-btn--delete"
              onClick={() => setShowDeleteConfirm(true)}
              title="Rimuovi"
            >
              <Trash2 size={20} />
            </button>
          </div>
        )}
      </div>

      {/* Footer Glass */}
      <footer className="lx-profile-game-footer">
        <h3 className="lx-profile-game-title">{game.title}</h3>

        <div className="lx-profile-game-footer-row">
          <div className="lx-profile-game-rating-display">
            <StarRating rating={game.rating ?? 0} size="sm" />
            <span className="lx-profile-game-rating-value">{typeof game.rating === "number" && game.rating > 0 ? game.rating.toFixed(1) : "N/D"}</span>
          </div>

          <div className="lx-profile-progress-circle">
            <svg width="48" height="48" viewBox="0 0 48 48">
              <circle className="lx-profile-progress-circle-bg" cx="24" cy="24" r={radius} />
              <circle
                className="lx-profile-progress-circle-fill"
                cx="24"
                cy="24"
                r={radius}
                stroke={progressColor}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
              />
            </svg>
            <div className="lx-profile-progress-text">{progress}%</div>
          </div>
        </div>
      </footer>

      {showDeleteConfirm && (
        <ConfirmDialog
          open={showDeleteConfirm}
          title="Rimuovere gioco?"
          message={`Sei sicuro di voler rimuovere "${game.title}" dalla libreria?`}
          confirmLabel="Sì, rimuovi"
          cancelLabel="Annulla"
          onConfirm={() => {
            onDelete?.(game.userGameId);
            setShowDeleteConfirm(false);
          }}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </article>
  );
};

export default ProfileGameCard;
