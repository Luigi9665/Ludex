import { useSelector } from "react-redux";
import GameCard from "../HomePage/GameCard";

const LibraryGrid = ({ games, enableAddButton, onAddClick }) => {
  const userDetails = useSelector((state) => state.userData.userDetails);

  const userGames = userDetails?.games || [];

  const userGameIds = new Set(userGames?.map((ug) => ug.gameId));
  if (!games || games.length === 0) {
    return (
      <div className="lx-glass p-5 text-center">
        <i className="bi bi-controller display-4 mb-3 lx-text-glow"></i>
        <h4 className="mb-2">Nessun gioco trovato</h4>
        <p className="text-white-50 mb-0">Prova a cambiare i filtri o la ricerca.</p>
      </div>
    );
  }

  return (
    <div className="row g-4 mb-4">
      {games?.map((game) => {
        const alreadyInLibrary = userGameIds.has(game.gameId);

        return (
          <div key={game.gameId} className="col-6 col-md-4 col-lg-3 col-xl-2">
            <GameCard game={game} enableAddButton={enableAddButton} alreadyInLibrary={alreadyInLibrary} onAddClick={onAddClick} />
          </div>
        );
      })}
    </div>
  );
};

export default LibraryGrid;
