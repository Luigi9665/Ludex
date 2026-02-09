import { useMemo } from "react";
import GameShelf from "./GameShelf";

const GameShelves = ({ userGames }) => {
  const playing = useMemo(() => userGames.filter((g) => g.status === "Playing"), [userGames]);
  const backlog = useMemo(() => userGames.filter((g) => g.status === "Backlog"), [userGames]);
  const completed = useMemo(() => userGames.filter((g) => g.status === "Completed"), [userGames]);
  const paused = useMemo(() => userGames.filter((g) => g.status === "Paused"), [userGames]);

  const hasAnyGames = playing.length > 0 || backlog.length > 0 || completed.length > 0 || paused.length > 0;

  if (!hasAnyGames) {
    return (
      <section className="lx-shelves-frame">
        <div className="lx-shelves-empty">
          <i className="bi bi-controller lx-shelves-empty-icon" />
          <h3 className="lx-shelves-empty-title">La tua libreria è vuota</h3>
          <p className="lx-shelves-empty-text">Inizia ad aggiungere i tuoi titoli preferiti per organizzarli qui.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="lx-shelves-frame">
      <div className="lx-shelves">
        {playing.length > 0 && <GameShelf title="In corso" subtitle="Sessioni attive" games={playing} variant="playing" />}
        {backlog.length > 0 && <GameShelf title="Da iniziare" subtitle="In coda" games={backlog} variant="backlog" />}
        {completed.length > 0 && <GameShelf title="Completati" subtitle="Missione compiuta" games={completed} variant="completed" />}
        {paused.length > 0 && <GameShelf title="In pausa" subtitle="Tornerai presto" games={paused} variant="paused" />}
      </div>
    </section>
  );
};

export default GameShelves;
