import { useMemo } from "react";
import { useSelector } from "react-redux";
import GameCard from "../HomePage/GameCard";

const LibraryGrid = ({ games, enableAddButton, onAddClick }) => {
  // Stato profilo utente corretto
  const myProfileState = useSelector((state) => state.userData.my) || {
    data: null,
    loading: false,
    loaded: false,
    error: null,
  };

  const userGames = myProfileState.data?.games || [];

  // Set di gameId per verificare rapidamente se un gioco è già in libreria
  const userGameIds = useMemo(() => new Set(userGames.map((ug) => ug.gameId)), [userGames]);

  if (!games || games.length === 0) {
    return (
      <div className="lx-library-empty">
        <i className="bi bi-controller lx-library-empty-icon" />
        <h4 className="lx-library-empty-title">Nessun gioco trovato</h4>
        <p className="lx-library-empty-text">Prova a cambiare i filtri o la ricerca.</p>
      </div>
    );
  }

  return (
    <div className="lx-library-grid">
      {games.map((game) => {
        const alreadyInLibrary = userGameIds.has(game.gameId);

        return (
          <div key={game.gameId} className="lx-library-grid-item">
            <GameCard game={game} variant="compact" enableAddButton={enableAddButton} alreadyInLibrary={alreadyInLibrary} onAddClick={onAddClick} />
          </div>
        );
      })}
    </div>
  );
};

export default LibraryGrid;
