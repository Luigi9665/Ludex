import React from "react";

/**
 * Step 3 – Metadata principali (focus/mood/difficulty + flag + durata)
 *
 * Props:
 * - focuses, moods, difficulties: [{ id, code, name }]
 * - form: { primaryFocusId, primaryMoodId, difficultyId, averageLengthHours, isMultiplayer, isCoop, freeGame, isDeleted }
 * - onChange(newForm)
 */
const GameMetadataBasic = ({ focuses, moods, difficulties, form, onChange }) => {
  const focusIcons = {
    STORY: "bi-book",
    COMPETITION: "bi-trophy",
    EXPLORATION: "bi-compass",
    STRATEGY: "bi-lightbulb",
    ACTION: "bi-lightning-charge",
    DEFAULT: "bi-crosshair",
  };

  const moodIcons = {
    ENERGETIC: "bi-brightness-high",
    ATMOSPHERIC: "bi-moon-stars",
    FUN: "bi-emoji-smile",
    SERIOUS: "bi-briefcase",
    DARK: "bi-cloud-drizzle",
    DEFAULT: "bi-palette",
  };

  const difficultyIcons = {
    EASY: "bi-emoji-smile",
    MEDIUM: "bi-meh",
    HARD: "bi-emoji-frown",
    EXTREME: "bi-skull",
    DEFAULT: "bi-speedometer2",
  };

  const getIcon = (code, map) => {
    const key = code ? String(code).toUpperCase() : "";
    return map[key] || map.DEFAULT;
  };

  const handleMetadataSelect = (field, idOrNull) => {
    onChange({
      ...form,
      [field]: form[field] === idOrNull ? null : idOrNull,
    });
  };

  const handleToggle = (field) => {
    onChange({
      ...form,
      [field]: !form[field],
    });
  };

  const handleNumberChange = (field, value) => {
    const trimmed = String(value).trim();
    const num = trimmed === "" ? null : Number(trimmed);
    onChange({
      ...form,
      [field]: Number.isNaN(num) ? null : num,
    });
  };

  return (
    <div className="lx-section lx-glass p-4">
      <h5 className="mb-4">
        <i className="bi bi-sliders me-2" />
        Metadata principale
      </h5>

      {/* Focus / Atmosfera / Difficoltà */}
      <div className="row mb-4">
        {/* Focus */}
        <div className="col-md-4 mb-3">
          <label className="form-label">
            <i className="bi bi-crosshair me-1" />
            Focus di gioco
          </label>
          <div className="lx-metadata-grid">
            {/* Nessuno */}
            <div
              className={`lx-metadata-card ${form.primaryFocusId == null ? "lx-card-selected" : ""}`}
              role="radio"
              aria-checked={form.primaryFocusId == null}
              tabIndex={0}
              onClick={() => handleMetadataSelect("primaryFocusId", null)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleMetadataSelect("primaryFocusId", null);
                }
              }}
            >
              <i className="bi bi-dash-circle lx-card-icon" />
              <span className="lx-card-label">Nessuno</span>
            </div>

            {focuses.map((f) => (
              <div
                key={f.id}
                className={`lx-metadata-card ${form.primaryFocusId === f.id ? "lx-card-selected" : ""}`}
                role="radio"
                aria-checked={form.primaryFocusId === f.id}
                tabIndex={0}
                onClick={() => handleMetadataSelect("primaryFocusId", f.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleMetadataSelect("primaryFocusId", f.id);
                  }
                }}
              >
                <i className={`${getIcon(f.code, focusIcons)} lx-card-icon`} />
                <span className="lx-card-label">{f.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Mood */}
        <div className="col-md-4 mb-3">
          <label className="form-label">
            <i className="bi bi-palette me-1" />
            Atmosfera
          </label>
          <div className="lx-metadata-grid">
            {/* Nessuno */}
            <div
              className={`lx-metadata-card ${form.primaryMoodId == null ? "lx-card-selected" : ""}`}
              role="radio"
              aria-checked={form.primaryMoodId == null}
              tabIndex={0}
              onClick={() => handleMetadataSelect("primaryMoodId", null)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleMetadataSelect("primaryMoodId", null);
                }
              }}
            >
              <i className="bi bi-dash-circle lx-card-icon" />
              <span className="lx-card-label">Nessuno</span>
            </div>

            {moods.map((m) => (
              <div
                key={m.id}
                className={`lx-metadata-card ${form.primaryMoodId === m.id ? "lx-card-selected" : ""}`}
                role="radio"
                aria-checked={form.primaryMoodId === m.id}
                tabIndex={0}
                onClick={() => handleMetadataSelect("primaryMoodId", m.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleMetadataSelect("primaryMoodId", m.id);
                  }
                }}
              >
                <i className={`${getIcon(m.code, moodIcons)} lx-card-icon`} />
                <span className="lx-card-label">{m.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Difficoltà */}
        <div className="col-md-4 mb-3">
          <label className="form-label">
            <i className="bi bi-speedometer2 me-1" />
            Difficoltà
          </label>
          <div className="lx-metadata-grid">
            {/* Nessuna */}
            <div
              className={`lx-metadata-card ${form.difficultyId == null ? "lx-card-selected" : ""}`}
              role="radio"
              aria-checked={form.difficultyId == null}
              tabIndex={0}
              onClick={() => handleMetadataSelect("difficultyId", null)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleMetadataSelect("difficultyId", null);
                }
              }}
            >
              <i className="bi bi-dash-circle lx-card-icon" />
              <span className="lx-card-label">Nessuna</span>
            </div>

            {difficulties.map((d) => (
              <div
                key={d.id}
                className={`lx-metadata-card ${form.difficultyId === d.id ? "lx-card-selected" : ""}`}
                role="radio"
                aria-checked={form.difficultyId === d.id}
                tabIndex={0}
                onClick={() => handleMetadataSelect("difficultyId", d.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleMetadataSelect("difficultyId", d.id);
                  }
                }}
              >
                <i className={`${getIcon(d.code, difficultyIcons)} lx-card-icon`} />
                <span className="lx-card-label">{d.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Durata + flag */}
      <div className="lx-metadata-secondary lx-glass p-3">
        <div className="row align-items-center">
          {/* Durata media */}
          <div className="col-md-3 mb-3 mb-md-0">
            <label htmlFor="averageLength" className="form-label mb-1">
              <i className="bi bi-clock me-1" />
              Durata media (ore)
            </label>
            <input
              id="averageLength"
              type="number"
              min="0"
              step="1"
              className="form-control"
              value={form.averageLengthHours ?? ""}
              onChange={(e) => handleNumberChange("averageLengthHours", e.target.value)}
              placeholder="es. 15"
            />
          </div>

          {/* Flag booleani */}
          <div className="col-md-9">
            <label className="form-label mb-2 d-block">
              <i className="bi bi-toggles me-1" />
              Caratteristiche
            </label>

            <div className="row">
              {/* Multiplayer */}
              <div className="col-sm-6 col-lg-3 mb-3 text-center">
                <div className="lx-flag-wrapper">
                  <div className="lx-flag-label mb-2">
                    <i className="bi bi-people me-1" />
                    Multiplayer
                  </div>

                  <div className="form-check form-switch lx-toggle-switch">
                    <input
                      id="isMultiplayer"
                      type="checkbox"
                      className="form-check-input"
                      checked={form.isMultiplayer}
                      onChange={() => handleToggle("isMultiplayer")}
                    />
                    {/* label solo per accessibilità */}
                    <label className="visually-hidden" htmlFor="isMultiplayer">
                      Multiplayer
                    </label>
                  </div>
                </div>
              </div>

              {/* Co-op */}
              <div className="col-sm-6 col-lg-3 mb-3 text-center">
                <div className="lx-flag-wrapper">
                  <div className="lx-flag-label mb-2">
                    <i className="bi bi-person-plus me-1" />
                    Co-op
                  </div>

                  <div className="form-check form-switch lx-toggle-switch">
                    <input id="isCoop" type="checkbox" className="form-check-input" checked={form.isCoop} onChange={() => handleToggle("isCoop")} />
                    <label className="visually-hidden" htmlFor="isCoop">
                      Co-op
                    </label>
                  </div>
                </div>
              </div>

              {/* Free-to-play */}
              <div className="col-sm-6 col-lg-3 mb-3 text-center">
                <div className="lx-flag-wrapper">
                  <div className="lx-flag-label mb-2">
                    <i className="bi bi-gift me-1" />
                    Free-to-play
                  </div>

                  <div className="form-check form-switch lx-toggle-switch">
                    <input id="freeGame" type="checkbox" className="form-check-input" checked={form.freeGame} onChange={() => handleToggle("freeGame")} />
                    <label className="visually-hidden" htmlFor="freeGame">
                      Free-to-play
                    </label>
                  </div>
                </div>
              </div>

              {/* Nascondi dal catalogo */}
              <div className="col-sm-6 col-lg-3 mb-3 text-center">
                <div className="lx-flag-wrapper">
                  <div className="lx-flag-label mb-2 text-warning">
                    <i className="bi bi-archive me-1" />
                    Nascondi dal catalogo
                  </div>

                  <div className="form-check form-switch lx-toggle-switch">
                    <input id="isDeleted" type="checkbox" className="form-check-input" checked={form.isDeleted} onChange={() => handleToggle("isDeleted")} />
                    <label className="visually-hidden" htmlFor="isDeleted">
                      Nascondi dal catalogo
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <small className="text-white-50 d-block mt-3">
        <i className="bi bi-info-circle me-1" />
        Tutti i campi di questo step sono opzionali.
      </small>
    </div>
  );
};

export default GameMetadataBasic;
