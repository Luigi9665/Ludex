// src/pages/admin/AdminCreateGamePage.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { loadGenres, loadPlatforms, loadGameMetadata } from "../../redux/action";
import LxLoader from "../../components/LxLoader";
import GameCreateForm from "./GameCreateForm";

const AdminCreateGamePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const authUser = useSelector((state) => state.auth.user);
  const isAdmin = authUser?.role === "Admin";

  // genero + piattaforme + metadata: tutto dallo slice selectGame
  const { genres, platforms, metadata } = useSelector((state) => state.selectGame) || {
    genres: { items: [], loading: false, error: null },
    platforms: { items: [], loading: false, error: null },
    metadata: {
      focuses: { items: [], loading: false, error: null },
      moods: { items: [], loading: false, error: null },
      difficulties: { items: [], loading: false, error: null },
      tags: { items: [], loading: false, error: null },
    },
  };

  // se non sei admin → via
  useEffect(() => {
    if (!isAdmin) {
      navigate("/unauthorized");
    }
  }, [isAdmin, navigate]);

  // carico generi, piattaforme e metadata (focus/mood/diff/tags)
  useEffect(() => {
    if (isAdmin) {
      dispatch(loadGenres());
      dispatch(loadPlatforms());
      dispatch(loadGameMetadata());
    }
  }, [dispatch, isAdmin]);

  const loading =
    genres?.loading ||
    platforms?.loading ||
    metadata?.focuses?.loading ||
    metadata?.moods?.loading ||
    metadata?.difficulties?.loading ||
    metadata?.tags?.loading;

  const error =
    genres?.error || platforms?.error || metadata?.focuses?.error || metadata?.moods?.error || metadata?.difficulties?.error || metadata?.tags?.error;

  return (
    <section className="lx-section">
      <div className="container">
        <div className="d-flex justify-content-between align-items-start mb-4">
          <div>
            <div className="d-flex align-items-center gap-2 mb-2">
              <h1 className="lx-h1-soft text-end m-0">
                <i className="bi bi-shield-lock"></i>
                <span>Area Admin</span>
              </h1>

              <h2 className="lx-section-title">Nuovo gioco</h2>
            </div>
            <p className="text-white-50 small mb-0">Aggiungi un titolo al catalogo globale di Ludex.</p>
          </div>

          <div className="d-none d-md-flex gap-2">
            <button type="button" className="btn lx-btn-outline" onClick={() => navigate(-1)}>
              <i className="bi bi-arrow-left me-1" />
              Torna indietro
            </button>

            <button type="button" className="btn lx-btn-primary" onClick={() => navigate("/admin/games")}>
              <i className="bi bi-controller me-1" />
              Vai alla gestione giochi
            </button>
          </div>
        </div>

        <div className="lx-glass p-4 p-md-5 lx-admin-card">
          {loading && <LxLoader message="Carico generi, piattaforme e metadata..." />}

          {!loading && error && (
            <div className="alert alert-danger mb-0">Non riesco a caricare generi, piattaforme o metadata. Controlla il backend e riprova.</div>
          )}

          {!loading && !error && (
            <GameCreateForm
              genres={genres?.items ?? []}
              platforms={platforms?.items ?? []}
              focuses={metadata?.focuses?.items ?? []}
              moods={metadata?.moods?.items ?? []}
              difficulties={metadata?.difficulties?.items ?? []}
              tags={metadata?.tags?.items ?? []}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default AdminCreateGamePage;
