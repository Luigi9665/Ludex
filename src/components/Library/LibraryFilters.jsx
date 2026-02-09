import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadGenres, loadPlatforms } from "../../redux/action";

const LibraryFilters = ({ search, onSearchChange, selectedGenres, onGenresChange, selectedPlatforms, onPlatformsChange, onApply, onReset }) => {
  const dispatch = useDispatch();
  const { genres, platforms } = useSelector((state) => state.selectGame);

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
    <div className="lx-library-filters">
      <div className="lx-library-filters-header">
        <i className="bi bi-funnel" />
        <h3 className="lx-library-filters-title">Filtri</h3>
      </div>

      <div className="lx-library-filter-group">
        <label className="lx-library-filter-label">Cerca gioco</label>
        <div className="lx-library-search-wrapper">
          <i className="bi bi-search lx-library-search-icon" />
          <input
            type="text"
            className="lx-library-search-input"
            placeholder="Es: Elden Ring, Zelda..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={handleKeyPress}
          />
        </div>
      </div>

      <div className="lx-library-filter-group">
        <div className="lx-library-filter-label-row">
          <label className="lx-library-filter-label">Generi</label>
          {selectedGenres.length > 0 && <span className="lx-library-filter-count">{selectedGenres.length}</span>}
        </div>

        <div className="lx-library-filter-list">
          {genreList && genreList.length > 0 ? (
            genreList.map((g) => {
              const name = g.name;
              const active = selectedGenres.includes(name);
              const inputId = `genre-${g.genreId ?? g.id ?? name}`;

              return (
                <label key={g.genreId ?? g.id ?? name} htmlFor={inputId} className={`lx-library-filter-item ${active ? "lx-library-filter-item--active" : ""}`}>
                  <input id={inputId} type="checkbox" className="lx-library-filter-checkbox" checked={active} onChange={() => handleGenreToggle(name)} />
                  <span className="lx-library-filter-item-text">{name}</span>
                  {active && <i className="bi bi-check2 lx-library-filter-check" />}
                </label>
              );
            })
          ) : (
            <div className="lx-library-filter-loading">Carico i generi...</div>
          )}
        </div>
      </div>

      <div className="lx-library-filter-group">
        <div className="lx-library-filter-label-row">
          <label className="lx-library-filter-label">Piattaforme</label>
          {selectedPlatforms.length > 0 && <span className="lx-library-filter-count">{selectedPlatforms.length}</span>}
        </div>

        <div className="lx-library-filter-list">
          {platformList && platformList.length > 0 ? (
            platformList.map((p) => {
              const name = p.name;
              const active = selectedPlatforms.includes(name);
              const inputId = `platform-${p.platformId ?? p.id ?? name}`;

              return (
                <label
                  key={p.platformId ?? p.id ?? name}
                  htmlFor={inputId}
                  className={`lx-library-filter-item ${active ? "lx-library-filter-item--active" : ""}`}
                >
                  <input id={inputId} type="checkbox" className="lx-library-filter-checkbox" checked={active} onChange={() => handlePlatformToggle(name)} />
                  <span className="lx-library-filter-item-text">{name}</span>
                  {active && <i className="bi bi-check2 lx-library-filter-check" />}
                </label>
              );
            })
          ) : (
            <div className="lx-library-filter-loading">Carico le piattaforme...</div>
          )}
        </div>
      </div>

      <div className="lx-library-filter-actions">
        <button type="button" className="lx-btn-primary lx-library-filter-btn" onClick={onApply}>
          <i className="bi bi-search" />
          Applica filtri
        </button>
        <button type="button" className="lx-btn-outline lx-library-filter-btn" onClick={onReset}>
          <i className="bi bi-x-circle" />
          Reset
        </button>
      </div>
    </div>
  );
};

export default LibraryFilters;
