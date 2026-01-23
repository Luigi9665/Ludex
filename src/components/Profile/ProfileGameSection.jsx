import { useEffect, useMemo, useState } from "react";
import { Gamepad2 } from "lucide-react";
import ProfileGameCard from "./ProfileGameCard";
import { STATUS_CONFIG, STATUS_ORDER } from "../../config/profileStatusConfig";

const ProfileGameSection = ({ games, isMe, onUpdate, onDelete }) => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);

  const PAGE_SIZE = 12; // quanti giochi per pagina nel profilo

  // filtro completo (tab + search)
  const filteredGames = useMemo(() => {
    let result = games;

    if (activeTab !== "all") {
      result = result.filter((g) => g.status === activeTab);
    }

    if (searchText.trim().length >= 2) {
      const q = searchText.trim().toLowerCase();
      result = result.filter((g) => g.title.toLowerCase().includes(q));
    }

    return result;
  }, [games, activeTab, searchText]);

  const totalPages = Math.max(1, Math.ceil(filteredGames.length / PAGE_SIZE));

  // reset pagina quando cambio tab o search
  useEffect(() => {
    setPage(1);
  }, [activeTab, searchText]);

  const pagedGames = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredGames.slice(start, start + PAGE_SIZE);
  }, [filteredGames, page]);

  const handleChangePage = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
  };

  return (
    <div className="lx-profile-games-card lx-glow-card">
      <div className="lx-profile-games-header">
        <div>
          <h2 className="lx-section-title mb-1">
            Libreria
            <span className="lx-profile-total-count ms-2">({games.length} giochi)</span>
          </h2>
          <p className="lx-profile-games-subtitle mb-0">Filtra per stato o cerca un titolo specifico.</p>
        </div>

        <div className="lx-profile-header-right">
          <div className="lx-profile-tab-bar">
            <button type="button" className={`lx-profile-tab ${activeTab === "all" ? "lx-profile-tab--active" : ""}`} onClick={() => setActiveTab("all")}>
              Tutti <span className="lx-profile-tab-count">{games.length}</span>
            </button>

            {STATUS_ORDER.map((statusKey) => {
              const count = games.filter((g) => g.status === statusKey).length;
              if (!count) return null;
              const cfg = STATUS_CONFIG[statusKey];

              return (
                <button
                  key={statusKey}
                  type="button"
                  className={`lx-profile-tab ${activeTab === statusKey ? "lx-profile-tab--active" : ""}`}
                  onClick={() => setActiveTab(statusKey)}
                >
                  {cfg.icon} {cfg.label}
                  <span className="lx-profile-tab-count">{count}</span>
                </button>
              );
            })}
          </div>

          <div className="lx-profile-search-wrapper">
            <input
              type="text"
              className="form-control form-control-sm lx-profile-search-input"
              placeholder="Cerca per titolo..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
        </div>
      </div>

      {pagedGames.length === 0 ? (
        <div className="lx-profile-empty">
          <Gamepad2 size={40} className="mb-2" />
          <p className="mb-0">Nessun gioco trovato con questi filtri.</p>
        </div>
      ) : (
        <>
          <div className="lx-profile-games-grid">
            {pagedGames.map((g) => (
              <ProfileGameCard key={g.userGameId ?? g.gameId} game={g} isMe={isMe} onUpdate={onUpdate} onDelete={onDelete} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="lx-profile-pagination">
              <button type="button" className="lx-profile-page-btn" onClick={() => handleChangePage(page - 1)} disabled={page === 1}>
                «
              </button>

              {Array.from({ length: totalPages }).map((_, idx) => {
                const p = idx + 1;
                return (
                  <button
                    key={p}
                    type="button"
                    className={`lx-profile-page-btn ${p === page ? "lx-profile-page-btn--active" : ""}`}
                    onClick={() => handleChangePage(p)}
                  >
                    {p}
                  </button>
                );
              })}

              <button type="button" className="lx-profile-page-btn" onClick={() => handleChangePage(page + 1)} disabled={page === totalPages}>
                »
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProfileGameSection;
