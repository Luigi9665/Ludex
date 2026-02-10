import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";

import LxLoader from "../LxLoader";
import LibraryFilters from "../Library/LibraryFilters";
import LibraryGrid from "../Library/LibraryGrid";
import LibraryPagination from "../Library/LibraryPagination";
import AddToLibraryModal from "./AddToLibraryModal";

import { loadLibraryPage, loadMyProfile, searchLibraryGames } from "../../redux/action";

import "../../styles/LibraryPage.css";

const LibraryPage = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const authState = useSelector((state) => state.auth || {});
  const isAuthenticated = authState.isAuthenticated ?? false;
  const authUser = authState.user;

  const library = useSelector((state) => state.libraryGames);
  const { items, loading, error, page, pageSize, totalItems, totalPages, filters, mode } = library;

  const searchParams = new URLSearchParams(location.search);

  const titleFromUrl = searchParams.get("Title") || searchParams.get("title") || "";

  // multi-genre: ?genre=Action&genre=RPG&genre=Indie
  const genresFromUrlRaw = searchParams.getAll("genre");
  const singleGenre = searchParams.get("genre") || "";
  const genresFromUrl = genresFromUrlRaw.length > 0 ? genresFromUrlRaw : singleGenre ? [singleGenre] : [];

  // chiave stabile per le deps degli useEffect
  const genresKey = genresFromUrl.join("|");

  const platformFromUrl = searchParams.get("platform") || "";

  const [searchText, setSearchText] = useState(filters.search || "");
  const [selectedGenres, setSelectedGenres] = useState(filters.genres || []);
  const [selectedPlatforms, setSelectedPlatforms] = useState(filters.platforms || []);

  // sync stato locale con URL
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearchText(titleFromUrl || "");
    setSelectedGenres(genresFromUrl);
    setSelectedPlatforms(platformFromUrl ? [platformFromUrl] : []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [titleFromUrl, genresKey, platformFromUrl]);

  // trigger load / search quando cambia l'URL
  useEffect(() => {
    const hasTitle = titleFromUrl.trim().length >= 2;
    const hasGenre = genresFromUrl.length > 0;
    const hasPlatform = !!platformFromUrl;

    if (hasTitle || hasGenre || hasPlatform) {
      dispatch(
        searchLibraryGames({
          page: 1,
          search: titleFromUrl,
          genres: genresFromUrl,
          platforms: hasPlatform ? [platformFromUrl] : [],
        }),
      );
    } else {
      dispatch(loadLibraryPage(1));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [titleFromUrl, genresKey, platformFromUrl, dispatch]);

  const handleApplyFilters = () => {
    dispatch(
      searchLibraryGames({
        page: 1,
        search: searchText,
        genres: selectedGenres,
        platforms: selectedPlatforms,
      }),
    );
  };

  const handleResetFilters = () => {
    setSearchText("");
    setSelectedGenres([]);
    setSelectedPlatforms([]);
    dispatch(loadLibraryPage(1));
  };

  const handleChangePage = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;

    if (mode === "all") {
      dispatch(loadLibraryPage(newPage));
    } else {
      dispatch(
        searchLibraryGames({
          page: newPage,
          search: filters.search,
          genres: filters.genres,
          platforms: filters.platforms,
        }),
      );
    }
  };

  const [selectedGame, setSelectedGame] = useState(null);
  const [addOpen, setAddOpen] = useState(false);

  const handleOpenAdd = (game) => {
    if (!isAuthenticated) {
      alert("Effettua il login o registrati per aggiungere giochi alla tua libreria.");
      return;
    }
    setSelectedGame(game);
    setAddOpen(true);
  };

  const handleCloseAdd = () => {
    setAddOpen(false);
    setSelectedGame(null);
  };

  const handleSaved = () => {
    dispatch(loadLibraryPage(1));

    if (authUser?.userId) {
      dispatch(loadMyProfile(authUser.userId));
    }
  };

  return (
    <div className="lx-library-page">
      <div className="lx-library-header">
        <div className="lx-library-header-content">
          <div className="lx-library-header-left">
            <h1 className="lx-library-title">
              <i className="bi bi-collection-play" />
              Libreria giochi
            </h1>
            <p className="lx-library-subtitle">Esplora il catalogo completo e aggiungi i tuoi preferiti</p>
          </div>
          <div className="lx-library-header-right">
            {mode === "search" && (
              <span className="lx-library-pill lx-library-pill--search">
                <i className="bi bi-funnel-fill" />
                Filtri attivi
              </span>
            )}
            <span className="lx-library-pill">
              <i className="bi bi-grid-3x3-gap" />
              {totalItems} giochi
            </span>
          </div>
        </div>
      </div>

      <div className="lx-library-layout">
        <aside className="lx-library-sidebar">
          <div className="lx-glow-frame">
            <div className="lx-glow-frame-content">
              <LibraryFilters
                search={searchText}
                onSearchChange={setSearchText}
                selectedGenres={selectedGenres}
                onGenresChange={setSelectedGenres}
                selectedPlatforms={selectedPlatforms}
                onPlatformsChange={setSelectedPlatforms}
                onApply={handleApplyFilters}
                onReset={handleResetFilters}
              />
            </div>
          </div>
        </aside>

        <main className="lx-library-content">
          {loading && <LxLoader message="Carico il catalogo giochi..." />}

          {!loading && error && (
            <div className="lx-library-error">
              <i className="bi bi-exclamation-triangle" />
              <span>{error}</span>
            </div>
          )}

          {!loading && !error && (
            <div className="lx-glow-frame">
              <div className="lx-glow-frame-content">
                <div className="lx-library-content-inner">
                  <LibraryGrid games={items} enableAddButton={true} onAddClick={handleOpenAdd} />

                  {totalPages > 0 && (
                    <LibraryPagination page={page} pageSize={pageSize} totalItems={totalItems} totalPages={totalPages} onPageChange={handleChangePage} />
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <AddToLibraryModal game={selectedGame} open={addOpen} onClose={handleCloseAdd} onSaved={handleSaved} />
    </div>
  );
};

export default LibraryPage;
