import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";

import LxLoader from "../LxLoader";
import LibraryFilters from "../Library/LibraryFilters";
import LibraryGrid from "../Library/LibraryGrid";
import LibraryPagination from "../Library/LibraryPagination";
import AddToLibraryModal from "./AddToLibraryModal";

import { loadLibraryPage, loadUserDetails, searchLibraryGames } from "../../redux/action";

const LibraryPage = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  // --- AUTH ---
  const authState = useSelector((state) => state.auth || {});
  const isAuthenticated = authState.isAuthenticated ?? false;
  const authUser = authState.user;

  // --- LIBRARY STATE ---
  const library = useSelector((state) => state.libraryGames);
  const { items, loading, error, page, pageSize, totalItems, totalPages, filters, mode } = library;

  // --- PARAMETRI URL ---
  const searchParams = new URLSearchParams(location.search);

  // accetto sia ?Title= che ?title=
  const titleFromUrl = searchParams.get("Title") || searchParams.get("title") || "";

  // da GameDetailPage: /library?genre=Action&platform=PC
  const genreFromUrl = searchParams.get("genre") || "";
  const platformFromUrl = searchParams.get("platform") || "";

  // --- FILTRI UI LOCALI ---
  // li uso solo per gestire l'interfaccia; le query effettive le mando io quando voglio
  const [searchText, setSearchText] = useState(filters.search || "");
  const [selectedGenres, setSelectedGenres] = useState(filters.genres || []);
  const [selectedPlatforms, setSelectedPlatforms] = useState(filters.platforms || []);

  // quando cambiano i parametri nell’URL, sincronizzo la UI dei filtri
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearchText(titleFromUrl || "");
    setSelectedGenres(genreFromUrl ? [genreFromUrl] : []);
    setSelectedPlatforms(platformFromUrl ? [platformFromUrl] : []);
  }, [titleFromUrl, genreFromUrl, platformFromUrl]);

  // primo load / cambio query string → decido se usare search o catalogo base
  useEffect(() => {
    const hasTitle = titleFromUrl.trim().length >= 2;
    const hasGenre = !!genreFromUrl;
    const hasPlatform = !!platformFromUrl;

    if (hasTitle || hasGenre || hasPlatform) {
      // arrivo con filtri da URL: faccio una search con quei valori
      dispatch(
        searchLibraryGames({
          page: 1,
          search: titleFromUrl,
          genres: hasGenre ? [genreFromUrl] : [],
          platforms: hasPlatform ? [platformFromUrl] : [],
        }),
      );
    } else {
      // nessun filtro da URL: carico il catalogo base (paginato)
      dispatch(loadLibraryPage(1));
    }
  }, [titleFromUrl, genreFromUrl, platformFromUrl, dispatch]);

  // --- AZIONI FILTRI ---

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
      // lista completa
      dispatch(loadLibraryPage(newPage));
    } else {
      // modalità search: uso i filtri salvati nello store
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

  // --- MODALE "AGGIUNGI ALLA MIA LIBRERIA" ---
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
    // dopo aver aggiunto / modificato un gioco nella mia libreria
    dispatch(loadLibraryPage(1));

    if (authUser?.userId) {
      dispatch(loadUserDetails(authUser.userId));
    }
  };

  return (
    <section className="lx-section">
      <div className="container-fluid">
        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="lx-section-title">
            <i className="bi bi-collection-play me-2" />
            Libreria giochi
          </h1>
          <span className="text-muted small">{mode === "search" ? "Risultati filtrati" : "Catalogo completo"}</span>
        </div>

        <div className="row">
          {/* FILTRI */}
          <div className="col-lg-2 col-md-4 mb-4">
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

          {/* CONTENUTO PRINCIPALE */}
          <div className="col-lg-10 col-md-8">
            {loading && <LxLoader message="Carico il catalogo giochi..." />}

            {!loading && error && (
              <div className="alert alert-danger lx-glass">
                <i className="bi bi-exclamation-triangle me-2" />
                {error}
              </div>
            )}

            {!loading && !error && (
              <>
                <LibraryGrid games={items} enableAddButton={true} onAddClick={handleOpenAdd} />

                {totalPages > 0 && (
                  <LibraryPagination page={page} pageSize={pageSize} totalItems={totalItems} totalPages={totalPages} onPageChange={handleChangePage} />
                )}
              </>
            )}
          </div>
        </div>

        <AddToLibraryModal game={selectedGame} open={addOpen} onClose={handleCloseAdd} onSaved={handleSaved} />
      </div>
    </section>
  );
};

export default LibraryPage;
