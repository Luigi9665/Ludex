// src/pages/admin/AdminCreateGamePage.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { loadGenres, loadPlatforms } from "../../redux/action";
import LxLoader from "../../components/LxLoader";
import GameCreateForm from "./GameCreateForm";

const AdminCreateGamePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const authUser = useSelector((state) => state.auth.user);
  const isAdmin = authUser?.role === "Admin";

  const { genres, platforms } = useSelector(
    (state) =>
      state.selectGame || {
        genres: { items: [], loading: false, error: null },
        platforms: { items: [], loading: false, error: null },
      },
  );

  // sicurezza: se non sei admin, ti rimando via
  useEffect(() => {
    if (!isAdmin) {
      navigate("/unauthorized");
    }
  }, [isAdmin, navigate]);

  // carico generi e piattaforme
  useEffect(() => {
    if (isAdmin) {
      dispatch(loadGenres());
      dispatch(loadPlatforms());
    }
  }, [dispatch]);

  const loading = genres?.loading || platforms?.loading;
  const error = genres?.error || platforms?.error;

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

          <button type="button" className="btn lx-btn-outline d-none d-md-inline-flex align-items-center" onClick={() => navigate(-1)}>
            <i className="bi bi-arrow-left me-1" />
            Torna indietro
          </button>
        </div>

        <div className="lx-glass p-4 p-md-5 lx-admin-card">
          {loading && <LxLoader message="Carico generi e piattaforme..." />}

          {!loading && error && <div className="alert alert-danger mb-0">Non riesco a caricare generi e piattaforme. Controlla il backend e riprova.</div>}

          {!loading && !error && <GameCreateForm genres={genres?.items ?? []} platforms={platforms?.items ?? []} />}
        </div>
      </div>
    </section>
  );
};

export default AdminCreateGamePage;
