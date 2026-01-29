import React from "react";

const GamePreviewCard = ({ form, platforms, genres, focuses, moods, difficulties, currentStep }) => {
  const selectedPlatforms = platforms.filter((p) => form.platformIds.includes(p.id));

  const selectedGenres = genres.filter((g) => form.genreIds.includes(g.id));

  const selectedFocus = focuses.find((f) => f.id === form.primaryFocusId);
  const selectedMood = moods.find((m) => m.id === form.primaryMoodId);
  const selectedDifficulty = difficulties.find((d) => d.id === form.difficultyId);

  const maxVisiblePlatforms = 4;

  const hasMetadata =
    currentStep === 3 && (selectedFocus || selectedMood || selectedDifficulty || form.isMultiplayer || form.isCoop || form.freeGame || form.averageLengthHours);

  return (
    <div className="lx-preview-card lx-glass sticky-top">
      <div className="lx-preview-header">
        <h6 className="mb-0">
          <i className="bi bi-eye me-2" />
          Anteprima
        </h6>
      </div>

      <div className="lx-preview-content">
        {/* Cover */}
        <div className="lx-preview-cover mb-3">
          {form.coverUrl ? (
            <>
              <img
                src={form.coverUrl}
                alt={form.title || "Cover"}
                className="lx-cover-img"
                onError={(e) => {
                  e.target.style.display = "none";
                  const placeholder = e.target.nextElementSibling;
                  if (placeholder) {
                    placeholder.style.display = "flex";
                  }
                }}
              />
              <div className="lx-cover-placeholder" style={{ display: "none" }}>
                <i className="bi bi-controller" style={{ fontSize: "3rem" }} />
                <p className="mt-2 mb-0 small">Immagine non valida</p>
              </div>
            </>
          ) : (
            <div className="lx-cover-placeholder">
              <i className="bi bi-controller" style={{ fontSize: "3rem" }} />
              <p className="mt-2 mb-0 small">Nessuna cover</p>
            </div>
          )}
        </div>

        {/* Titolo */}
        <h5 className="lx-preview-title mb-3">{form.title || <span className="text-white-50">Titolo non inserito</span>}</h5>

        {/* Piattaforme */}
        {selectedPlatforms.length > 0 && (
          <div className="mb-3">
            <small className="text-white-50 d-block mb-1">Piattaforme</small>
            <div className="lx-preview-pills">
              {selectedPlatforms.slice(0, maxVisiblePlatforms).map((p) => (
                <span key={p.id} className="lx-platform-pill">
                  {p.name}
                </span>
              ))}

              {selectedPlatforms.length > maxVisiblePlatforms && (
                <span className="lx-platform-pill lx-pill-more">+{selectedPlatforms.length - maxVisiblePlatforms}</span>
              )}
            </div>
          </div>
        )}

        {/* Generi */}
        {selectedGenres.length > 0 && (
          <div className="mb-3">
            <small className="text-white-50 d-block mb-1">Generi</small>
            <div className="lx-preview-pills">
              {selectedGenres.map((g) => (
                <span key={g.id} className="lx-genre-pill lx-genre-preview">
                  {g.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Metadata – solo allo step 3 */}
        {hasMetadata && (
          <div className="lx-preview-metadata">
            <small className="text-white-50 d-block mb-2">Caratteristiche</small>

            <div className="lx-metadata-inline mb-2">
              {selectedFocus && (
                <div className="lx-metadata-item">
                  <i className="bi bi-crosshair me-1" />
                  <span>{selectedFocus.name}</span>
                </div>
              )}

              {selectedMood && (
                <div className="lx-metadata-item">
                  <i className="bi bi-palette me-1" />
                  <span>{selectedMood.name}</span>
                </div>
              )}

              {selectedDifficulty && (
                <div className="lx-metadata-item">
                  <i className="bi bi-speedometer2 me-1" />
                  <span>{selectedDifficulty.name}</span>
                </div>
              )}
            </div>

            <div className="lx-preview-badges">
              {form.isMultiplayer && (
                <span className="badge lx-badge-info">
                  <i className="bi bi-people me-1" />
                  MULTI
                </span>
              )}

              {form.isCoop && (
                <span className="badge lx-badge-success">
                  <i className="bi bi-person-plus me-1" />
                  CO-OP
                </span>
              )}

              {form.freeGame && (
                <span className="badge lx-badge-warning">
                  <i className="bi bi-gift me-1" />
                  FREE
                </span>
              )}
            </div>

            {form.averageLengthHours && (
              <div className="mt-2">
                <small className="text-white-50">
                  <i className="bi bi-clock me-1" />
                  Durata: ~{form.averageLengthHours}h
                </small>
              </div>
            )}
          </div>
        )}

        {/* Data di rilascio */}
        {form.releaseDate && (
          <div className="mt-3 pt-3 border-top border-secondary">
            <small className="text-white-50">
              <i className="bi bi-calendar-event me-1" />
              Rilascio: {new Date(form.releaseDate).toLocaleDateString("it-IT")}
            </small>
          </div>
        )}
      </div>
    </div>
  );
};

export default GamePreviewCard;
