import { useEffect, useMemo, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import AddToLibraryModal from "../components/Library/AddToLibraryModal";
import GameDetailSkeleton from "../components/GameDetail/GameDetailSkeleton";
import GameDetailHero from "../components/GameDetail/GameDetailHero";
import GameDetailMeta from "../components/GameDetail/GameDetailMeta";
import GamePlayersSection from "../components/GameDetail/GamePlayersSection";
import GameRelatedSection from "../components/GameDetail/GameRelatedSection";
import { loadGameDetail, loadMyProfile } from "../redux/action";
import "../styles/GameDetailStyle.css";

const GameDetailPage = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const authUser = useSelector((state) => state.auth.user);
  const myProfileState = useSelector((state) => state.userData.my) || {
    data: null,
    loading: false,
    loaded: false,
    error: null,
  };

  const userGames = myProfileState.data?.games || [];
  const { game, related, loading, error } = useSelector((state) => state.gameDetail);

  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (gameId) {
      dispatch(loadGameDetail(gameId));
    }
  }, [gameId, dispatch]);

  const alreadyInLibrary = useMemo(() => userGames.some((ug) => ug.gameId === gameId), [userGames, gameId]);

  const handleAddClick = useCallback(() => {
    if (!authUser) {
      navigate("/auth");
      return;
    }
    setModalOpen(true);
  }, [authUser, navigate]);

  const handleModalSaved = useCallback(() => {
    setModalOpen(false);
    if (gameId) {
      dispatch(loadGameDetail(gameId));
    }
    if (authUser?.userId) {
      dispatch(loadMyProfile(authUser.userId));
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

  /* Dynamic Theme */
  const mainColor = game?.mainColor || game?.MainColor || "#1b1430";
  const secondaryColor = game?.secondaryColor || game?.SecondaryColor || "#090518";
  const accentColor = game?.accentColor || game?.AccentColor || "#00d9ff";

  useEffect(() => {
    if (!game) return;

    const body = document.body;
    const root = document.documentElement;
    const page = document.querySelector(".lx-game-detail-page");

    // Store previous values
    const prevMain = root.style.getPropertyValue("--lx-detail-main");
    const prevSecondary = root.style.getPropertyValue("--lx-detail-secondary");
    const prevAccent = root.style.getPropertyValue("--lx-detail-accent");

    // Apply theme
    body.classList.add("lx-body-game-detail");
    root.style.setProperty("--lx-detail-main", mainColor);
    root.style.setProperty("--lx-detail-secondary", secondaryColor);
    root.style.setProperty("--lx-detail-accent", accentColor);

    // NUOVO: Applica anche un tint molto leggero al page wrapper
    if (page) {
      page.style.setProperty(
        "background",
        `
        radial-gradient(ellipse at 50% 20%, ${mainColor}15 0%, transparent 60%),
        radial-gradient(ellipse at 50% 60%, ${secondaryColor}10 0%, transparent 70%),
        linear-gradient(180deg, rgba(10,12,16,0.6) 0%, rgba(10,12,16,0.4) 30%, rgba(10,12,16,0.2) 60%, transparent 100%)
      `,
      );
    }

    return () => {
      body.classList.remove("lx-body-game-detail");

      if (prevMain) root.style.setProperty("--lx-detail-main", prevMain);
      else root.style.removeProperty("--lx-detail-main");

      if (prevSecondary) root.style.setProperty("--lx-detail-secondary", prevSecondary);
      else root.style.removeProperty("--lx-detail-secondary");

      if (prevAccent) root.style.setProperty("--lx-detail-accent", prevAccent);
      else root.style.removeProperty("--lx-detail-accent");

      if (page) {
        page.style.removeProperty("background");
      }
    };
  }, [game, mainColor, secondaryColor, accentColor]);

  /* Skeleton Loader */
  if (loading) {
    return <GameDetailSkeleton />;
  }

  /* Error State */
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
