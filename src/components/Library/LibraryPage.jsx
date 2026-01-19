// src/pages/LibraryPage.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import LxLoader from "../LxLoader";
import LibraryFilters from "../Library/LibraryFilters";
import LibraryGrid from "../Library/LibraryGrid";
import LibraryPagination from "../Library/LibraryPagination";
import { loadLibraryPage, searchLibraryGames } from "../../redux/action";

const LibraryPage = () => {
  const dispatch = useDispatch();
  const library = useSelector((state) => state.libraryGames);

  const { items, loading, error, page, pageSize, totalItems, totalPages, filters, mode } = library;

  // stato locale per i filtri (così non spari request a ogni click di checkbox)
  const [searchText, setSearchText] = useState(filters.search || "");
  const [selectedGenres, setSelectedGenres] = useState(filters.genres || []);
  const [selectedPlatforms, setSelectedPlatforms] = useState(filters.platforms || []);

  // primo load → catalogo completo
  useEffect(() => {
    dispatch(loadLibraryPage(1));
  }, [dispatch]);

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
      // usa i filtri che sono salvati nello store
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

  return (
    <section className="lx-section">
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="lx-section-title">
            <i className="bi bi-collection-play me-2"></i>
            Libreria giochi
          </h1>
          <span className="text-muted small">{mode === "search" ? "Risultati filtrati" : "Catalogo completo"}</span>
        </div>

        <div className="row">
          {/* FILTRI */}
          <div className="col-lg-3 col-md-4 mb-4">
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
          <div className="col-lg-9 col-md-8">
            {loading && <LxLoader message="Carico il catalogo giochi..." />}

            {!loading && error && (
              <div className="alert alert-danger lx-glass">
                <i className="bi bi-exclamation-triangle me-2" />
                {error}
              </div>
            )}

            {!loading && !error && (
              <>
                <LibraryGrid games={items} />

                {totalPages > 0 && (
                  <LibraryPagination page={page} pageSize={pageSize} totalItems={totalItems} totalPages={totalPages} onPageChange={handleChangePage} />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LibraryPage;
