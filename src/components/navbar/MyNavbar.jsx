import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import LogoLudexPng from "../../assets/LogoLudex3Ridimensionato.png";
import avatar from "../../assets/avatar.png";
import avatarAdmin from "../../assets/avatarAdmin.png";
import { useDispatch, useSelector } from "react-redux";
import { logoutAction } from "../../redux/action";
import { apiFetch } from "../../apiFetch Autenticate/apiFetch";
import { safeJson } from "../../apiFetch Autenticate/safeJson.js";
import NavSearch from "./NavSearch";
import { loadLibraryPage } from "../../redux/action";
import { useHideOnScroll } from "../../hooks/useHideOnScroll";
import { useToast } from "../ui/ToastProvider"; // 👈 toast globale

const MyNavbar = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [health, setHealth] = useState("loading");

  const location = useLocation();
  const isHome = location.pathname === "/home";

  // hook custom per far sparire la navbar in scroll down e riapparire in scroll up
  const rawHidden = useHideOnScroll();
  // se il menu mobile è aperto, forzo nav visibile
  const navHidden = isOpen ? false : rawHidden;

  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const library = useSelector((state) => state.libraryGames);
  const navigate = useNavigate();

  const { addToast } = useToast();

  // Ogni volta che cambio route:
  // - chiudo il menu mobile
  // - chiudo il dropdown utente
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsOpen(false);
    setShowUserMenu(false);
  }, [location.pathname]);

  // ===== Health check DB (solo per ADMIN) =====
  useEffect(() => {
    let cancelled = false;

    const fetchHealth = async () => {
      // se non sono admin, non chiedo niente
      if (user?.role !== "Admin") return;

      setHealth("loading");

      try {
        const res = await apiFetch("/api/Health");

        // se il backend risponde 401, ci pensa apiFetch (refresh/logout), qui non faccio altro
        if (res.status === 401) {
          return;
        }

        const data = await safeJson(res);

        const ok = data?.status === "Healthy" && data?.database === "OK";
        if (!cancelled) setHealth(ok ? "ok" : "down");
      } catch (err) {
        if (!cancelled) setHealth("down");
        console.log(err);
      }
    };

    // prima chiamata alla mount
    fetchHealth();

    // richiama ogni 60s se la tab è visibile
    const id = setInterval(() => {
      if (document.visibilityState === "visible") fetchHealth();
    }, 60000);

    return () => {
      cancelled = true;
      if (id) clearInterval(id);
    };
  }, [user?.role]);

  const navigateToAuth = () => {
    navigate("/auth", { replace: true });
  };

  const handleLibraryClick = () => {
    // piccolo "lazy load": se non ho ancora i giochi in store per la library, chiamo la pagina 1
    if (!library?.items || library.items.length === 0) {
      dispatch(loadLibraryPage(1));
    }
  };

  // ===== Toast per logout forzato (sessione scaduta / reset password) =====
  useEffect(() => {
    // Se l'utente risulta autenticato, non mostro alcun messaggio di logout.
    if (isAuthenticated) return;

    // Se NON è autenticato, controllo se apiFetch ha lasciato il "motivo" in localStorage.
    try {
      const reason = localStorage.getItem("lx_logout_reason");
      if (reason) {
        // Mostro il toast una sola volta
        addToast(reason, "warning");
        localStorage.removeItem("lx_logout_reason");

        // Nota: NON faccio navigate("/auth").
        // La scelta di andare alla pagina di login la lascio all'utente.
      }
    } catch {
      // se localStorage non è accessibile non succede niente
    }
  }, [isAuthenticated, addToast]);

  return (
    <nav className={`navbar navbar-expand-lg navbar-dark lx-navbar ${navHidden ? "lx-nav-hidden" : "lx-nav-shown"} ${isHome ? "lx-nav-home" : "lx-nav-wide"}`}>
      <div className="container-fluid">
        {/* LOGO */}
        <Link className="navbar-brand d-flex align-items-center" to="/home">
          <img src={LogoLudexPng} style={{ width: "90px", height: "40px", objectFit: "contain" }} alt="Ludex logo" />
        </Link>

        {/* BADGE ADMIN + HEALTH DB */}
        {user?.role === "Admin" && <span className="lx-badge-admin ms-2">ADMIN</span>}

        {user?.role === "Admin" && (
          <span className={`lx-health ms-2 ${health} me-2`}>
            <span className="lx-health-dot" />
            DB
          </span>
        )}

        {/* BURGER MENU (mobile) */}
        <button className="navbar-toggler border-0" type="button" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* CONTENUTO COLLAPSABILE */}
        <div className={`collapse navbar-collapse ${isOpen ? "bg-dark text-center p-3 show" : ""}`}>
          <div className="w-100 d-flex flex-column flex-lg-row align-items-lg-center gap-2">
            {/* SEARCH CENTRALE */}
            <div className="flex-grow-1 d-flex justify-content-center justify-content-lg-center mb-2 mb-lg-0">
              <NavSearch />
            </div>

            {/* NAVLINK + UTENTE A DESTRA */}
            <div className="d-flex flex-column flex-lg-row align-items-lg-center justify-content-lg-end ms-lg-3 gap-2">
              <ul className="navbar-nav mb-2 mb-lg-0 justify-content-center justify-content-lg-end">
                <li className="nav-item">
                  <Link className="nav-link" to="/home">
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/library" onClick={handleLibraryClick}>
                    Library
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/reviews">
                    Reviews
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/community">
                    Community
                  </Link>
                </li>
              </ul>

              {/* AREA UTENTE / LOGIN */}
              {isAuthenticated ? (
                <div className="dropdown lx-user-dropdown ms-lg-3 text-center text-lg-start">
                  <button className="btn p-0 border-0 bg-transparent" onClick={() => setShowUserMenu(!showUserMenu)} aria-label="User menu">
                    <img src={user.role === "Admin" ? avatarAdmin : avatar} alt={user?.username ?? "avatar"} className="lx-avatar-sm" />
                  </button>
                  {showUserMenu && (
                    <div className="dropdown-menu dropdown-menu-end show lx-glass mt-2">
                      <Link className="dropdown-item" to="/profile">
                        <i className="bi bi-person me-2"></i>Profile
                      </Link>
                      <Link className="dropdown-item" to="/settings">
                        <i className="bi bi-gear me-2"></i>Settings
                      </Link>
                      {user?.role === "Admin" && (
                        <>
                          <Link to="/admin/games" className="dropdown-item">
                            <i className="bi bi-controller me-2" />
                            Gestisci giochi
                          </Link>

                          <Link to="/admin/games/new" className="dropdown-item">
                            <i className="bi bi-plus-circle me-2" />
                            Nuovo gioco
                          </Link>
                        </>
                      )}
                      <hr className="dropdown-divider" />
                      <button className="dropdown-item text-danger" onClick={() => dispatch(logoutAction())}>
                        <i className="bi bi-box-arrow-right me-2"></i>Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button type="button" onClick={navigateToAuth} className="btn lx-btn-nav ms-lg-3">
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default MyNavbar;
