import React, { useEffect, useState } from "react";

/**
 * Step 1 – campi base: titolo, descrizione, data, coverUrl
 *
 * Props:
 * - form: { title, description, releaseDate, coverUrl, ... }
 * - onChange(newForm)
 * - errors: { title?, description?, releaseDate?, coverUrl? }
 */
const GameBaseFields = ({ form, onChange, errors = {} }) => {
  const [coverLoading, setCoverLoading] = useState(false);
  const [coverError, setCoverError] = useState(false);

  useEffect(() => {
    if (!form.coverUrl || form.coverUrl.trim() === "") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCoverError(false);
      setCoverLoading(false);
      return;
    }

    setCoverLoading(true);
    setCoverError(false);

    const img = new Image();
    img.onload = () => {
      setCoverLoading(false);
      setCoverError(false);
    };
    img.onerror = () => {
      setCoverLoading(false);
      setCoverError(true);
    };
    img.src = form.coverUrl;
  }, [form.coverUrl]);

  const handleInputChange = (field, value) => {
    onChange({
      ...form,
      [field]: value,
    });
  };

  const titleMaxLength = 150;
  const descriptionMaxLength = 500;

  return (
    <div className="lx-section lx-glass p-4">
      <h5 className="mb-4">
        <i className="bi bi-info-circle me-2" />
        Informazioni base
      </h5>

      {/* Titolo */}
      <div className="mb-3">
        <label htmlFor="gameTitle" className="form-label">
          Titolo <span className="text-danger">*</span>
        </label>
        <input
          id="gameTitle"
          type="text"
          className={`form-control ${errors.title ? "is-invalid" : ""}`}
          value={form.title}
          onChange={(e) => handleInputChange("title", e.target.value)}
          maxLength={titleMaxLength}
          placeholder="Es. Elden Ring"
        />
        <div className="d-flex justify-content-between mt-1">
          <small className="text-white-50">Nome ufficiale completo</small>
          <small className={form.title.length > titleMaxLength * 0.9 ? "text-warning" : "text-white-50"}>
            {form.title.length}/{titleMaxLength}
          </small>
        </div>
        {errors.title && <div className="invalid-feedback d-block">{errors.title}</div>}
      </div>

      {/* Descrizione */}
      <div className="mb-3">
        <label htmlFor="gameDescription" className="form-label">
          Descrizione
        </label>
        <textarea
          id="gameDescription"
          rows={4}
          className={`form-control ${errors.description ? "is-invalid" : ""}`}
          value={form.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          maxLength={descriptionMaxLength}
          placeholder="Breve sinossi del gioco..."
        />
        <div className="d-flex justify-content-between mt-1">
          <small className="text-white-50">Breve sinossi (max {descriptionMaxLength} caratteri)</small>
          <small className={form.description.length > descriptionMaxLength * 0.9 ? "text-warning" : "text-white-50"}>
            {form.description.length}/{descriptionMaxLength}
          </small>
        </div>
        {errors.description && <div className="invalid-feedback d-block">{errors.description}</div>}
      </div>

      <div className="row">
        {/* Data di uscita */}
        <div className="col-md-6 mb-3">
          <label htmlFor="releaseDate" className="form-label">
            Data di uscita <span className="text-danger">*</span>
          </label>
          <input
            id="releaseDate"
            type="date"
            className={`form-control ${errors.releaseDate ? "is-invalid" : ""}`}
            value={form.releaseDate}
            onChange={(e) => handleInputChange("releaseDate", e.target.value)}
          />
          <small className="text-white-50 d-block mt-1">Data di rilascio originale</small>
          {errors.releaseDate && <div className="invalid-feedback d-block">{errors.releaseDate}</div>}
        </div>

        {/* Cover URL */}
        <div className="col-md-6 mb-3">
          <label htmlFor="coverUrl" className="form-label">
            URL cover
          </label>
          <input
            id="coverUrl"
            type="url"
            className={`form-control ${errors.coverUrl || coverError ? "is-invalid" : ""}`}
            value={form.coverUrl}
            onChange={(e) => handleInputChange("coverUrl", e.target.value)}
            placeholder="https://..."
          />
          <small className="text-white-50 d-block mt-1">Link diretto ad un&apos;immagine (JPG/PNG/WebP)</small>
          {coverError && (
            <div className="text-danger mt-1 small">
              <i className="bi bi-exclamation-triangle me-1" />
              Impossibile caricare l&apos;immagine
            </div>
          )}
          {errors.coverUrl && <div className="invalid-feedback d-block">{errors.coverUrl}</div>}
        </div>
      </div>

      {/* Mini preview cover */}
      {form.coverUrl && (
        <div className="mb-3">
          <label className="form-label">Anteprima cover</label>
          <div className="lx-cover-preview">
            {coverLoading ? (
              <div className="lx-cover-skeleton">
                <div className="spinner-border text-light" role="status" aria-hidden="true" />
              </div>
            ) : coverError ? (
              <div className="lx-cover-error">
                <i className="bi bi-image text-danger" style={{ fontSize: 32 }} />
                <p className="text-danger mt-2 mb-0 small">Immagine non valida</p>
              </div>
            ) : (
              <img src={form.coverUrl} alt="Cover preview" className="lx-cover-image" />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GameBaseFields;
