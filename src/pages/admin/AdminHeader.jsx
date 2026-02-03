import { useLocation } from "react-router";

/**
 * Top header bar con titolo pagina, search e filtri.
 * Il titolo viene derivato dalla rotta corrente (/admin, /admin/games, ecc.)
 */
export default function AdminHeader({ onToggleSidebar }) {
  const { pathname } = useLocation();

  // Mappa path -> "section key" logica
  let sectionKey = "analytics";

  if (pathname.startsWith("/admin/games")) {
    sectionKey = "games";
  } else if (pathname.startsWith("/admin/genres")) {
    sectionKey = "genres";
  } else if (pathname.startsWith("/admin/tags")) {
    sectionKey = "tags";
  } else if (pathname.startsWith("/admin/metadata")) {
    sectionKey = "metadata";
  } else if (pathname === "/admin" || pathname === "/admin/") {
    sectionKey = "analytics";
  }

  const sectionTitles = {
    analytics: "Analitica Questionario",
    games: "Gestione Giochi",
    genres: "Gestione Generi",
    tags: "Gestione Tag",
    metadata: "Gestione Metadata",
  };

  const sectionSubtitles = {
    analytics: "Analisi dettagliata delle risposte e degli impatti",
    games: "Catalogo e gestione dei giochi",
    genres: "Configurazione e analisi dei generi di gioco",
    tags: "Configurazione e analisi dei tag",
    metadata: "Configurazione dei metadata del questionario",
  };

  const title = sectionTitles[sectionKey] || "Area Admin";
  const subtitle = sectionSubtitles[sectionKey] || "Sezione di amministrazione";

  return (
    <header className="lx-admin-header">
      <div className="lx-header-left">
        <button className="lx-sidebar-toggle d-lg-none" onClick={onToggleSidebar} aria-label="Apri menu">
          <i className="bi bi-list" />
        </button>

        <div className="lx-header-title-group">
          <h1 className="lx-header-title">{title}</h1>
          <p className="lx-header-subtitle">{subtitle}</p>
        </div>
      </div>

      <div className="lx-header-right">
        <div className="lx-header-search">
          <i className="bi bi-search" />
          <input type="text" placeholder="Cerca..." className="lx-search-input" />
        </div>

        <div className="lx-header-filter">
          <select className="lx-filter-select">
            <option>Tutto il periodo</option>
            <option>Ultimi 7 giorni</option>
            <option>Ultimi 30 giorni</option>
            <option>Ultimi 90 giorni</option>
            <option>Quest'anno</option>
          </select>
        </div>

        <button className="lx-btn-icon" aria-label="Notifiche">
          <i className="bi bi-bell" />
          <span className="lx-notification-badge">3</span>
        </button>
      </div>
    </header>
  );
}
