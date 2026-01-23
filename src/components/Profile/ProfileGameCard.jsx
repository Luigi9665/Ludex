import { useState } from "react";
import { Calendar, Monitor, Edit3, Save, X, Trash2 } from "lucide-react";
import StarRating from "../StarRating";
import { STATUS_CONFIG, STATUS_ORDER } from "../../config/profileStatusConfig";

const StatusPill = ({ status, small = false }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.Backlog;

  return (
    <span
      className={`lx-status-pill ${small ? "lx-status-pill-sm" : ""}`}
      style={{
        background: cfg.gradient,
        boxShadow: `0 0 18px ${cfg.color}40`,
      }}
    >
      <span className="lx-status-icon">{cfg.icon}</span>
      {cfg.label}
    </span>
  );
};

const ProgressBar = ({ progress = 0, status }) => {
  const gradient = STATUS_CONFIG[status]?.gradient || STATUS_CONFIG.Backlog.gradient;

  return (
    <div className="lx-profile-progress">
      <div className="lx-profile-progress-bar">
        <div className="lx-profile-progress-fill" style={{ width: `${progress}%`, background: gradient }} />
      </div>
      <span className="lx-profile-progress-label">{progress}%</span>
    </div>
  );
};

const ProfileGameCard = ({ game, isMe, onUpdate, onDelete }) => {
  const userGameId = game.userGameId ?? game.userGameID; // ora nel DTO ce l’hai

  const [isEditing, setIsEditing] = useState(false);

  const [status, setStatus] = useState(game.status);
  const [rating, setRating] = useState(game.rating ?? 0);
  const [progress, setProgress] = useState(game.progress ?? 0);
  const [review, setReview] = useState(game.review ?? "");
  const [isReviewPublic, setIsReviewPublic] = useState(game.isReviewPublic ?? false);

  const [saving, setSaving] = useState(false);

  const resetLocal = () => {
    setStatus(game.status);
    setRating(game.rating ?? 0);
    setProgress(game.progress ?? 0);
    setReview(game.review ?? "");
    setIsReviewPublic(game.isReviewPublic ?? false);
  };

  const handleSave = async () => {
    if (!isMe || !userGameId) return;
    setSaving(true);

    await onUpdate(userGameId, {
      status,
      rating,
      progress,
      review,
      isReviewPublic,
    });

    setSaving(false);
    setIsEditing(false);
  };

  const handleCancel = () => {
    resetLocal();
    setIsEditing(false);
  };

  const handleDeleteClick = async () => {
    if (!isMe || !userGameId) return;
    const ok = window.confirm(`Vuoi davvero rimuovere "${game.title}" dalla tua libreria?`);
    if (!ok) return;
    await onDelete(userGameId);
  };

  // La review si vede solo se è il mio profilo oppure se è pubblica
  const canShowReview = isMe || game.isReviewPublic;

  return (
    <article className={`lx-profile-game-card ${isEditing ? "lx-profile-game-card--editing" : ""}`}>
      {/* Cover + azioni */}
      <div className="lx-profile-game-cover">
        {game.coverUrl && <img src={game.coverUrl} alt={game.title} loading="lazy" />}

        {isMe && (
          <div className="lx-profile-game-actions">
            {!isEditing && (
              <>
                <button type="button" className="lx-btn-icon lx-btn-icon-edit" onClick={() => setIsEditing(true)} title="Modifica">
                  <Edit3 size={16} />
                </button>
                <button type="button" className="lx-btn-icon lx-btn-icon-delete" onClick={handleDeleteClick} title="Rimuovi dalla libreria">
                  <Trash2 size={16} />
                </button>
              </>
            )}

            {isEditing && (
              <>
                <button type="button" className="lx-btn-icon lx-btn-icon-save" onClick={handleSave} disabled={saving} title="Salva">
                  <Save size={16} />
                </button>
                <button type="button" className="lx-btn-icon lx-btn-icon-cancel" onClick={handleCancel} disabled={saving} title="Annulla">
                  <X size={16} />
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Contenuto */}
      <div className="lx-profile-game-body">
        <div className="lx-profile-game-headline">
          <h3 className="lx-profile-game-title">{game.title}</h3>
          {game.lastUpdatedAt && (
            <div className="lx-profile-game-updated">
              <Calendar size={14} className="me-1" />
              <span>{new Date(game.lastUpdatedAt).toLocaleDateString("it-IT")}</span>
            </div>
          )}
        </div>

        {/* Meta row: status + piattaforme */}
        <div className="lx-profile-game-meta">
          <div>
            {isEditing ? (
              <select className="form-select form-select-sm lx-profile-status-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                {STATUS_ORDER.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_CONFIG[s].label}
                  </option>
                ))}
              </select>
            ) : (
              <StatusPill status={game.status} small />
            )}
          </div>

          {game.platform?.length > 0 && (
            <div className="lx-profile-game-platforms">
              <Monitor size={14} className="me-1" />
              <span>{game.platform.slice(0, 3).join(" • ")}</span>
              {game.platform.length > 3 && <span className="text-muted ms-1">+{game.platform.length - 3}</span>}
            </div>
          )}
        </div>

        {/* Rating + progress */}
        <div className="lx-profile-game-middle">
          <div className="lx-profile-game-rating">
            {isEditing ? (
              <div className="d-flex align-items-center gap-2">
                <input type="range" min="0" max="5" step="1" value={rating} onChange={(e) => setRating(parseInt(e.target.value, 10))} />
                <span className="lx-profile-rating-value">{rating}/5</span>
              </div>
            ) : (
              <>
                <StarRating rating={game.rating ?? 0} size="sm" />
                <span className="lx-profile-rating-value ms-1">{typeof game.rating === "number" && game.rating > 0 ? game.rating : "N/D"}</span>
              </>
            )}
          </div>

          <div className="lx-profile-game-progress">
            {isEditing ? (
              <div className="d-flex align-items-center gap-2 w-100">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={progress}
                  onChange={(e) => setProgress(parseInt(e.target.value, 10))}
                  className="flex-grow-1"
                />
                <span className="lx-profile-progress-label">{progress}%</span>
              </div>
            ) : (
              <ProgressBar progress={game.progress ?? 0} status={game.status} />
            )}
          </div>
        </div>

        {/* Review */}
        {canShowReview && (
          <div className="lx-profile-game-review">
            {isEditing ? (
              <>
                <textarea
                  className="form-control form-control-sm lx-profile-review-textarea"
                  rows={2}
                  placeholder="Scrivi una breve recensione..."
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                />
                <label className="lx-profile-review-toggle">
                  <input type="checkbox" checked={isReviewPublic} onChange={(e) => setIsReviewPublic(e.target.checked)} />
                  <span>Recensione pubblica</span>
                </label>
              </>
            ) : (
              game.review && <p className="lx-profile-review-text">{game.review}</p>
            )}
          </div>
        )}
      </div>
    </article>
  );
};
export default ProfileGameCard;
