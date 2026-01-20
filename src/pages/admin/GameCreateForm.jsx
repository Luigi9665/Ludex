// src/components/admin/GameCreateForm.jsx
import { useState } from "react";
import { apiFetch } from "../../apiFetch Autenticate/apiFetch";

const initialForm = {
  title: "",
  description: "",
  releaseDate: "",
  coverUrl: "",
  platformIds: [],
  genreIds: [],
};

const GameCreateForm = ({ genres, platforms }) => {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [coverWarning, setCoverWarning] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    if (!form.title.trim()) return "Il titolo è obbligatorio.";
    if (!form.description.trim()) return "La descrizione è obbligatoria.";
    if (!form.releaseDate) return "La data di uscita è obbligatoria.";
    if (!form.coverUrl.trim()) return "La cover è obbligatoria.";
    if (!/^https?:\/\//i.test(form.coverUrl.trim())) return "La cover deve essere un URL valido (http/https).";

    if (!form.platformIds.length) return "Seleziona almeno una piattaforma.";
    if (!form.genreIds.length) return "Seleziona almeno un genere.";

    return null;
  };

  const handleCoverChange = (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, coverUrl: value }));

    setCoverWarning("");

    const trimmed = value.trim();
    if (!/^https?:\/\//i.test(trimmed)) return;

    const img = new Image();
    img.onload = () => {
      if (img.naturalWidth > 2000 || img.naturalHeight > 2000) {
        setCoverWarning("Attenzione: la cover sembra molto grande (risoluzione elevata). Meglio usare una versione ridotta.");
      }
    };
    img.onerror = () => {
      setCoverWarning("Impossibile caricare l'immagine da questo URL.");
    };
    img.src = trimmed;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const validationError = validate();
    if (validationError) {
      setErrorMsg(validationError);
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        platformIds: form.platformIds.map((id) => Number(id)),
        genreIds: form.genreIds.map((id) => Number(id)),
        releaseDate: form.releaseDate, // yyyy-MM-dd
        coverUrl: form.coverUrl.trim(),
      };

      const res = await apiFetch("/api/Games/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let errMsg = "Impossibile creare il gioco. Riprova.";
        try {
          const body = await res.json();
          if (body?.message) errMsg = body.message;
        } catch {
          // ignore
        }
        throw new Error(errMsg);
      }

      setSuccessMsg("Gioco creato con successo!");
      setForm(initialForm);
    } catch (err) {
      setErrorMsg(err.message || "Errore imprevisto durante il salvataggio.");
    } finally {
      setSubmitting(false);
    }
  };

  const currentPlatforms = platforms.filter((p) => form.platformIds.includes(String(p.platformId ?? p.id)));
  const currentGenres = genres.filter((g) => form.genreIds.includes(String(g.genreId ?? g.id)));

  const toggleIdInArray = (currentArray, id) => {
    const idStr = String(id);
    if (currentArray.includes(idStr)) {
      return currentArray.filter((x) => x !== idStr);
    }
    return [...currentArray, idStr];
  };

  const handleTogglePlatform = (id) => {
    setForm((prev) => ({
      ...prev,
      platformIds: toggleIdInArray(prev.platformIds, id),
    }));
  };

  const handleToggleGenre = (id) => {
    setForm((prev) => ({
      ...prev,
      genreIds: toggleIdInArray(prev.genreIds, id),
    }));
  };

  return (
    <form className="row gx-4 gy-4 lx-admin-form" onSubmit={handleSubmit}>
      {/* COLONNA SINISTRA: campi principali */}
      <div className="col-12 col-lg-7">
        <div className="row g-3">
          <div className="col-12 col-md-8">
            <label className="form-label lx-field-label">Titolo</label>
            <input
              type="text"
              name="title"
              className="form-control lx-field-control"
              value={form.title}
              onChange={handleChange}
              placeholder="Es. ARC Raiders"
            />
          </div>

          <div className="col-12 col-md-4">
            <label className="form-label lx-field-label">Data di uscita</label>
            <input type="date" name="releaseDate" className="form-control lx-field-control" value={form.releaseDate} onChange={handleChange} />
          </div>

          <div className="col-12">
            <label className="form-label lx-field-label">Descrizione</label>
            <textarea
              name="description"
              rows={4}
              className="form-control lx-field-control"
              value={form.description}
              onChange={handleChange}
              placeholder="Descrivi brevemente il gioco..."
            />
          </div>

          <div className="col-12">
            <label className="form-label lx-field-label">Cover URL</label>
            <input
              type="url"
              name="coverUrl"
              className="form-control lx-field-control"
              value={form.coverUrl}
              onChange={handleCoverChange}
              placeholder="https://..."
            />
            <small className="lx-field-hint">Usa un link diretto a un'immagine (JPG / PNG / WebP).</small>
            {coverWarning && <div className="text-warning small mt-1">{coverWarning}</div>}
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label lx-field-label">Piattaforme</label>

            <div className="lx-multiselect-list">
              {platforms.map((p) => {
                const id = p.platformId ?? p.id;
                const idStr = String(id);
                const checked = form.platformIds.includes(idStr);

                return (
                  <label key={id} className={`lx-multiselect-item ${checked ? "is-checked" : ""}`}>
                    <input type="checkbox" className="form-check-input me-2" checked={checked} onChange={() => handleTogglePlatform(id)} />
                    <span>{p.name}</span>
                  </label>
                );
              })}
            </div>

            <small className="lx-field-hint">Clicca per aggiungere o rimuovere una piattaforma.</small>
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label lx-field-label">Generi</label>

            <div className="lx-multiselect-list">
              {genres.map((g) => {
                const id = g.genreId ?? g.id;
                const idStr = String(id);
                const checked = form.genreIds.includes(idStr);

                return (
                  <label key={id} className={`lx-multiselect-item ${checked ? "is-checked" : ""}`}>
                    <input type="checkbox" className="form-check-input me-2" checked={checked} onChange={() => handleToggleGenre(id)} />
                    <span>{g.name}</span>
                  </label>
                );
              })}
            </div>

            <small className="lx-field-hint">Puoi scegliere più generi (azione, RPG, roguelike…)</small>
          </div>
        </div>

        {/* MESSAGGI */}
        <div className="mt-3">
          {errorMsg && <div className="alert alert-danger py-2 mb-2">{errorMsg}</div>}
          {successMsg && <div className="alert alert-success py-2 mb-2">{successMsg}</div>}
        </div>

        {/* BOTTONI */}
        <div className="d-flex gap-2 mt-2">
          <button type="button" className="btn lx-btn-outline" onClick={() => setForm(initialForm)} disabled={submitting}>
            Reset
          </button>
          <button type="submit" className="btn lx-btn-primary" disabled={submitting}>
            {submitting ? "Salvataggio..." : "Crea gioco"}
          </button>
        </div>
      </div>

      {/* COLONNA DESTRA: preview */}
      <div className="col-12 col-lg-5">
        <div className="lx-admin-preview-header d-flex justify-content-between align-items-center mb-2">
          <span className="text-white-50 small">Preview gioco</span>
          <span className="badge bg-transparent text-uppercase lx-admin-preview-badge">Live</span>
        </div>

        <div className="lx-glow-card lx-admin-preview-card">
          <div className="lx-game-card">
            <div className="lx-game-cover">
              {form.coverUrl ? (
                <img src={form.coverUrl} alt={form.title || "Cover preview"} />
              ) : (
                <div className="lx-admin-cover-placeholder">
                  <i className="bi bi-image mb-2"></i>
                  <span className="small text-muted">Incolla un URL per vedere la cover</span>
                </div>
              )}
            </div>

            <div className="lx-game-info">
              <h5 className="lx-game-title">{form.title || "Titolo del gioco"}</h5>

              <div className="d-flex flex-wrap gap-1 mb-1">
                {currentPlatforms.length > 0 ? (
                  currentPlatforms.map((p) => (
                    <span key={p.platformId ?? p.id} className="lx-genre-pill">
                      {p.name}
                    </span>
                  ))
                ) : (
                  <span className="lx-platform text-white-50">Nessuna piattaforma selezionata</span>
                )}
              </div>

              <div className="lx-genre-row">
                {currentGenres.length > 0 ? (
                  currentGenres.map((g) => (
                    <span key={g.genreId ?? g.id} className="lx-genre-pill me-1">
                      {g.name}
                    </span>
                  ))
                ) : (
                  <span className="text-white-50 small">Aggiungi uno o più generi</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default GameCreateForm;
