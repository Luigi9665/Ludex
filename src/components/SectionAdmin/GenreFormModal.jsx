import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { createAdminGenre, updateAdminGenre } from "../../redux/action/index";

/**
 * Modal per creare / modificare un Genere.
 *
 * Props:
 * - isOpen: boolean
 * - onClose: () => void
 * - genre: oggetto genere (camelCase) o null
 * - onSave: () => void  (es: per chiudere + eventuale logica extra)
 * - onSuccess?: (message: string) => void  (per toast success)
 * - onError?: (message: string) => void    (per toast error)
 */
export default function GenreFormModal({ isOpen, onClose, genre, onSave, onSuccess, onError }) {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: "",
    keywordsIt: "", // 🔹 nuovo campo
  });

  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (genre) {
      setFormData({
        name: genre.name || "",
        keywordsIt: genre.keywordsIt || "", // 🔹 prefill da backend
      });
    } else {
      setFormData({
        name: "",
        keywordsIt: "",
      });
    }
    setErrors({});
  }, [genre, isOpen]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Il nome è obbligatorio.";
    }
    // keywordsIt rimane opzionale → nessuna validazione hard
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSaving(true);
    setErrors((prev) => ({ ...prev, submit: undefined }));

    const payloadName = formData.name.trim();
    const payloadKeywords = formData.keywordsIt?.trim() || null;

    try {
      if (genre) {
        // UPDATE 🔹 ora passiamo anche le keywords
        await dispatch(updateAdminGenre(genre.id, { name: payloadName, keywordsIt: payloadKeywords }));
        onSuccess?.(`Genere "${payloadName}" aggiornato.`);
      } else {
        // CREATE 🔹 idem qui
        await dispatch(createAdminGenre({ name: payloadName, keywordsIt: payloadKeywords }));
        onSuccess?.(`Genere "${payloadName}" creato.`);
      }

      onSave?.();
      onClose();
    } catch (err) {
      const msg = err?.message || "Errore durante il salvataggio del genere. Riprova.";
      setErrors((prev) => ({ ...prev, submit: msg }));
      onError?.(msg);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="lx-modal-backdrop" onClick={onClose} />
      <div className="lx-modal-panel">
        <div className="lx-modal-header">
          <h3 className="lx-modal-title">
            <i className="bi bi-collection me-2" />
            {genre ? "Modifica genere" : "Nuovo genere"}
          </h3>
          <button className="lx-modal-close" onClick={onClose} disabled={isSaving}>
            <i className="bi bi-x-lg" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="lx-modal-body">
            {/* Nome */}
            <div className="lx-form-group">
              <label className="lx-form-label" htmlFor="genre-name">
                Nome <span className="lx-required">*</span>
              </label>
              <input
                id="genre-name"
                type="text"
                className={`lx-form-input ${errors.name ? "lx-input-error" : ""}`}
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="es. Action, RPG, Strategy"
                disabled={isSaving}
              />
              {errors.name && <span className="lx-form-error">{errors.name}</span>}
            </div>

            {/* 🔹 Keywords IT (nuovo campo) */}
            <div className="lx-form-group">
              <label className="lx-form-label" htmlFor="genre-keywords">
                Parole chiave (IT) <span className="text-white-50">(opzionale)</span>
              </label>
              <textarea
                id="genre-keywords"
                className="lx-form-textarea"
                rows={3}
                value={formData.keywordsIt}
                onChange={(e) => setFormData((prev) => ({ ...prev, keywordsIt: e.target.value }))}
                placeholder='es. "avventura narrativa, esplorazione, storia, puzzle"'
                disabled={isSaving}
              />
              <span className="lx-form-hint">
                Usa una lista di parole/frasi separate da virgole che descrivono il genere (in italiano). Verranno usate per i suggerimenti automatici.
              </span>
            </div>

            {errors.submit && (
              <div className="lx-alert lx-alert-error mt-3">
                <i className="bi bi-exclamation-triangle me-2" />
                {errors.submit}
              </div>
            )}
          </div>

          <div className="lx-modal-footer">
            <button type="button" className="lx-btn lx-btn-outline" onClick={onClose} disabled={isSaving}>
              Annulla
            </button>
            <button type="submit" className="lx-btn lx-btn-primary" disabled={isSaving}>
              {isSaving ? (
                <>
                  <span className="lx-spinner-sm me-2" />
                  Salvataggio...
                </>
              ) : (
                <>
                  <i className="bi bi-check-lg me-2" />
                  {genre ? "Salva modifiche" : "Crea genere"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
