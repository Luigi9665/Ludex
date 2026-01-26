import { useState } from "react";
import { useSelector } from "react-redux";
import { X, Save, Trash2 } from "lucide-react";
import { STATUS_CONFIG, STATUS_ORDER } from "../../config/profileStatusConfig";
import { useToast } from "../ui/ToastProvider";
import ConfirmDialog from "../ui/ConfirmDialog";

const MAX_RATING = 5;

const ProfileGameEditOverlay = ({ game, isMe, onUpdate, onDelete, onClose }) => {
  const userGameId = game.userGameId ?? game.userGameID ?? game.usergameId ?? game.id;

  const { LoadingPatch, LoadingDelete, ErrorPatch, ErrorDelete } = useSelector((state) => state.modifiedUsergame);

  const { addToast } = useToast();

  // Stato iniziale (come arriva dal backend)
  const initialStatus = game.status;
  const initialRating = game.rating ?? 0;
  const initialProgress = game.progress ?? 0;
  const initialReview = game.review ?? "";
  const initialIsReviewPublic = game.isReviewPublic ?? false;

  // Stato locale
  const [status, setStatus] = useState(initialStatus);
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(null);
  const [progress, setProgress] = useState(initialProgress);
  const [review, setReview] = useState(initialReview);
  const [isReviewPublic, setIsReviewPublic] = useState(initialIsReviewPublic);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [localError, setLocalError] = useState("");

  if (!isMe) return null;

  const isBusy = LoadingPatch || LoadingDelete;
  const titleId = `lx-profile-edit-title-${userGameId || "modal"}`;
  const progressFill = `${progress}%`;
  const effectiveRating = hoverRating ?? rating;

  const isBacklog = status === "Backlog";
  const isCompleted = status === "Completed";
  const hasPlayed = !isBacklog || progress > 0; // stesso concetto del backend
  const trimmedReview = (review ?? "").trim();

  // È stato modificato qualcosa?
  const isDirty =
    status !== initialStatus ||
    rating !== initialRating ||
    progress !== initialProgress ||
    trimmedReview !== initialReview.trim() ||
    isReviewPublic !== initialIsReviewPublic;

  // ---- VALIDAZIONE DOMINIO (speculare al backend) ----
  const validateDomain = () => {
    // Progress 0–100
    if (progress < 0 || progress > 100) {
      return "Il progresso deve essere compreso tra 0 e 100%.";
    }

    // Backlog → progress = 0
    if (isBacklog && progress !== 0) {
      return "Se il gioco è in Backlog, il progresso deve essere 0%.";
    }

    // Completed → progress = 100
    if (isCompleted && progress !== 100) {
      return "Se il gioco è completato, il progresso deve essere 100%.";
    }

    const hasRatingValue = typeof rating === "number" && rating > 0;

    // Rating: consentito solo dopo aver giocato, e tra 1 e 5
    if (hasRatingValue) {
      if (!hasPlayed) {
        return "Puoi dare un voto solo dopo aver iniziato a giocare.";
      }
      if (rating < 1 || rating > 5) {
        return "Il voto deve essere compreso tra 1 e 5.";
      }
    }

    // Recensione pubblica: blocca il salvataggio finché non ci sono 20 caratteri
    if (isReviewPublic) {
      if (!hasPlayed) {
        return "Puoi pubblicare una recensione solo dopo aver giocato almeno un po'.";
      }
      if (!trimmedReview || trimmedReview.length < 20) {
        return "La recensione pubblica deve avere almeno 20 caratteri.";
      }
    }

    return null;
  };

  const domainError = validateDomain();
  const effectiveError = localError || domainError || ErrorPatch || ErrorDelete || "";

  // Salvataggio possibile solo se:
  // - qualcosa è cambiato (isDirty)
  // - non ci sono richieste in corso (isBusy === false)
  // - nessun errore di dominio
  // - nessun errore locale UX
  const canSave = isDirty && !isBusy && !domainError && !localError;

  // ---- HANDLER SALVATAGGIO ----
  const handleSave = async () => {
    if (!userGameId || isBusy) return;
    if (!isDirty) return;
    if (typeof onUpdate !== "function") return;

    const currentError = validateDomain();
    if (currentError) {
      setLocalError(currentError);
      addToast(currentError, "error");
      return;
    }

    setLocalError("");

    try {
      await onUpdate(userGameId, {
        // qui passiamo ancora le stringhe ("Backlog", "Playing", ...),
        // la conversione a enum numerico la fa loadPatchUsergame → mapStatusToEnum
        status,
        rating,
        progress,
        review,
        isReviewPublic,
      });

      addToast("Gioco aggiornato con successo!", "success");
      onClose();
    } catch (e) {
      console.log(e);
      addToast("Errore durante l'aggiornamento del gioco.", "error");
    }
  };

  // ---- DELETE ----
  const openDeleteConfirm = () => {
    if (!userGameId || isBusy) return;
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!userGameId || isBusy) return;
    if (typeof onDelete !== "function") return;

    try {
      await onDelete(userGameId);
      addToast("Gioco rimosso dalla libreria.", "success");
      setShowDeleteConfirm(false);
      onClose();
    } catch (e) {
      console.log(e);
      addToast("Errore durante la rimozione del gioco.", "error");
    }
  };

  // ---- UX: cambio stato ----
  const handleStatusChange = (nextStatus) => {
    setLocalError("");
    setStatus(nextStatus);

    // Se passa a Backlog → forzo progress = 0, rimuovo rating e review pubblica
    if (nextStatus === "Backlog") {
      if (progress !== 0) setProgress(0);
      if (rating !== 0) setRating(0);
      if (isReviewPublic) setIsReviewPublic(false);
    }

    // Se passa a Completed → porto il progresso a 100
    if (nextStatus === "Completed" && progress !== 100) {
      setProgress(100);
    }
  };

  // ---- UX: slider progresso ----
  const handleProgressChange = (value) => {
    if (isBusy) return;

    const numeric = Number.isNaN(value) ? 0 : value;
    setProgress(numeric);
    setLocalError("");

    // Se aumenta il progresso da Backlog → segniamo Playing
    if (numeric > 0 && status === "Backlog") {
      setStatus("Playing");
    }

    // Se torna a 0 e non c’è rating né review pubblica → torniamo a Backlog
    if (numeric === 0 && status !== "Backlog" && rating === 0 && !isReviewPublic && !trimmedReview) {
      setStatus("Backlog");
    }
  };

  // ---- UX: rating a stelle ----
  const handleClickStar = (value) => {
    if (isBusy) return;

    // se è in Backlog e non ha ancora progredito, ma clicca rating → Playing
    if (status === "Backlog" && progress === 0) {
      setStatus("Playing");
    }

    setRating(value);
    setLocalError("");
  };

  const handleStarEnter = (value) => {
    if (isBusy) return;
    setHoverRating(value);
  };

  const handleStarLeave = () => {
    setHoverRating(null);
  };

  // ---- UX: toggle recensione pubblica ----
  const handleToggleReviewPublic = (checked) => {
    if (isBusy) return;

    if (checked) {
      if (!hasPlayed) {
        const msg = "Per rendere pubblica la recensione devi aver iniziato il gioco.";
        setLocalError(msg);
        addToast(msg, "error");
        return;
      }
      if (!trimmedReview || trimmedReview.length < 20) {
        const msg = "La recensione pubblica deve avere almeno 20 caratteri.";
        setLocalError(msg);
        addToast(msg, "error");
        return;
      }
    }

    setLocalError("");
    setIsReviewPublic(checked);
  };

  const handleCloseClick = () => {
    if (isBusy) return;
    onClose();
  };

  return (
    <div className="lx-profile-edit-overlay">
      <div className="lx-profile-edit-backdrop" />
      <div className="lx-profile-edit-card-wrapper">
        <article className="lx-profile-edit-card" role="dialog" aria-modal="true" aria-labelledby={titleId}>
          {/* Header */}
          <div className="lx-profile-edit-header">
            <div className="lx-profile-edit-title">
              <h3 id={titleId} className="mb-0">
                {game.title}
              </h3>
              <span className="lx-profile-edit-sub">Modifica stato, progresso, rating e recensione</span>
            </div>
            <button type="button" className="lx-btn-icon lx-btn-icon-cancel" onClick={handleCloseClick} disabled={isBusy} aria-label="Chiudi editor">
              <X size={18} />
            </button>
          </div>

          <div className="lx-profile-edit-body">
            {/* Colonna sinistra: cover + info */}
            <div className="lx-profile-edit-left">
              <div className="lx-profile-edit-cover">{game.coverUrl && <img src={game.coverUrl} alt={game.title} />}</div>
              <div className="lx-profile-edit-meta">
                <span className="lx-profile-edit-label">Piattaforme</span>
                <p className="mb-1">{game.platform?.length ? game.platform.join(" • ") : "Nessuna piattaforma indicata"}</p>
                <span className="lx-profile-edit-label">Stato attuale</span>
                <p className="mb-0">{STATUS_CONFIG[status]?.label ?? status}</p>
              </div>
            </div>

            {/* Colonna destra: form */}
            <div className="lx-profile-edit-right">
              {/* Stato */}
              <div className="mb-3 lx-profile-edit-field">
                <label className="form-label form-label-sm">Stato</label>
                <select
                  className="form-select form-select-sm lx-profile-status-select"
                  value={status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  disabled={isBusy}
                >
                  {STATUS_ORDER.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_CONFIG[s].label}
                    </option>
                  ))}
                </select>
                {status === "Backlog" && (
                  <div className="lx-profile-edit-hint">
                    In <strong>Backlog</strong> il progresso viene mantenuto a <strong>0%</strong>. Appena aumenti il progresso, lo stato passerà
                    automaticamente a <strong>In corso</strong>.
                  </div>
                )}
                {status === "Completed" && (
                  <div className="lx-profile-edit-hint">
                    In <strong>Completato</strong> il progresso viene impostato a <strong>100%</strong>.
                  </div>
                )}
              </div>

              {/* Rating */}
              <div className="mb-3 lx-profile-edit-field">
                <label className="form-label form-label-sm d-flex justify-content-between">
                  <span>Rating</span>
                  <span className="lx-profile-rating-value">
                    {effectiveRating}/{MAX_RATING}
                  </span>
                </label>
                <div className="lx-profile-edit-stars">
                  {Array.from({ length: MAX_RATING }).map((_, idx) => {
                    const value = idx + 1;
                    const active = value <= effectiveRating;
                    return (
                      <button
                        key={value}
                        type="button"
                        className={"lx-profile-edit-star" + (active ? " lx-profile-edit-star--active" : "")}
                        onClick={() => handleClickStar(value)}
                        onMouseEnter={() => handleStarEnter(value)}
                        onMouseLeave={handleStarLeave}
                        aria-label={`Imposta rating a ${value} su ${MAX_RATING}`}
                        disabled={isBusy}
                      >
                        ★
                      </button>
                    );
                  })}
                </div>
                {!hasPlayed && (
                  <div className="lx-profile-edit-hint">Per dare un voto devi prima iniziare a giocare (cambia stato da Backlog o aumenta il progresso).</div>
                )}
              </div>

              {/* Progresso */}
              <div className="mb-3 lx-profile-edit-field">
                <label className="form-label form-label-sm d-flex justify-content-between">
                  <span>Progresso</span>
                  <span className="lx-profile-progress-label">{progress}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={progress}
                  onChange={(e) => handleProgressChange(parseInt(e.target.value, 10))}
                  className="form-range lx-profile-edit-slider"
                  style={{ "--lx-slider-fill": progressFill }}
                  disabled={isBusy}
                />
                {status === "Backlog" && (
                  <div className="lx-profile-edit-hint">
                    Aumentando il progresso lo stato passerà automaticamente a <strong>In corso</strong>.
                  </div>
                )}
                {status === "Completed" && (
                  <div className="lx-profile-edit-hint">
                    Il progresso di un gioco completato deve rimanere al <strong>100%</strong>.
                  </div>
                )}
              </div>

              {/* Recensione + toggle pubblico */}
              <div className="mb-3 lx-profile-edit-field">
                <label className="form-label form-label-sm">Recensione</label>
                <textarea
                  className="form-control form-control-sm lx-profile-review-textarea"
                  rows={3}
                  placeholder="Scrivi una breve recensione..."
                  value={review}
                  onChange={(e) => {
                    const value = e.target.value;
                    const trimmed = value.trim();

                    setReview(value);

                    if (isReviewPublic && trimmed.length >= 20 && (!isBacklog || progress > 0)) {
                      setLocalError("");
                    }
                  }}
                  disabled={isBusy}
                />

                <div className="d-flex justify-content-between align-items-center mt-1">
                  <span className="lx-profile-edit-hint">
                    {isReviewPublic && trimmedReview.length < 20
                      ? `Ancora ${20 - trimmedReview.length} caratteri per rendere la recensione pubblica.`
                      : "Una buona recensione aiuta gli altri giocatori a capire se il titolo fa per loro."}
                  </span>
                  <span className="lx-profile-edit-counter">{trimmedReview.length}/20</span>
                </div>

                <label className="lx-profile-review-toggle mt-2">
                  <span className="lx-switch">
                    <input type="checkbox" checked={isReviewPublic} onChange={(e) => handleToggleReviewPublic(e.target.checked)} disabled={isBusy} />
                    <span className="lx-switch-track">
                      <span className="lx-switch-thumb" />
                    </span>
                  </span>
                  <span className="lx-switch-label">Recensione pubblica</span>
                </label>
              </div>

              {/* Alert errori inline */}
              {effectiveError && <div className="lx-profile-edit-alert">{effectiveError}</div>}

              {/* Azioni */}
              <div className="lx-profile-edit-actions">
                <button type="button" className="btn btn-sm btn-outline-danger me-auto d-flex align-items-center" onClick={openDeleteConfirm} disabled={isBusy}>
                  {LoadingDelete ? (
                    <>
                      <span className="lx-btn-spinner me-2" aria-hidden="true" />
                      Rimozione...
                    </>
                  ) : (
                    <>
                      <Trash2 size={14} className="me-1" />
                      Rimuovi dalla libreria
                    </>
                  )}
                </button>

                <button type="button" className="btn btn-sm btn-outline-secondary me-2" onClick={handleCloseClick} disabled={isBusy}>
                  Annulla
                </button>

                <button type="button" className="btn btn-sm lx-btn-primary" onClick={handleSave} disabled={!canSave}>
                  {LoadingPatch ? (
                    <>
                      <span className="lx-btn-spinner me-2" aria-hidden="true" />
                      Salvataggio...
                    </>
                  ) : (
                    <>
                      <Save size={14} className="me-1" />
                      Salva
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </article>

        {/* Modale di conferma per la delete */}
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
      </div>
    </div>
  );
};

export default ProfileGameEditOverlay;
