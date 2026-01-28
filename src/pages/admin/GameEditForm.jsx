// src/pages/admin/GameEditForm.jsx
import { useEffect, useState } from "react";
import { apiFetch } from "../../apiFetch Autenticate/apiFetch";
import { safeJson } from "../../apiFetch Autenticate/safeJson";

// utility che uso anche nel create form
const toggleIdInArray = (currentArray, id) => {
  const idStr = String(id);
  if (currentArray.includes(idStr)) {
    return currentArray.filter((x) => x !== idStr);
  }
  return [...currentArray, idStr];
};

// Nota per me futuro:
// questo form è pensato SOLO per l'edit admin.
// Riceve un "game" già pronto dal backend con tutti gli id (platform, genre, tag, ecc.)
// e i lookup per generi/piattaforme/focus/mood/difficulty/tags.

const GameEditForm = ({ game, genres, platforms, focuses, moods, difficulties, tags, onSaved }) => {
  // stato interno del form (parto dal dto `game`)
  const [form, setForm] = useState({
    title: "",
    description: "",
    releaseDate: "",
    coverUrl: "",
    platformIds: [],
    genreIds: [],
    primaryFocusId: "",
    primaryMoodId: "",
    difficultyId: "",
    averageLengthHours: "",
    isMultiplayer: false,
    isCoop: false,
    freeGame: false,
    isDeleted: false,
    tagIds: [],
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [coverWarning, setCoverWarning] = useState("");

  // quando arriva/ cambia il game → sincronizzo lo stato
  useEffect(() => {
    if (!game) return;

    setForm({
      title: game.title ?? "",
      description: game.description ?? "",
      // mi aspetto che la data arrivi come "yyyy-MM-dd" o ISO → prendo solo la parte data
      releaseDate: game.releaseDate ? String(game.releaseDate).substring(0, 10) : "",
      coverUrl: game.coverUrl ?? "",
      platformIds: (game.platformIds || []).map((x) => String(x)),
      genreIds: (game.genreIds || []).map((x) => String(x)),
      primaryFocusId: game.primaryFocusId ? String(game.primaryFocusId) : "",
      primaryMoodId: game.primaryMoodId ? String(game.primaryMoodId) : "",
      difficultyId: game.difficultyId ? String(game.difficultyId) : "",
      averageLengthHours: game.averageLengthHours != null ? String(game.averageLengthHours) : "",
      isMultiplayer: !!game.isMultiplayer,
      isCoop: !!game.isCoop,
      freeGame: !!game.freeGame,
      isDeleted: !!game.isDeleted,
      tagIds: (game.tagIds || []).map((x) => String(x)),
    });
  }, [game]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: checked,
    }));
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

  const handleToggleTag = (id) => {
    setForm((prev) => ({
      ...prev,
      tagIds: toggleIdInArray(prev.tagIds, id),
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

    // durata media opzionale, ma se presente deve essere numero valido
    if (form.averageLengthHours) {
      const n = Number(form.averageLengthHours);
      if (Number.isNaN(n) || n < 0) {
        return "La durata media deve essere un numero positivo.";
      }
    }

    return null;
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
      // preparo il payload per UpdateGameDto
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        releaseDate: form.releaseDate, // yyyy-MM-dd
        coverUrl: form.coverUrl.trim(),
        platformIds: form.platformIds.map((id) => Number(id)),
        genreIds: form.genreIds.map((id) => Number(id)),

        primaryFocusId: form.primaryFocusId ? Number(form.primaryFocusId) : null,
        primaryMoodId: form.primaryMoodId ? Number(form.primaryMoodId) : null,
        difficultyId: form.difficultyId ? Number(form.difficultyId) : null,
        averageLengthHours: form.averageLengthHours ? Number(form.averageLengthHours) : null,

        isMultiplayer: form.isMultiplayer,
        isCoop: form.isCoop,
        freeGame: form.freeGame,

        isDeleted: form.isDeleted,

        tagIds: form.tagIds.map((id) => Number(id)),
      };

      const res = await apiFetch(`/api/Games/${game.gameId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.status === 404) {
        throw new Error("Gioco non trovato (404).");
      }

      if (!res.ok) {
        let msg = "Impossibile aggiornare il gioco.";
        try {
          const body = await safeJson(res);
          if (body?.message) msg = body.message;
        } catch {
          // ignore
        }
        throw new Error(msg);
      }

      setSuccessMsg("Gioco aggiornato con successo.");
      if (onSaved) {
        // piccola pausa mentale: se domani voglio NON navigare subito,
        // posso togliere questo onSaved o gestire un toast globale
        onSaved();
      }
    } catch (err) {
      setErrorMsg(err?.message || "Errore imprevisto durante l'aggiornamento.");
    } finally {
      setSubmitting(false);
    }
  };

  // utile per la preview
  const currentPlatforms = platforms.filter((p) => form.platformIds.includes(String(p.platformId ?? p.id)));
  const currentGenres = genres.filter((g) => form.genreIds.includes(String(g.genreId ?? g.id)));

  // raggruppo i tag per categoria per velocizzare la vita all'admin
  const groupedTags = tags.reduce((acc, tag) => {
    const cat = tag.category || "OTHER";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(tag);
    return acc;
  }, {});

  const categoryOrder = ["GENRE", "FEATURE", "STRUCTURE", "EXPERIENCE", "SOCIAL", "SETTING", "AESTHETIC", "CAMERA", "OTHER"];

  const categoryLabels = {
    GENRE: "Generi / Sottogeneri",
    FEATURE: "Feature di gameplay",
    STRUCTURE: "Struttura",
    EXPERIENCE: "Esperienza",
    SOCIAL: "Social / Multiplayer",
    SETTING: "Ambientazione",
    AESTHETIC: "Stile visivo",
    CAMERA: "Camera",
    OTHER: "Altro",
  };

  return (
    <form className="row gx-4 gy-4 lx-admin-form" onSubmit={handleSubmit}>
      {/* COLONNA SINISTRA: campi principali + metadata */}
      <div className="col-12 col-lg-7">
        <div className="row g-3">
          {/* titolo + data */}
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

          {/* descrizione */}
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

          {/* cover */}
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
            <small className="lx-field-hint">Usa un link diretto a un&apos;immagine (JPG / PNG / WebP).</small>
            {coverWarning && <div className="text-warning small mt-1">{coverWarning}</div>}
          </div>

          {/* piattaforme */}
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
          </div>

          {/* generi */}
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
          </div>

          {/* riga metadata base: focus / mood / difficoltà */}
          <div className="col-12 col-md-4">
            <label className="form-label lx-field-label">Focus principale</label>
            <select name="primaryFocusId" className="form-select lx-field-control" value={form.primaryFocusId} onChange={handleChange}>
              <option value="">(Nessuno)</option>
              {focuses.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-12 col-md-4">
            <label className="form-label lx-field-label">Mood principale</label>
            <select name="primaryMoodId" className="form-select lx-field-control" value={form.primaryMoodId} onChange={handleChange}>
              <option value="">(Nessuno)</option>
              {moods.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-12 col-md-4">
            <label className="form-label lx-field-label">Difficoltà</label>
            <select name="difficultyId" className="form-select lx-field-control" value={form.difficultyId} onChange={handleChange}>
              <option value="">(Nessuna / variabile)</option>
              {difficulties.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* durata + flag vari */}
          <div className="col-12 col-md-4">
            <label className="form-label lx-field-label">Durata media (ore)</label>
            <input
              type="number"
              name="averageLengthHours"
              className="form-control lx-field-control"
              value={form.averageLengthHours}
              onChange={handleChange}
              min="0"
            />
            <small className="lx-field-hint">Opzionale. Serve per i consigli (short/long game).</small>
          </div>

          <div className="col-12 col-md-4 d-flex flex-column justify-content-end">
            <div className="form-check">
              <input
                className="form-check-input"
                id="isMultiplayer"
                type="checkbox"
                name="isMultiplayer"
                checked={form.isMultiplayer}
                onChange={handleCheckboxChange}
              />
              <label className="form-check-label text-white-50" htmlFor="isMultiplayer">
                Ha modalità multiplayer
              </label>
            </div>
            <div className="form-check mt-1">
              <input className="form-check-input" id="isCoop" type="checkbox" name="isCoop" checked={form.isCoop} onChange={handleCheckboxChange} />
              <label className="form-check-label text-white-50" htmlFor="isCoop">
                Ha modalità co-op
              </label>
            </div>
          </div>

          <div className="col-12 col-md-4 d-flex flex-column justify-content-end">
            <div className="form-check">
              <input className="form-check-input" id="freeGame" type="checkbox" name="freeGame" checked={form.freeGame} onChange={handleCheckboxChange} />
              <label className="form-check-label text-white-50" htmlFor="freeGame">
                Gioco gratuito (Free to play)
              </label>
            </div>

            <div className="form-check mt-1">
              <input className="form-check-input" id="isDeleted" type="checkbox" name="isDeleted" checked={form.isDeleted} onChange={handleCheckboxChange} />
              <label className="form-check-label text-white-50" htmlFor="isDeleted">
                Nascondi dal catalogo pubblico
              </label>
            </div>
          </div>

          {/* TAGS: raggruppati per categoria */}
          <div className="col-12">
            <label className="form-label lx-field-label">Tag</label>
            <div className="lx-tags-groups">
              {categoryOrder.map((catKey) => {
                const group = groupedTags[catKey];
                if (!group || group.length === 0) return null;

                return (
                  <div key={catKey} className="mb-2">
                    <div className="text-white-50 small mb-1">{categoryLabels[catKey] || catKey}</div>
                    <div className="lx-multiselect-list lx-tags-list">
                      {group.map((t) => {
                        const idStr = String(t.id);
                        const checked = form.tagIds.includes(idStr);
                        return (
                          <label key={t.id} className={`lx-multiselect-item lx-tag-item ${checked ? "is-checked" : ""}`}>
                            <input type="checkbox" className="form-check-input me-2" checked={checked} onChange={() => handleToggleTag(t.id)} />
                            <span>{t.displayName}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
            <small className="lx-field-hint">I tag guidano il motore &quot;Trova il gioco giusto&quot;. Meglio pochi ma significativi.</small>
          </div>
        </div>

        {/* MESSAGGI */}
        <div className="mt-3">
          {errorMsg && <div className="alert alert-danger py-2 mb-2">{errorMsg}</div>}
          {successMsg && <div className="alert alert-success py-2 mb-2">{successMsg}</div>}
        </div>

        {/* BOTTONI */}
        <div className="d-flex gap-2 mt-2">
          {/* per ora niente reset che rimette i valori originali: sarebbe un po' più complesso */}
          <button type="submit" className="btn lx-btn-primary" disabled={submitting}>
            {submitting ? "Salvataggio..." : "Salva modifiche"}
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

export default GameEditForm;
