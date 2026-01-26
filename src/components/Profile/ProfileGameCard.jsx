import { useState } from "react";
import { useSelector } from "react-redux";
import { Calendar, Monitor, Edit3, Trash2 } from "lucide-react";
import StarRating from "../StarRating";
import { STATUS_CONFIG } from "../../config/profileStatusConfig";
import ConfirmDialog from "../ui/ConfirmDialog";
import { useToast } from "../ui/ToastProvider";

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

const ProfileGameCard = ({ game, isMe, onEdit, onDelete }) => {
  const userGameId = game.userGameId ?? game.userGameID ?? game.usergameId ?? game.id;

  const { LoadingDelete } = useSelector((state) => state.modifiedUsergame);
  const { addToast } = useToast();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const openDeleteConfirm = () => {
    if (!isMe || !userGameId) return;
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!isMe || !userGameId) return;
    if (typeof onDelete !== "function") return;

    try {
      await onDelete(userGameId);
      addToast("Gioco rimosso dalla libreria.", "success");
      setShowDeleteConfirm(false);
    } catch (e) {
      console.error(e);
      addToast("Errore durante la rimozione del gioco.", "error");
    }
  };

  const handleEditClick = () => {
    if (typeof onEdit !== "function") return;
    onEdit(game);
  };

  return (
    <>
      <article className="lx-profile-game-card">
        {/* Cover + azioni */}
        <div className="lx-profile-game-cover">
          {game.coverUrl && <img src={game.coverUrl} alt={game.title} loading="lazy" />}

          {isMe && (
            <div className="lx-profile-game-actions">
              <button type="button" className="lx-btn-icon lx-btn-icon-edit" onClick={handleEditClick} title="Modifica" disabled={LoadingDelete}>
                <Edit3 size={16} />
              </button>
              <button
                type="button"
                className="lx-btn-icon lx-btn-icon-delete"
                onClick={openDeleteConfirm}
                title="Rimuovi dalla libreria"
                disabled={LoadingDelete}
              >
                {LoadingDelete ? <span className="lx-btn-spinner" aria-hidden="true" /> : <Trash2 size={16} />}
              </button>
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

          <div className="lx-profile-game-meta">
            <StatusPill status={game.status} small />

            {game.platform?.length > 0 && (
              <div className="lx-profile-game-platforms">
                <Monitor size={14} className="me-1" />
                <span>{game.platform.slice(0, 3).join(" • ")}</span>
                {game.platform.length > 3 && <span className="text-muted ms-1">+{game.platform.length - 3}</span>}
              </div>
            )}
          </div>

          <div className="lx-profile-game-middle">
            <div className="lx-profile-game-rating">
              <StarRating rating={game.rating ?? 0} size="sm" />
              <span className="lx-profile-rating-value ms-1">{typeof game.rating === "number" && game.rating > 0 ? game.rating : "N/D"}</span>
            </div>

            <div className="lx-profile-game-progress">
              <div className="lx-profile-progress">
                <div className="lx-profile-progress-bar">
                  <div
                    className="lx-profile-progress-fill"
                    style={{
                      width: `${game.progress ?? 0}%`,
                      background: STATUS_CONFIG[game.status]?.gradient || STATUS_CONFIG.Backlog.gradient,
                    }}
                  />
                </div>
                <span className="lx-profile-progress-label">{game.progress ?? 0}%</span>
              </div>
            </div>
          </div>

          {game.review && (
            <div className="lx-profile-game-review">
              <p className="lx-profile-review-text">{game.review}</p>
            </div>
          )}
        </div>
      </article>

      {/* Modale di conferma per la delete dal card */}
      <ConfirmDialog
        open={showDeleteConfirm}
        title="Rimuovi gioco dalla libreria?"
        message={`Sei sicuro di voler rimuovere "${game.title}" dalla tua libreria?`}
        confirmLabel="Sì, rimuovi"
        cancelLabel="Annulla"
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
        loading={LoadingDelete}
      />
    </>
  );
};

export default ProfileGameCard;
