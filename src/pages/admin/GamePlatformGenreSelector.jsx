import React from "react";

/**
 * Step 2 – Piattaforme & generi come chip cliccabili
 *
 * Props:
 * - platforms: [{ id, name }]
 * - genres: [{ id, name }]
 * - selectedPlatformIds: number[]
 * - selectedGenreIds: number[]
 * - onPlatformsChange(ids: number[])
 * - onGenresChange(ids: number[])
 * - errors: { platformIds?, genreIds? }
 */
const GamePlatformGenreSelector = ({ platforms, genres, selectedPlatformIds, selectedGenreIds, onPlatformsChange, onGenresChange, errors = {} }) => {
  const maxGenres = 3;

  const togglePlatform = (id) => {
    if (selectedPlatformIds.includes(id)) {
      onPlatformsChange(selectedPlatformIds.filter((x) => x !== id));
    } else {
      onPlatformsChange([...selectedPlatformIds, id]);
    }
  };

  const toggleGenre = (id) => {
    if (selectedGenreIds.includes(id)) {
      onGenresChange(selectedGenreIds.filter((x) => x !== id));
    } else if (selectedGenreIds.length < maxGenres) {
      onGenresChange([...selectedGenreIds, id]);
    }
  };

  const isGenreDisabled = (id) => !selectedGenreIds.includes(id) && selectedGenreIds.length >= maxGenres;

  return (
    <div className="lx-section lx-glass p-4">
      <div className="row">
        {/* Piattaforme */}
        <div className="col-lg-6 mb-4 mb-lg-0">
          <h5 className="mb-3">
            <i className="bi bi-joystick me-2" />
            Piattaforme
          </h5>
          <div className="lx-multiselect-list lx-platforms-list">
            {platforms.map((p) => (
              <div
                key={p.id}
                className={`lx-multiselect-item ${selectedPlatformIds.includes(p.id) ? "lx-item-selected" : ""}`}
                role="checkbox"
                aria-checked={selectedPlatformIds.includes(p.id)}
                tabIndex={0}
                onClick={() => togglePlatform(p.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    togglePlatform(p.id);
                  }
                }}
              >
                <span>{p.name}</span>
                {selectedPlatformIds.includes(p.id) && <i className="bi bi-check-lg ms-1" />}
              </div>
            ))}
          </div>
          <small className="text-white-50 d-block mt-2">
            <i className="bi bi-info-circle me-1" />
            Seleziona almeno una piattaforma
          </small>
          {errors.platformIds && <div className="text-danger mt-2 small">{errors.platformIds}</div>}
        </div>

        {/* Generi */}
        <div className="col-lg-6">
          <h5 className="mb-3">
            <i className="bi bi-tags-fill me-2" />
            Generi
          </h5>
          <div className="lx-multiselect-list lx-genres-list">
            {genres.map((g) => {
              const disabled = isGenreDisabled(g.id);
              const selected = selectedGenreIds.includes(g.id);
              return (
                <div
                  key={g.id}
                  className={`lx-multiselect-item lx-genre-pill ${selected ? "lx-item-selected" : ""} ${disabled ? "lx-item-disabled" : ""}`}
                  role="checkbox"
                  aria-checked={selected}
                  aria-disabled={disabled}
                  tabIndex={disabled ? -1 : 0}
                  onClick={() => !disabled && toggleGenre(g.id)}
                  onKeyDown={(e) => {
                    if (!disabled && (e.key === "Enter" || e.key === " ")) {
                      e.preventDefault();
                      toggleGenre(g.id);
                    }
                  }}
                >
                  <span>{g.name}</span>
                  {selected && <i className="bi bi-check-lg ms-1" />}
                </div>
              );
            })}
          </div>
          <small className="text-white-50 d-block mt-2">
            <i className="bi bi-info-circle me-1" />
            Seleziona 1-3 generi principali ({selectedGenreIds.length}/{maxGenres})
          </small>
          {errors.genreIds && <div className="text-danger mt-2 small">{errors.genreIds}</div>}
        </div>
      </div>
    </div>
  );
};

export default GamePlatformGenreSelector;
