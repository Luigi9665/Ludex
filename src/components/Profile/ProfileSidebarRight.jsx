import { useState } from "react";
import { Layers, PlayCircle, CheckCircle, Clock, XCircle, Search } from "lucide-react";
import SearchPopup from "./SearchPopup";

const ProfileSidebarRight = ({ games, activeTab, onTabChange, searchText, onSearchChange }) => {
  const [showSearch, setShowSearch] = useState(false);

  const counts = {
    all: games.length,
    Playing: games.filter((g) => g.status === "Playing").length,
    Completed: games.filter((g) => g.status === "Completed").length,
    Backlog: games.filter((g) => g.status === "Backlog").length,
    Dropped: games.filter((g) => g.status === "Dropped").length,
  };

  const navItems = [
    { key: "all", label: "Tutti", icon: <Layers size={20} />, count: counts.all },
    { key: "Playing", label: "In corso", icon: <PlayCircle size={20} />, count: counts.Playing },
    { key: "Completed", label: "Completati", icon: <CheckCircle size={20} />, count: counts.Completed },
    { key: "Backlog", label: "Da iniziare", icon: <Clock size={20} />, count: counts.Backlog },
    { key: "Dropped", label: "Abbandonati", icon: <XCircle size={20} />, count: counts.Dropped },
  ];

  return (
    <>
      <aside className="lx-profile-sidebar">
        <nav className="lx-profile-nav-dock">
          {navItems.map((item) => (
            <button
              key={item.key}
              type="button"
              className={`lx-profile-nav-item ${activeTab === item.key ? "lx-profile-nav-item--active" : ""}`}
              onClick={() => onTabChange?.(item.key)}
            >
              <span className="lx-profile-nav-icon">{item.icon}</span>
              <span className="lx-profile-nav-label">{item.label}</span>
              <span className="lx-profile-nav-count">{item.count}</span>
            </button>
          ))}

          <button type="button" className="lx-profile-search-trigger" onClick={() => setShowSearch(true)}>
            <Search size={18} />
            <span>Cerca gioco</span>
          </button>
        </nav>
      </aside>

      <SearchPopup open={showSearch} value={searchText} onChange={onSearchChange} onClose={() => setShowSearch(false)} />
    </>
  );
};

export default ProfileSidebarRight;
