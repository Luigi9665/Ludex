import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { clearNavSearch, loadNavSearchPreview } from "../../redux/action/index.js";

// debounce semplice
function useDebouncedValue(value, delay = 350) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

export default function NavSearch() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const wrapRef = useRef(null);

  const { query, items, loading, error, totalItems, open } = useSelector((s) => s.navSearch);

  const [localQuery, setLocalQuery] = useState(query ?? "");
  const debouncedQuery = useDebouncedValue(localQuery, 350);

  // chiudi con click fuori (usa "click" e non "mousedown" per non uccidere gli onClick dei risultati)
  useEffect(() => {
    const onDocClick = (e) => {
      if (!wrapRef.current) return;
      if (wrapRef.current.contains(e.target)) return;

      // evita dispatch inutili se è già tutto chiuso e vuoto
      const q = (query ?? "").trim();
      if (!open && q.length === 0 && items.length === 0 && !loading && !error) {
        return;
      }

      dispatch(clearNavSearch());
    };

    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [dispatch, open, query, items.length, loading, error]);

  // ESC per chiudere + Enter per andare in libreria
  const onKeyDown = (e) => {
    if (e.key === "Escape") {
      dispatch(clearNavSearch());
      e.currentTarget.blur();
    }
    if (e.key === "Enter") {
      e.preventDefault();
      const q = localQuery.trim();
      if (q.length >= 2) {
        dispatch(clearNavSearch());
        navigate(`/library?Title=${encodeURIComponent(q)}`);
      }
    }
  };

  // fetch preview (debounced)
  useEffect(() => {
    dispatch(loadNavSearchPreview({ title: debouncedQuery, pageSize: 20 }));
  }, [debouncedQuery, dispatch]);

  const showAll = useMemo(() => totalItems > 20, [totalItems]);

  const goToLibraryAll = () => {
    const q = localQuery.trim();
    if (q.length < 2) return;
    dispatch(clearNavSearch());
    navigate(`/library?Title=${encodeURIComponent(q)}`);
  };

  const goToGame = (gameId) => {
    dispatch(clearNavSearch());
    navigate(`/game/${gameId}`);
  };

  return (
    <div className="lx-navsearch" ref={wrapRef}>
      <form className="d-flex mx-auto my-2 my-lg-0 lx-search-form" role="search" onSubmit={(e) => e.preventDefault()}>
        <input
          className="form-control lx-input-glass"
          type="search"
          placeholder="Cerca giochi ..."
          aria-label="Search"
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          onKeyDown={onKeyDown}
          onFocus={() => {
            const q = localQuery.trim();
            if (q.length > 2) {
              dispatch(loadNavSearchPreview({ title: q, pageSize: 20 }));
            }
          }}
        />
      </form>

      {open && localQuery.trim().length >= 2 && (
        <div className="lx-navsearch-dropdown lx-glass">
          <div className="lx-navsearch-head">
            <span className="lx-navsearch-title">
              <i className="bi bi-search me-2" />
              Risultati
            </span>

            {loading && <span className="lx-navsearch-meta">Caricamento…</span>}
            {!loading && !error && (
              <span className="lx-navsearch-meta">
                {Math.min(20, totalItems)} / {totalItems}
              </span>
            )}
          </div>

          {error && <div className="lx-navsearch-empty">{error}</div>}

          {!error && !loading && items.length === 0 && <div className="lx-navsearch-empty">Nessun gioco trovato.</div>}

          {!error && items.length > 0 && (
            <div className="lx-navsearch-list">
              {items.map((g) => (
                <button key={g.gameId} type="button" className="lx-navsearch-item" onClick={() => goToGame(g.gameId)}>
                  <img className="lx-navsearch-cover" src={g.coverUrl} alt={g.title} />
                  <div className="lx-navsearch-info">
                    <div className="lx-navsearch-name">{g.title}</div>
                    <div className="lx-navsearch-sub">
                      ⭐ {g.averageRating ?? 0} • {g.reviewsCount ?? 0} review
                    </div>
                  </div>
                  <i className="bi bi-chevron-right lx-navsearch-chevron" />
                </button>
              ))}
            </div>
          )}

          <div className="lx-navsearch-footer">
            <button type="button" className="btn lx-btn-outline w-100" onClick={goToLibraryAll}>
              {showAll ? "Mostra tutti →" : "Vai alla libreria →"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
