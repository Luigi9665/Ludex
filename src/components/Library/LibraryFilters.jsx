// src/components/library/LibraryFilters.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadGenres, loadPlatforms } from "../../redux/action";

const LibraryFilters = ({ search, onSearchChange, selectedGenres, onGenresChange, selectedPlatforms, onPlatformsChange, onApply, onReset }) => {
  const dispatch = useDispatch();
  const { genres, platforms } = useSelector((state) => state.selectGame);

  // normalizzo
  const genreList = Array.isArray(genres) ? genres : (genres?.items ?? []);

  const platformList = Array.isArray(platforms) ? platforms : (platforms?.items ?? []);

  useEffect(() => {
    dispatch(loadGenres());
    dispatch(loadPlatforms());
  }, [dispatch]);

  const toggleValue = (current, value) => {
    return current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
  };

  const handleGenreToggle = (name) => {
    onGenresChange(toggleValue(selectedGenres, name));
  };

  const handlePlatformToggle = (name) => {
    onPlatformsChange(toggleValue(selectedPlatforms, name));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onApply();
    }
  };

  return (
    <div className="lx-glass p-3 p-lg-4 sticky-top" style={{ top: "90px" }}>
      <h5 className="lx-field-label mb-3 d-flex align-items-center">
        <i className="bi bi-funnel me-2"></i>
        Filtri
      </h5>

      {/* SEARCH */}
      <div className="mb-4">
        <label className="lx-field-label mb-2">Cerca gioco</label>
        <input
          type="text"
          className="form-control lx-field-control"
          placeholder="Es: Elden Ring, Zelda..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyDown={handleKeyPress}
        />
      </div>

      {/* GENERI */}
      <div className="mb-4">
        <label className="lx-field-label mb-2 d-flex justify-content-between">
          <span>Generi</span>
          {selectedGenres.length > 0 && <span className="badge bg-primary">{selectedGenres.length}</span>}
        </label>

        <div className="lx-multiselect-list">
          {genreList && genreList.length > 0 ? (
            genreList.map((g) => {
              const name = g.name;
              const active = selectedGenres.includes(name);
              const inputId = `genre-${g.genreId ?? g.id ?? name}`;

              return (
                <label key={g.genreId ?? g.id ?? name} htmlFor={inputId} className={`lx-multiselect-item ${active ? "is-checked" : ""}`}>
                  <input id={inputId} type="checkbox" className="form-check-input me-2" checked={active} onChange={() => handleGenreToggle(name)} />
                  <span>{name}</span>
                </label>
              );
            })
          ) : (
            <div className="text-muted small">Carico i generi...</div>
          )}
        </div>
      </div>

      {/* PIATTAFORME */}
      <div className="mb-4">
        <label className="lx-field-label mb-2 d-flex justify-content-between">
          <span>Piattaforme</span>
          {selectedPlatforms.length > 0 && <span className="badge bg-primary">{selectedPlatforms.length}</span>}
        </label>

        <div className="lx-multiselect-list">
          {platformList && platformList.length > 0 ? (
            platformList.map((p) => {
              const name = p.name;
              const active = selectedPlatforms.includes(name);
              const inputId = `platform-${p.platformId ?? p.id ?? name}`;

              return (
                <label key={p.platformId ?? p.id ?? name} htmlFor={inputId} className={`lx-multiselect-item ${active ? "is-checked" : ""}`}>
                  <input id={inputId} type="checkbox" className="form-check-input me-2" checked={active} onChange={() => handlePlatformToggle(name)} />
                  <span>{name}</span>
                </label>
              );
            })
          ) : (
            <div className="text-muted small">Carico le piattaforme...</div>
          )}
        </div>
      </div>

      {/* BOTTONI */}
      <div className="d-grid gap-2 mt-2">
        <button type="button" className="lx-btn-primary w-100" onClick={onApply}>
          <i className="bi bi-search me-2"></i>
          Applica filtri
        </button>
        <button type="button" className="lx-btn-outline w-100" onClick={onReset}>
          <i className="bi bi-x-circle me-2"></i>
          Reset
        </button>
      </div>
    </div>
  );
};

export default LibraryFilters;
