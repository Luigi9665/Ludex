import { useState, useEffect } from "react";
import { apiFetch } from "../../apiFetch Autenticate/apiFetch.js";

const statusOptions = [
  { labelEn: "Backlog", labelIt: "Da giocare", value: 0 },
  { labelEn: "Playing", labelIt: "In corso", value: 1 },
  { labelEn: "Paused", labelIt: "In pausa", value: 2 },
  { labelEn: "Dropped", labelIt: "Abbandonato", value: 3 },
  { labelEn: "Completed", labelIt: "Completato", value: 4 },
];

const COMPLETED_STATUS = 4;
const BACKLOG_STATUS = 0;

const AddToLibraryModal = ({ game, open, onClose, onSaved }) => {
  const [status, setStatus] = useState(BACKLOG_STATUS);
  const [progress, setProgress] = useState(0);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [isReviewPublic, setIsReviewPublic] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [step, setStep] = useState(1); // 1 = stato, 2 = dettagli

  // Reset dei campi ogni volta che apri il modal su un gioco
  useEffect(() => {
    if (open && game) {
      setStatus(BACKLOG_STATUS);
      setProgress(0);
      setRating(0);
      setReview("");
      setIsReviewPublic(true);
      setErrorMsg("");
      setSuccessMsg("");
      setSubmitting(false);
      setStep(1);
    }
  }, [open, game]);

  // Blocca scroll body quando il modal è aperto
  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prevOverflow || "";
    };
  }, [open]);

  if (!open || !game) return null;

  const handleStatusChange = (e) => {
    const value = Number(e.target.value);
    setStatus(value);

    // se Completed → progress 100 fisso
    if (value === COMPLETED_STATUS) {
      setProgress(100);
    }
  };

  // funzione che fa davvero la POST
  const saveUserGame = async () => {
    setErrorMsg("");
    setSuccessMsg("");
    setSubmitting(true);

    try {
      const effectiveProgress = status === BACKLOG_STATUS ? 0 : Number(progress);

      const effectiveRating = status === BACKLOG_STATUS ? 0 : rating || 0; // adegua se il backend non accetta null

      const payload = {
        gameId: game.gameId,
        status,
        progress: effectiveProgress,
        rating: effectiveRating,
        review: status === BACKLOG_STATUS ? null : review?.trim() || null,
        // backlog: forziamo comunque false per stare allineati al dominio
        isReviewPublic: status === BACKLOG_STATUS ? false : isReviewPublic,
      };

      const res = await apiFetch("/api/UserGames/CreateUserGame", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let msg = "Impossibile aggiungere il gioco alla libreria.";
        try {
          const data = await res.json();
          if (data?.message) msg = data.message;
        } catch (parseErr) {
          console.error("Errore nel parsing della risposta errore", parseErr);
        }
        throw new Error(msg);
      }

      setSuccessMsg("Gioco aggiunto alla tua libreria!");
      if (onSaved) onSaved(game.gameId);

      setTimeout(() => {
        setSubmitting(false);
        setSuccessMsg("");
        onClose();
      }, 600);
    } catch (err) {
      setSubmitting(false);
      setErrorMsg(err.message || "Errore imprevisto durante il salvataggio.");
    }
  };

  // submit del form (gestisce i 2 step)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // STEP 1: scelta stato (+ flag pubblico)
    if (step === 1) {
      // se backlog → salviamo subito senza passare dai dettagli
      if (status === BACKLOG_STATUS) {
        setRating(0);
        setProgress(0);
        await saveUserGame();
        return;
      }

      // altrimenti vai allo step 2
      setStep(2);
      return;
    }

    // STEP 2: salva tutto (progress, rating, review, ecc.)
    if (step === 2) {
      await saveUserGame();
    }
  };

  const handleRatingClick = (value) => {
    setRating((prev) => (prev === value ? 0 : value));
  };

  return (
    <div className="lx-modal-backdrop">
      <div className="lx-modal-panel lx-glass">
        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <h5 className="mb-1">Aggiungi alla tua libreria</h5>
            <p className="mb-0 small text-white-50">{game.title}</p>
          </div>
          <button type="button" className="btn-close btn-close-white" aria-label="Chiudi" onClick={onClose} />
        </div>

        {/* MINI STEPPER */}
        <div className="lx-modal-steps mb-3">
          <div className={`lx-step-chip ${step === 1 ? "is-active" : ""}`}>
            <span className="lx-step-index">1</span>
            <span className="lx-step-label">Stato</span>
          </div>
          <div className={`lx-step-chip ${step === 2 ? "is-active" : ""}`}>
            <span className="lx-step-index">2</span>
            <span className="lx-step-label">Dettagli</span>
          </div>
        </div>

        <form className="d-grid gap-3" onSubmit={handleSubmit}>
          {/* STEP 1: STATO + scelta review pubblica */}
          {step === 1 && (
            <>
              <div>
                <label className="form-label lx-field-label">Stato del gioco</label>
                <select className="form-select lx-field-control" value={status} onChange={handleStatusChange}>
                  {statusOptions.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.labelEn} ({s.labelIt})
                    </option>
                  ))}
                </select>
                <small className="text-white-50 small">Backlog = lo vuoi giocare più avanti, Playing = lo stai giocando, Completed = finito.</small>
              </div>

              {/* FLAG PUBBLICO GIÀ AL PRIMO STEP */}
              <div>
                <label className="form-check-label d-flex align-items-start gap-2 small text-white-50">
                  <input
                    type="checkbox"
                    className="form-check-input mt-1"
                    checked={status === BACKLOG_STATUS ? false : isReviewPublic}
                    onChange={(e) => setIsReviewPublic(e.target.checked)}
                    disabled={status === BACKLOG_STATUS}
                  />
                  <span>
                    Rendi pubblica la recensione quando la inserirai.
                    {status === BACKLOG_STATUS && (
                      <span className="d-block text-white-50">Per i giochi in Backlog le recensioni resteranno private finché non inizierai a giocarli.</span>
                    )}
                  </span>
                </label>
              </div>

              {errorMsg && <div className="alert alert-danger py-2 mb-0">{errorMsg}</div>}
              {successMsg && <div className="alert alert-success py-2 mb-0">{successMsg}</div>}

              <div className="d-flex justify-content-end gap-2 mt-2">
                <button type="button" className="btn btn-sm lx-btn-outline" onClick={onClose} disabled={submitting}>
                  Annulla
                </button>
                <button type="submit" className="btn btn-sm lx-btn-primary" disabled={submitting}>
                  {status === BACKLOG_STATUS ? (submitting ? "Salvataggio..." : "Salva come Backlog") : "Avanti"}
                </button>
              </div>
            </>
          )}

          {/* STEP 2: DETTAGLI (solo se non backlog) */}
          {step === 2 && (
            <>
              {/* PROGRESS */}
              <div>
                <label className="form-label lx-field-label d-flex justify-content-between">
                  <span>Progress</span>
                  <span className="small text-white-50">{progress}%</span>
                </label>
                <div className="lx-progress-bar-shell mb-1">
                  <div className="lx-progress-bar-fill" style={{ width: `${progress}%` }} />
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  className="form-range lx-progress-range"
                  value={progress}
                  onChange={(e) => setProgress(Number(e.target.value))}
                  disabled={status === COMPLETED_STATUS}
                />
                {status === COMPLETED_STATUS && <small className="text-white-50 small">Stato completato: progress bloccato al 100%.</small>}
              </div>

              {/* RATING a STELLE */}
              <div>
                <label className="form-label lx-field-label d-flex justify-content-between">
                  <span>Valutazione</span>
                  <span className="small text-white-50">{rating ? `${rating}/5` : "Facoltativo"}</span>
                </label>
                <div className="lx-rating-stars-row">
                  {[1, 2, 3, 4, 5].map((v) => (
                    <button key={v} type="button" className="lx-rating-star-btn" onClick={() => handleRatingClick(v)}>
                      <i className={`bi ${rating >= v ? "bi-star-fill" : "bi-star"}`} />
                    </button>
                  ))}
                </div>
              </div>

              {/* REVIEW */}
              <div>
                <label className="form-label lx-field-label">Review</label>
                <textarea
                  className="form-control lx-field-control"
                  rows={3}
                  placeholder="Scrivi una breve recensione (facoltativa)..."
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                />
                <small className="text-white-50 small d-block mt-1">Se scegli di renderla pubblica, il dominio richiede almeno 20 caratteri.</small>
              </div>

              {errorMsg && <div className="alert alert-danger py-2 mb-0">{errorMsg}</div>}
              {successMsg && <div className="alert alert-success py-2 mb-0">{successMsg}</div>}

              <div className="d-flex justify-content-end gap-2 mt-2">
                <button type="button" className="btn btn-sm lx-btn-outline" onClick={() => setStep(1)} disabled={submitting}>
                  Indietro
                </button>
                <button type="submit" className="btn btn-sm lx-btn-primary" disabled={submitting}>
                  {submitting ? "Salvataggio..." : "Salva nella libreria"}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddToLibraryModal;
