import { useEffect, useMemo, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";

import LxLoader from "../components/LxLoader";
import AddToLibraryModal from "../components/Library/AddToLibraryModal";

import GameDetailHero from "../components/GameDetail/GameDetailHero";
import GameDetailMeta from "../components/GameDetail/GameDetailMeta";
import GamePlayersSection from "../components/GameDetail/GamePlayersSection";
import GameRelatedSection from "../components/GameDetail/GameRelatedSection";

import { loadGameDetail } from "../redux/action";

const GameDetailPage = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const authUser = useSelector((state) => state.auth.user);
  const userGames = useSelector((state) => state.userData.userDetails?.games || []);
  const { game, related, loading, error } = useSelector((state) => state.gameDetail);

  const [modalOpen, setModalOpen] = useState(false);

  // carico dettagli gioco
  useEffect(() => {
    if (gameId) {
      dispatch(loadGameDetail(gameId));
    }
  }, [gameId, dispatch]);

  // flag "già nella mia libreria"
  const alreadyInLibrary = useMemo(() => userGames.some((ug) => ug.gameId === gameId), [userGames, gameId]);

  // CTA aggiungi
  const handleAddClick = useCallback(() => {
    if (!authUser) {
      navigate("/auth");
      return;
    }
    setModalOpen(true);
  }, [authUser, navigate]);

  const handleModalSaved = useCallback(() => {
    setModalOpen(false);
    // se vuoi ricaricare i dettagli o il profilo utente, lo fai qui
    // dispatch(loadGameDetail(gameId));
    // dispatch(loadUserPrivateProfile(authUser.userId));
  }, []);

  // navigazione da pill di genere/piattaforma
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

  // 👉 tema “pagina dettaglio”: classe sul body (tutta la pagina con lo stesso gradient)
  useEffect(() => {
    document.body.classList.add("lx-body-game-detail");
    return () => {
      document.body.classList.remove("lx-body-game-detail");
    };
  }, []);

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
    <>
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

      <GameDetailMeta releaseDate={releaseDate} genres={genres} platforms={platforms} />

      <GamePlayersSection userGames={gameUsers} />

      <GameRelatedSection relatedGames={related} genres={genres} />

      <AddToLibraryModal game={game} open={modalOpen} onClose={() => setModalOpen(false)} onSaved={handleModalSaved} />
    </>
  );
};

export default GameDetailPage;
