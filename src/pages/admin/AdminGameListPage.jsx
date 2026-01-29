import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { loadAdminGames, searchAdminGames } from "../../redux/action";
import LxLoader from "../../components/LxLoader";
import AdminGameTable from "./AdminGameTable";

const AdminGameListPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const authUser = useSelector((state) => state.auth.user);
  const isAdmin = authUser?.role === "Admin";

  const { items, page, pageSize, totalItems, searchTerm, loading, error } = useSelector((state) => state.adminGames);

  // nota per me futuro:
  // uso uno stato locale per la casella di ricerca,
  // così non sparo una chiamata API ad ogni keypress.
  const [searchInput, setSearchInput] = useState("");

  // redirect se non sei admin
  useEffect(() => {
    if (!isAdmin) {
      navigate("/unauthorized");
    }
  }, [isAdmin, navigate]);

  // caricamento iniziale (lista base)
  useEffect(() => {
    if (isAdmin) {
      dispatch(loadAdminGames(1, 20));
    }
  }, [dispatch, isAdmin]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmed = searchInput.trim();

    if (!trimmed) {
      // se la search è vuota → torno alla lista "normale"
      dispatch(loadAdminGames(1, 20));
      return;
    }

    dispatch(searchAdminGames(trimmed, 1, 20));
  };

  const handleClearSearch = () => {
    setSearchInput("");
    dispatch(loadAdminGames(1, 20));
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1) return;
    const maxPage = Math.max(1, Math.ceil(totalItems / pageSize));
    if (newPage > maxPage) return;

    if (searchTerm && searchTerm.trim()) {
      dispatch(searchAdminGames(searchTerm, newPage, pageSize));
    } else {
      dispatch(loadAdminGames(newPage, pageSize));
    }
  };

  const handleEditClick = (gameId) => {
    // route che useremo per l'edit
    navigate(`/admin/games/${gameId}/edit`);
  };

  const handleCreateClick = () => {
    navigate("/admin/games/new"); // la tua AdminCreateGamePage
  };

  return (
    <section className="lx-section">
      <div className="container-fluid">
        {/* HEADER */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <h1 className="lx-h1-soft text-end m-0">
                <i className="bi bi-shield-lock"></i>
                <span>Area Admin</span>
              </h1>
              <h2 className="lx-section-title mb-0">Gestione giochi</h2>
            </div>
            <p className="text-white-50 small mb-0">Qui puoi vedere, cercare e modificare tutti i titoli nel catalogo.</p>
          </div>

          <div className="d-flex gap-2">
            <button type="button" className="btn lx-btn-outline d-none d-md-inline-flex align-items-center" onClick={() => navigate(-1)}>
              <i className="bi bi-arrow-left me-1" />
              Indietro
            </button>

            <button type="button" className="btn lx-btn-primary d-flex align-items-center" onClick={handleCreateClick}>
              <i className="bi bi-plus-lg me-1" />
              Nuovo gioco
            </button>
          </div>
        </div>

        {/* CARD PRINCIPALE */}
        <div className="lx-glass p-3 p-md-4">
          {/* barra di ricerca */}
          <form className="row g-2 align-items-center mb-3" onSubmit={handleSearchSubmit}>
            <div className="col-12 col-md-6 col-lg-4">
              <div className="input-group">
                <span className="input-group-text bg-transparent border-secondary text-white-50">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control lx-field-control"
                  placeholder="Cerca per titolo..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              </div>
            </div>

            <div className="col-12 col-md-4 col-lg-3 d-flex gap-2">
              <button type="submit" className="btn btn-sm lx-btn-primary flex-grow-1" disabled={loading}>
                Cerca
              </button>
              {searchTerm && (
                <button type="button" className="btn btn-sm lx-btn-outline" onClick={handleClearSearch} disabled={loading}>
                  Reset
                </button>
              )}
            </div>

            {searchTerm && (
              <div className="col-12 col-lg-5 text-white-50 small">
                Risultati per: <strong>{searchTerm}</strong>
              </div>
            )}
          </form>

          {/* LOADER / ERROR / TABLE */}
          {loading && <LxLoader message="Carico la lista dei giochi..." />}

          {!loading && error && <div className="alert alert-danger mb-0">{error}</div>}

          {!loading && !error && (
            <>
              <AdminGameTable items={items} onEditClick={handleEditClick} />

              {/* paginazione semplice */}
              {totalItems > pageSize && (
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <span className="text-white-50 small">
                    Pagina {page} di {Math.max(1, Math.ceil(totalItems / pageSize))} — {totalItems} giochi totali
                  </span>

                  <div className="btn-group">
                    <button type="button" className="btn btn-sm lx-btn-outline" onClick={() => handlePageChange(page - 1)} disabled={page <= 1 || loading}>
                      <i className="bi bi-chevron-left" /> Prec
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm lx-btn-outline"
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page >= Math.ceil(totalItems / pageSize) || loading}
                    >
                      Succ <i className="bi bi-chevron-right" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default AdminGameListPage;
