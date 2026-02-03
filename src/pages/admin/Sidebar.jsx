import { Link, NavLink, useLocation } from "react-router";
import LogoLudexPng from "../../assets/LogoLudex3Ridimensionato.png";

/**
 * Navigation sidebar con link alle sezioni admin.
 * Supporta collapse su mobile.
 */
export default function Sidebar({ isOpen, onToggle }) {
  const location = useLocation();

  const navItems = [
    {
      to: "/admin",
      label: "Analytics Questionario",
      icon: "bi-graph-up",
      exact: true,
    },
    {
      to: "/admin/games",
      label: "Gestione Giochi",
      icon: "bi-controller",
      matchPrefix: "/admin/games",
    },
    {
      to: "/admin/genres",
      label: "Gestione Generi",
      icon: "bi-collection",
      matchPrefix: "/admin/genres",
    },
    {
      to: "/admin/tags",
      label: "Gestione Tag",
      icon: "bi-tags",
      matchPrefix: "/admin/tags",
    },
    {
      to: "/admin/metadata",
      label: "Gestione Metadata",
      icon: "bi-sliders",
      matchPrefix: "/admin/metadata",
    },
    {
      to: "/admin/questions",
      label: "Gestione Domande",
      icon: "bi-question-circle",
      matchPrefix: "/admin/questions",
    },
  ];

  const handleClick = () => {
    // chiudi la sidebar su mobile dopo il click
    if (window.innerWidth < 992) {
      onToggle();
    }
  };

  return (
    <>
      {/* backdrop mobile */}
      {isOpen && <div className="lx-sidebar-backdrop d-lg-none" onClick={onToggle} />}

      {/* sidebar */}
      <aside className={`lx-admin-sidebar ${isOpen ? "open" : ""}`}>
        <div className="lx-sidebar-header">
          <div className="lx-sidebar-brand">
            {/* LOGO */}
            <Link className="navbar-brand d-flex align-items-center" to="/home">
              <img src={LogoLudexPng} style={{ width: "180px", height: "50px", objectFit: "contain" }} alt="Ludex logo" />
            </Link>
          </div>
          <button className="lx-sidebar-close d-lg-none" onClick={onToggle} aria-label="Chiudi menu">
            <i className="bi bi-x-lg" />
          </button>
        </div>

        <nav className="lx-sidebar-nav">
          {navItems.map((item) => {
            // gestione "active" anche per sottopercorsi (es. /admin/games/123/edit)
            const isPrefixMatch = item.matchPrefix && location.pathname.startsWith(item.matchPrefix);
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.exact}
                className={({ isActive }) => "lx-nav-item " + (isActive || isPrefixMatch ? "active" : "")}
                onClick={handleClick}
              >
                <i className={`bi ${item.icon}`} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="lx-sidebar-footer">
          <div className="lx-sidebar-user">
            <div className="lx-user-avatar">
              <i className="bi bi-person-circle" />
            </div>
            <div className="lx-user-info">
              <div className="lx-user-name">Admin</div>
              <div className="lx-user-role">Sistema</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
