import { useEffect, useMemo, useState } from "react";
import { Gamepad2, Layers, PlayCircle, CheckCircle, Clock, XCircle } from "lucide-react";
import ProfileGameCard from "./ProfileGameCard";
import ProfileGameEditOverlay from "./ProfileGameEditOverlay";

const PAGE_SIZE = 12;

const ProfileContentArea = ({ games, isMe, onUpdate, onDelete, activeTab, onTabChange, searchText }) => {
  const [page, setPage] = useState(1);
  const [editingGame, setEditingGame] = useState(null);

  const filteredGames = useMemo(() => {
    let result = games;

    if (activeTab !== "all") {
      result = result.filter((g) => g.status === activeTab);
    }

    if (searchText?.trim().length >= 2) {
      const q = searchText.trim().toLowerCase();
      result = result.filter((g) => g.title.toLowerCase().includes(q));
    }

    return result;
  }, [games, activeTab, searchText]);

  const totalPages = Math.max(1, Math.ceil(filteredGames.length / PAGE_SIZE));

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPage(1);
  }, [activeTab, searchText]);

  const pagedGames = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredGames.slice(start, start + PAGE_SIZE);
  }, [filteredGames, page]);

  const counts = {
    all: games.length,
    Playing: games.filter((g) => g.status === "Playing").length,
    Completed: games.filter((g) => g.status === "Completed").length,
    Backlog: games.filter((g) => g.status === "Backlog").length,
    Dropped: games.filter((g) => g.status === "Dropped").length,
  };

  const mobileNavItems = [
    { key: "all", label: "Tutti", icon: <Layers size={16} />, count: counts.all },
    { key: "Playing", label: "In corso", icon: <PlayCircle size={16} />, count: counts.Playing },
    { key: "Completed", label: "Completati", icon: <CheckCircle size={16} />, count: counts.Completed },
    { key: "Backlog", label: "Da iniziare", icon: <Clock size={16} />, count: counts.Backlog },
    { key: "Dropped", label: "Abbandonati", icon: <XCircle size={16} />, count: counts.Dropped },
  ];

  return (
    <div className="lx-profile-content">
      <header className="lx-profile-content-header">
        <h2 className="lx-profile-content-title">
          Libreria
          <span className="lx-profile-content-count">({counts.all})</span>
        </h2>

        {/* Mobile Nav (desktop usa la sidebar destra) */}
        <div className="lx-profile-mobile-nav">
          {mobileNavItems.map((item) => (
            <button
              key={item.key}
              type="button"
              className={`lx-profile-mobile-tab ${activeTab === item.key ? "lx-profile-mobile-tab--active" : ""}`}
              onClick={() => onTabChange?.(item.key)}
            >
              {item.icon}
              <span>{item.label}</span>
              <span className="lx-profile-mobile-tab-count">{item.count}</span>
            </button>
          ))}
        </div>
      </header>

      {pagedGames.length === 0 ? (
        <div className="lx-profile-empty">
          <Gamepad2 size={48} className="lx-profile-empty-icon" />
          <p className="lx-profile-empty-text">Nessun gioco trovato con questi filtri.</p>
        </div>
      ) : (
        <>
          <div className="lx-profile-games-grid">
            {pagedGames.map((g, idx) => (
              <ProfileGameCard
                key={g.userGameId ?? g.gameId}
                game={g}
                isMe={isMe}
                onEdit={setEditingGame}
                onDelete={onDelete}
                style={{ animationDelay: `${idx * 0.03}s` }}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="lx-profile-pagination">
              <button type="button" className="lx-profile-page-btn" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                «
              </button>

              {Array.from({ length: totalPages }).map((_, idx) => {
                const p = idx + 1;
                return (
                  <button key={p} type="button" className={`lx-profile-page-btn ${p === page ? "lx-profile-page-btn--active" : ""}`} onClick={() => setPage(p)}>
                    {p}
                  </button>
                );
              })}

              <button type="button" className="lx-profile-page-btn" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                »
              </button>
            </div>
          )}
        </>
      )}

      {editingGame && <ProfileGameEditOverlay game={editingGame} isMe={isMe} onUpdate={onUpdate} onDelete={onDelete} onClose={() => setEditingGame(null)} />}
    </div>
  );
};

export default ProfileContentArea;
