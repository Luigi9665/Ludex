// src/pages/admin/AdminEditGamePage.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { loadGenres, loadPlatforms, loadGameMetadata } from "../../redux/action";
import { apiFetch } from "../../apiFetch Autenticate/apiFetch";
import { safeJson } from "../../apiFetch Autenticate/safeJson";
import LxLoader from "../../components/LxLoader";
import GameEditForm from "./GameEditForm";

const AdminEditGamePage = () => {
  const { id } = useParams(); // gameId dalla route
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const authUser = useSelector((state) => state.auth.user);
  const isAdmin = authUser?.role === "Admin";

  const { genres, platforms, metadata } = useSelector(
    (state) =>
      state.selectGame || {
        genres: { items: [], loading: false, error: null },
        platforms: { items: [], loading: false, error: null },
        metadata: {
          focuses: { items: [], loading: false, error: null },
          moods: { items: [], loading: false, error: null },
          difficulties: { items: [], loading: false, error: null },
          tags: { items: [], loading: false, error: null },
        },
      },
  );
  // stato locale per il dettaglio del gioco da editare
  const [game, setGame] = useState(null);
  const [loadingGame, setLoadingGame] = useState(true);
  const [errorGame, setErrorGame] = useState("");

  // sicurezza: se non sei admin, ti rimando via
  useEffect(() => {
    if (!isAdmin) {
      navigate("/unauthorized");
    }
  }, [isAdmin, navigate]);

  // carico generi/piattaforme/metadata solo se sono Admin
  useEffect(() => {
    if (!isAdmin) return;

    dispatch(loadGenres());
    dispatch(loadPlatforms());
    dispatch(loadGameMetadata());
  }, [dispatch, isAdmin]);

  // carico il gioco specifico per l'edit (endpoint admin)
  useEffect(() => {
    if (!isAdmin || !id) return;

    let cancelled = false;

    const fetchGame = async () => {
      setLoadingGame(true);
      setErrorGame("");

      try {
        const res = await apiFetch(`/api/Games/admin/${id}`);

        if (res.status === 404) {
          if (!cancelled) {
            setErrorGame("Gioco non trovato.");
          }
          return;
        }

        if (!res.ok) {
          throw new Error("Impossibile caricare i dati del gioco.");
        }

        const data = await safeJson(res);

        // Nota per me futuro:
        // mi aspetto un dto tipo:
        // {
        //   gameId,
        //   title,
        //   description,
        //   releaseDate,
        //   coverUrl,
        //   platformIds: number[],
        //   genreIds: number[],
        //   primaryFocusId: number|null,
        //   primaryMoodId: number|null,
        //   difficultyId: number|null,
        //   averageLengthHours: number|null,
        //   isMultiplayer: bool,
        //   isCoop: bool,
        //   freeGame: bool,
        //   isDeleted: bool,
        //   tagIds: number[]
        // }
        if (!cancelled) {
          setGame(data);
        }
      } catch (err) {
        if (!cancelled) {
          setErrorGame(err?.message || "Errore imprevisto nel caricamento del gioco.");
        }
      } finally {
        if (!cancelled) {
          setLoadingGame(false);
        }
      }
    };

    fetchGame();

    return () => {
      cancelled = true;
    };
  }, [id, isAdmin]);

  const loadingMeta =
    genres?.loading || platforms?.loading || metadata.focuses?.loading || metadata.moods?.loading || metadata.difficulties?.loading || metadata.tags?.loading;

  const metaError =
    genres?.error || platforms?.error || metadata.focuses?.error || metadata.moods?.error || metadata.difficulties?.error || metadata.tags?.error;

  // callback quando il salvataggio va a buon fine
  const handleSaved = () => {
    // per ora torno alla lista admin giochi
    navigate("/admin/games");
  };

  return (
    <section className="lx-section">
      <div className="container">
        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-start mb-4">
          <div>
            <div className="d-flex align-items-center gap-2 mb-2">
              <h1 className="lx-h1-soft text-end m-0">
                <i className="bi bi-shield-lock"></i>
                <span>Area Admin</span>
              </h1>
              <h2 className="lx-section-title mb-0">Modifica gioco</h2>
            </div>
            <p className="text-white-50 small mb-0">Aggiorna le informazioni di questo titolo, inclusi metadata per i consigli.</p>
          </div>

          <button type="button" className="btn lx-btn-outline d-none d-md-inline-flex align-items-center" onClick={() => navigate(-1)}>
            <i className="bi bi-arrow-left me-1" />
            Torna indietro
          </button>
        </div>

        <div className="lx-glass p-4 p-md-5 lx-admin-card">
          {(loadingGame || loadingMeta) && <LxLoader message="Carico dati gioco e metadata..." />}

          {!loadingGame && errorGame && <div className="alert alert-danger mb-0">{errorGame}</div>}

          {!loadingGame && !errorGame && metaError && (
            <div className="alert alert-danger mb-0">Non riesco a caricare i dati di supporto (generi/piattaforme/metadata).</div>
          )}

          {!loadingGame && !errorGame && !loadingMeta && !metaError && game && (
            <GameEditForm
              game={game}
              genres={genres?.items ?? []}
              platforms={platforms?.items ?? []}
              focuses={metadata.focuses?.items ?? []}
              moods={metadata.moods?.items ?? []}
              difficulties={metadata.difficulties?.items ?? []}
              tags={metadata.tags?.items ?? []}
              onSaved={handleSaved}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default AdminEditGamePage;
