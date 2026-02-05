// src/components/admin/modals/TagFormModal.jsx
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { createAdminTag, updateAdminTag } from "../../redux/action/index";

export default function TagFormModal({
  isOpen,
  onClose,
  tag, // oggetto camelCase o null
  onSave,
  onSuccess,
  onError,
}) {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    displayName: "",
    code: "",
    category: "GENRE",
    description: "",
    keywordsIt: "",
    isActive: true,
    displayOrder: 0,
  });

  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (tag) {
      setFormData({
        displayName: tag.displayName || "",
        code: tag.code || "",
        category: tag.category || "GENRE",
        description: tag.description || "",
        keywordsIt: tag.keywordsIt || "",
        isActive: tag.isActive ?? true,
        displayOrder: tag.displayOrder || 0,
      });
    } else {
      setFormData({
        displayName: "",
        code: "",
        category: "GENRE",
        description: "",
        keywordsIt: "",
        isActive: true,
        displayOrder: 0,
      });
    }
    setErrors({});
  }, [tag, isOpen]);

  const handleCodeChange = (value) => {
    const formatted = value.toUpperCase().replace(/[^A-Z0-9_]/g, "_");
    setFormData((prev) => ({ ...prev, code: formatted }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.displayName.trim()) {
      newErrors.displayName = "Il nome visuale è obbligatorio.";
    }
    if (!formData.code.trim()) {
      newErrors.code = "Il codice è obbligatorio.";
    } else if (!/^[A-Z0-9_]+$/.test(formData.code)) {
      newErrors.code = "Il codice deve contenere solo lettere maiuscole, numeri e underscore.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSaving(true);
    setErrors((prev) => ({ ...prev, submit: undefined }));

    try {
      if (tag) {
        // UPDATE (non tocchiamo il code!)
        await dispatch(
          updateAdminTag(tag.id, {
            displayName: formData.displayName,
            category: formData.category,
            description: formData.description || null,
            keywordsIt: formData.keywordsIt?.trim() || null,
            isActive: formData.isActive,
            displayOrder: formData.displayOrder,
          }),
        );
        onSuccess?.(`Tag "${formData.displayName}" aggiornato.`);
      } else {
        // CREATE
        await dispatch(
          createAdminTag({
            code: formData.code,
            displayName: formData.displayName,
            category: formData.category,
            description: formData.description || null,
            keywordsIt: formData.keywordsIt?.trim() || null,
            isActive: formData.isActive,
            displayOrder: formData.displayOrder,
          }),
        );
        onSuccess?.(`Tag "${formData.displayName}" creato.`);
      }

      onSave?.();
      onClose();
    } catch (err) {
      const msg = err?.message || "Errore durante il salvataggio del tag.";
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
      <div className="lx-modal-panel lx-modal-lg">
        <div className="lx-modal-header">
          <h3 className="lx-modal-title">
            <i className="bi bi-tags me-2" />
            {tag ? "Modifica tag" : "Nuovo tag"}
          </h3>
          <button className="lx-modal-close" onClick={onClose} disabled={isSaving}>
            <i className="bi bi-x-lg" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="lx-modal-body">
            <div className="row g-3">
              <div className="col-12 col-md-6">
                <div className="lx-form-group">
                  <label className="lx-form-label" htmlFor="tag-displayName">
                    Nome visuale <span className="lx-required">*</span>
                  </label>
                  <input
                    id="tag-displayName"
                    type="text"
                    className={`lx-form-input ${errors.displayName ? "lx-input-error" : ""}`}
                    value={formData.displayName}
                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                    placeholder="es. Open World, Story Rich"
                    disabled={isSaving}
                  />
                  {errors.displayName && <span className="lx-form-error">{errors.displayName}</span>}
                </div>
              </div>

              <div className="col-12 col-md-6">
                <div className="lx-form-group">
                  <label className="lx-form-label" htmlFor="tag-code">
                    Codice tecnico <span className="lx-required">*</span>
                  </label>
                  <input
                    id="tag-code"
                    type="text"
                    className={`lx-form-input lx-font-mono ${errors.code ? "lx-input-error" : ""}`}
                    value={formData.code}
                    onChange={(e) => handleCodeChange(e.target.value)}
                    placeholder="es. OPEN_WORLD, STORY_RICH"
                    disabled={isSaving || !!tag} // se edit, non permetto cambio code
                  />
                  {errors.code && <span className="lx-form-error">{errors.code}</span>}
                  <small className="lx-form-hint">Solo maiuscole, numeri e underscore</small>
                </div>
              </div>

              <div className="col-12 col-md-6">
                <div className="lx-form-group">
                  <label className="lx-form-label" htmlFor="tag-category">
                    Categoria
                  </label>
                  <select
                    id="tag-category"
                    className="lx-form-select"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    disabled={isSaving}
                  >
                    <option value="GENRE">GENRE</option>
                    <option value="FEATURE">FEATURE</option>
                    <option value="EXPERIENCE">EXPERIENCE</option>
                  </select>
                </div>
              </div>

              <div className="col-12 col-md-6">
                <div className="lx-form-group">
                  <label className="lx-form-label" htmlFor="tag-displayOrder">
                    Ordine visualizzazione
                  </label>
                  <input
                    id="tag-displayOrder"
                    type="number"
                    className="lx-form-input"
                    value={formData.displayOrder}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        displayOrder: parseInt(e.target.value, 10) || 0,
                      })
                    }
                    disabled={isSaving}
                  />
                </div>
              </div>

              <div className="col-12">
                <div className="lx-form-group">
                  <label className="lx-form-label" htmlFor="tag-description">
                    Descrizione
                  </label>
                  <textarea
                    id="tag-description"
                    className="lx-form-input lx-form-textarea"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="3"
                    disabled={isSaving}
                  />
                </div>
              </div>

              {/* Nuovo campo KEYWORDS */}
              <div className="col-12">
                <div className="lx-form-group">
                  <label className="lx-form-label" htmlFor="tag-keywords">
                    Parole chiave (italiano, facoltativo)
                  </label>
                  <textarea
                    id="tag-keywords"
                    className="lx-form-input lx-form-textarea"
                    value={formData.keywordsIt}
                    onChange={(e) => setFormData({ ...formData, keywordsIt: e.target.value })}
                    rows="3"
                    placeholder="es. open world; esplorazione libera; mondo vasto; missioni secondarie; libertà di movimento"
                    disabled={isSaving}
                  />
                  <small className="lx-form-hint">
                    Usa frasi separate da punto e virgola. Verranno usate per suggerire collegamenti tra tag e domande/risposte del questionario.
                  </small>
                </div>
              </div>

              <div className="col-12">
                <div className="lx-form-group">
                  <label className="lx-form-checkbox">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isActive: e.target.checked,
                        })
                      }
                      disabled={isSaving}
                    />
                    <span className="lx-checkbox-label">Tag attivo</span>
                  </label>
                </div>
              </div>
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
                  {tag ? "Salva modifiche" : "Crea tag"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
