import { useEffect, useMemo, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import LxLoader from "../components/LxLoader";
import AddToLibraryModal from "../components/Library/AddToLibraryModal";

import GameDetailHero from "../components/GameDetail/GameDetailHero";
import GameDetailMeta from "../components/GameDetail/GameDetailMeta";
import GamePlayersSection from "../components/GameDetail/GamePlayersSection";
import GameRelatedSection from "../components/GameDetail/GameRelatedSection";
import { loadGameDetail, loadUserDetails } from "../redux/action";

const GameDetailPage = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const authUser = useSelector((state) => state.auth.user);
  const userGames = useSelector((state) => state.userData.userDetails?.games) || [];
  const { game, related, loading, error } = useSelector((state) => state.gameDetail);

  const [modalOpen, setModalOpen] = useState(false);

  // carico i dettagli gioco
  useEffect(() => {
    if (gameId) {
      dispatch(loadGameDetail(gameId));
    }
  }, [gameId, dispatch]);

  // è già nella mia libreria?
  const alreadyInLibrary = useMemo(() => userGames.some((ug) => ug.gameId === gameId), [userGames, gameId]);

  const handleAddClick = useCallback(() => {
    if (!authUser) {
      navigate("/auth");
      return;
    }
    setModalOpen(true);
  }, [authUser, navigate]);

  const handleModalSaved = useCallback(() => {
    // chiudi il modal
    setModalOpen(false);

    // ricarica DETTAGLI gioco (per aggiornare userGames del gioco, ecc.)
    if (gameId) {
      dispatch(loadGameDetail(gameId));
    }

    // ricarica i dati utente (per aggiornare userDetails.games → alreadyInLibrary)
    if (authUser?.userId) {
      dispatch(
        loadUserDetails(authUser.userId, {
          publicProfile: false,
        }),
      );
    }
  }, [dispatch, gameId, authUser]);

  const handleGenreClick = useCallback(
    (genre) => {
      navigate(`/library?genre=${encodeURIComponent(genre)}`);
    },
    [navigate],
  );

  const handlePlatformClick = useCallback(
    (platform) => {
      navigate(`/library?platform=${encodeURIComponent(platform)}`);
    },
    [navigate],
  );

  /** ===============================
   *  TEMA DINAMICO DAL BACKEND
   *  =============================== */

  const mainColor = game?.mainColor || game?.MainColor || "#1b1430";
  const secondaryColor = game?.secondaryColor || game?.SecondaryColor || "#090518";
  const accentColor = game?.accentColor || game?.AccentColor || "#00d9ff";

  useEffect(() => {
    if (!game) return;

    const body = document.body;
    const root = document.documentElement;

    const prevMain = root.style.getPropertyValue("--lx-detail-main");
    const prevSecondary = root.style.getPropertyValue("--lx-detail-secondary");
    const prevAccent = root.style.getPropertyValue("--lx-detail-accent");

    body.classList.add("lx-body-game-detail");
    root.style.setProperty("--lx-detail-main", mainColor);
    root.style.setProperty("--lx-detail-secondary", secondaryColor);
    root.style.setProperty("--lx-detail-accent", accentColor);

    return () => {
      body.classList.remove("lx-body-game-detail");

      if (prevMain) root.style.setProperty("--lx-detail-main", prevMain);
      else root.style.removeProperty("--lx-detail-main");

      if (prevSecondary) root.style.setProperty("--lx-detail-secondary", prevSecondary);
      else root.style.removeProperty("--lx-detail-secondary");

      if (prevAccent) root.style.setProperty("--lx-detail-accent", prevAccent);
      else root.style.removeProperty("--lx-detail-accent");
    };
  }, [game, mainColor, secondaryColor, accentColor]);

  /** =============================== */

  if (loading) {
    return (
      <section className="lx-section">
        <div className="container">
          <LxLoader message="Carico i dettagli del gioco..." />
        </div>
      </section>
    );
  }

  if (error || !game) {
    return (
      <section className="lx-section">
        <div className="container">
          <div className="lx-glass p-4 text-center">
            <p className="text-danger mb-2">{error || "Gioco non trovato."}</p>
            <button type="button" className="btn lx-btn-outline" onClick={() => navigate(-1)}>
              Torna indietro
            </button>
          </div>
        </div>
      </section>
    );
  }

  const { title, description, coverUrl, releaseDate, platform: platforms = [], genre: genres = [], userGames: gameUsers = [] } = game;

  return (
    <div className="lx-game-detail-page">
      <GameDetailHero
        title={title}
        description={description}
        coverUrl={coverUrl}
        releaseDate={releaseDate}
        platforms={platforms}
        genres={genres}
        alreadyInLibrary={alreadyInLibrary}
        onAddClick={handleAddClick}
        onGenreClick={handleGenreClick}
        onPlatformClick={handlePlatformClick}
      />

      <div className="lx-game-detail-content">
        <GameDetailMeta releaseDate={releaseDate} genres={genres} platforms={platforms} />

        <GamePlayersSection userGames={gameUsers} />

        <GameRelatedSection relatedGames={related} genres={genres} />
      </div>

      <AddToLibraryModal game={game} open={modalOpen} onClose={() => setModalOpen(false)} onSaved={handleModalSaved} />
    </div>
  );
};

export default GameDetailPage;
