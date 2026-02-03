// src/components/admin/modals/MetadataFormModal.jsx
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  createAdminMetadataFocus,
  updateAdminMetadataFocus,
  createAdminMetadataMood,
  updateAdminMetadataMood,
  createAdminMetadataDifficulty,
  updateAdminMetadataDifficulty,
} from "../../redux/action/index";

const typeLabels = {
  focus: "Focus",
  mood: "Mood",
  difficulty: "Difficoltà",
};

const typeIcons = {
  focus: "bi-bullseye",
  mood: "bi-emoji-smile",
  difficulty: "bi-speedometer2",
};

export default function MetadataFormModal({
  isOpen,
  onClose,
  metadata, // oggetto camelCase o null
  metadataType, // 'focus' | 'mood' | 'difficulty'
  onSave,
  onSuccess,
  onError,
}) {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
  });
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (metadata) {
      setFormData({
        name: metadata.name || "",
        code: metadata.code || "",
        description: metadata.description || "",
      });
    } else {
      setFormData({
        name: "",
        code: "",
        description: "",
      });
    }
    setErrors({});
  }, [metadata, isOpen]);

  const handleCodeChange = (value) => {
    const formatted = value.toUpperCase().replace(/[^A-Z0-9_]/g, "_");
    setFormData((prev) => ({ ...prev, code: formatted }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Il nome è obbligatorio.";
    }
    if (!metadata && !formData.code.trim()) {
      // in edit non permetto cambiare il code, quindi non lo richiedo
      newErrors.code = "Il codice è obbligatorio.";
    }
    if (formData.code && !/^[A-Z0-9_]+$/.test(formData.code)) {
      newErrors.code = "Il codice deve contenere solo lettere maiuscole, numeri e underscore.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getCreateThunk = () => {
    switch (metadataType) {
      case "focus":
        return createAdminMetadataFocus;
      case "mood":
        return createAdminMetadataMood;
      case "difficulty":
        return createAdminMetadataDifficulty;
      default:
        throw new Error(`Tipo metadata non supportato: ${metadataType}`);
    }
  };

  const getUpdateThunk = () => {
    switch (metadataType) {
      case "focus":
        return updateAdminMetadataFocus;
      case "mood":
        return updateAdminMetadataMood;
      case "difficulty":
        return updateAdminMetadataDifficulty;
      default:
        throw new Error(`Tipo metadata non supportato: ${metadataType}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSaving(true);
    setErrors((prev) => ({ ...prev, submit: undefined }));

    try {
      if (metadata) {
        // UPDATE (non tocchiamo il code)
        const updateThunk = getUpdateThunk();
        await dispatch(
          updateThunk(metadata.id, {
            name: formData.name,
            description: formData.description || null,
          }),
        );
        onSuccess?.(`${typeLabels[metadataType]} "${formData.name}" aggiornato.`);
      } else {
        // CREATE
        const createThunk = getCreateThunk();
        await dispatch(
          createThunk({
            code: formData.code,
            name: formData.name,
            description: formData.description || null,
          }),
        );
        onSuccess?.(`${typeLabels[metadataType]} "${formData.name}" creato.`);
      }

      onSave?.();
      onClose();
    } catch (err) {
      const msg = err?.message || "Errore durante il salvataggio del metadata.";
      setErrors((prev) => ({ ...prev, submit: msg }));
      onError?.(msg);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  const label = typeLabels[metadataType] || "Metadata";
  const icon = typeIcons[metadataType] || "bi-gear";

  return (
    <>
      <div className="lx-modal-backdrop" onClick={onClose} />
      <div className="lx-modal-panel">
        <div className="lx-modal-header">
          <h3 className="lx-modal-title">
            <i className={`bi ${icon} me-2`} />
            {metadata ? `Modifica ${label}` : `Nuovo ${label}`}
          </h3>
          <button className="lx-modal-close" onClick={onClose} disabled={isSaving}>
            <i className="bi bi-x-lg" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="lx-modal-body">
            <div className="lx-form-group">
              <label className="lx-form-label" htmlFor="metadata-name">
                Nome <span className="lx-required">*</span>
              </label>
              <input
                id="metadata-name"
                type="text"
                className={`lx-form-input ${errors.name ? "lx-input-error" : ""}`}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={metadataType === "focus" ? "es. Story-driven" : metadataType === "mood" ? "es. Epico" : "es. Moderata"}
                disabled={isSaving}
              />
              {errors.name && <span className="lx-form-error">{errors.name}</span>}
            </div>

            <div className="lx-form-group">
              <label className="lx-form-label" htmlFor="metadata-code">
                Codice tecnico {!metadata && <span className="lx-required">*</span>}
              </label>
              <input
                id="metadata-code"
                type="text"
                className={`lx-form-input lx-font-mono ${errors.code ? "lx-input-error" : ""}`}
                value={formData.code}
                onChange={(e) => handleCodeChange(e.target.value)}
                placeholder={metadataType === "focus" ? "es. STORY" : metadataType === "mood" ? "es. EPIC" : "es. MODERATE"}
                disabled={isSaving || !!metadata}
              />
              {errors.code && <span className="lx-form-error">{errors.code}</span>}
              <small className="lx-form-hint">Solo maiuscole, numeri e underscore</small>
            </div>

            <div className="lx-form-group">
              <label className="lx-form-label" htmlFor="metadata-description">
                Descrizione
              </label>
              <textarea
                id="metadata-description"
                className="lx-form-input lx-form-textarea"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="3"
                disabled={isSaving}
              />
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
                  {metadata ? "Salva modifiche" : `Crea ${label}`}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
