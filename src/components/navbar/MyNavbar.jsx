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
import { useToast } from "../ui/ToastProvider";
import "../../styles/MyNavbarStyle.css";

const MyNavbar = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [health, setHealth] = useState("loading");
  const [scrolled, setScrolled] = useState(false);

  const location = useLocation();
  const isHome = location.pathname === "/home";

  const rawHidden = useHideOnScroll();
  const navHidden = isOpen ? false : rawHidden;

  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const library = useSelector((state) => state.libraryGames);
  const navigate = useNavigate();

  const { addToast } = useToast();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsOpen(false);
    setShowUserMenu(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const fetchHealth = async () => {
      if (user?.role !== "Admin") return;

      setHealth("loading");

      try {
        const res = await apiFetch("/api/Health");

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

    fetchHealth();

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
    if (!library?.items || library.items.length === 0) {
      dispatch(loadLibraryPage(1));
    }
  };

  useEffect(() => {
    if (isAuthenticated) return;

    try {
      const reason = localStorage.getItem("lx_logout_reason");
      if (reason) {
        addToast(reason, "warning");
        localStorage.removeItem("lx_logout_reason");
      }
    } catch {
      // ignore
    }
  }, [isAuthenticated, addToast]);

  return (
    <nav className={`lx-navbar ${navHidden ? "lx-navbar--hidden" : ""} ${scrolled ? "lx-navbar--scrolled" : ""} ${isHome ? "lx-navbar--home" : ""}`}>
      <div className={`lx-navbar-inner ${isHome ? "lx-navbar-inner--home" : "lx-navbar-inner--wide"}`}>
        <div className="lx-navbar-left">
          <Link className="lx-navbar-brand" to="/home">
            <img src={LogoLudexPng} className="lx-navbar-logo" alt="Ludex" />
          </Link>

          {user?.role === "Admin" && (
            <div className="lx-navbar-admin-badges">
              <span className="lx-navbar-pill lx-navbar-pill--admin">ADMIN</span>
              <span className={`lx-navbar-pill lx-navbar-pill--health lx-navbar-pill--health-${health}`}>
                <span className="lx-navbar-health-dot" />
                DB
              </span>
            </div>
          )}
        </div>

        <div className="lx-navbar-center">
          <NavSearch />
        </div>

        <div className="lx-navbar-right">
          <ul className="lx-navbar-links">
            <li>
              <Link to="/home" className={`lx-navbar-link ${location.pathname === "/home" ? "lx-navbar-link--active" : ""}`}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/library" onClick={handleLibraryClick} className={`lx-navbar-link ${location.pathname === "/library" ? "lx-navbar-link--active" : ""}`}>
                Library
              </Link>
            </li>
            <li>
              <Link to="/reviews" className={`lx-navbar-link ${location.pathname === "/reviews" ? "lx-navbar-link--active" : ""}`}>
                Reviews
              </Link>
            </li>
            <li>
              <Link to="/community" className={`lx-navbar-link ${location.pathname === "/community" ? "lx-navbar-link--active" : ""}`}>
                Community
              </Link>
            </li>
          </ul>

          {isAuthenticated ? (
            <div className="lx-navbar-user">
              <button className="lx-navbar-avatar-btn" onClick={() => setShowUserMenu(!showUserMenu)} aria-label="User menu">
                <img src={user.role === "Admin" ? avatarAdmin : avatar} alt={user?.username ?? "avatar"} className="lx-navbar-avatar" />
              </button>
              {showUserMenu && (
                <div className="lx-navbar-dropdown">
                  <Link className="lx-navbar-dropdown-item" to="/profile">
                    <i className="bi bi-person" />
                    Profile
                  </Link>
                  <Link className="lx-navbar-dropdown-item" to="/settings">
                    <i className="bi bi-gear" />
                    Settings
                  </Link>
                  {user?.role === "Admin" && (
                    <>
                      <Link to="/admin" className="lx-navbar-dropdown-item">
                        <i className="bi bi-speedometer2" />
                        Dashboard admin
                      </Link>
                      <Link to="/admin/games/new" className="lx-navbar-dropdown-item">
                        <i className="bi bi-plus-circle" />
                        Nuovo gioco
                      </Link>
                    </>
                  )}
                  <div className="lx-navbar-dropdown-divider" />
                  <button className="lx-navbar-dropdown-item lx-navbar-dropdown-item--danger" onClick={() => dispatch(logoutAction())}>
                    <i className="bi bi-box-arrow-right" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button type="button" onClick={navigateToAuth} className="lx-navbar-cta">
              Login
            </button>
          )}
        </div>

        <button className="lx-navbar-toggle" type="button" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle navigation">
          <span className={`lx-navbar-toggle-icon ${isOpen ? "lx-navbar-toggle-icon--open" : ""}`}>
            <span />
            <span />
            <span />
          </span>
        </button>
      </div>

      <div className={`lx-navbar-mobile ${isOpen ? "lx-navbar-mobile--open" : ""}`}>
        <div className="lx-navbar-mobile-overlay" onClick={() => setIsOpen(false)} />
        <div className="lx-navbar-mobile-panel">
          <div className="lx-navbar-mobile-header">
            <img src={LogoLudexPng} className="lx-navbar-mobile-logo" alt="Ludex" />
            <button className="lx-navbar-mobile-close" onClick={() => setIsOpen(false)} aria-label="Close menu">
              <i className="bi bi-x-lg" />
            </button>
          </div>

          <div className="lx-navbar-mobile-search">
            <NavSearch />
          </div>

          <nav className="lx-navbar-mobile-nav">
            <Link to="/home" className={`lx-navbar-mobile-link ${location.pathname === "/home" ? "lx-navbar-mobile-link--active" : ""}`}>
              <i className="bi bi-house-door" />
              Home
            </Link>
            <Link
              to="/library"
              onClick={handleLibraryClick}
              className={`lx-navbar-mobile-link ${location.pathname === "/library" ? "lx-navbar-mobile-link--active" : ""}`}
            >
              <i className="bi bi-collection" />
              Library
            </Link>
            <Link to="/reviews" className={`lx-navbar-mobile-link ${location.pathname === "/reviews" ? "lx-navbar-mobile-link--active" : ""}`}>
              <i className="bi bi-star" />
              Reviews
            </Link>
            <Link to="/community" className={`lx-navbar-mobile-link ${location.pathname === "/community" ? "lx-navbar-mobile-link--active" : ""}`}>
              <i className="bi bi-people" />
              Community
            </Link>
          </nav>

          {isAuthenticated ? (
            <div className="lx-navbar-mobile-user">
              <div className="lx-navbar-mobile-profile">
                <img src={user.role === "Admin" ? avatarAdmin : avatar} alt={user?.username ?? "avatar"} className="lx-navbar-mobile-avatar" />
                <div className="lx-navbar-mobile-username">
                  {user?.username ?? "User"}
                  {user?.role === "Admin" && <span className="lx-navbar-mobile-badge">ADMIN</span>}
                </div>
              </div>
              <div className="lx-navbar-mobile-divider" />
              <Link className="lx-navbar-mobile-link" to="/profile">
                <i className="bi bi-person" />
                Profile
              </Link>
              <Link className="lx-navbar-mobile-link" to="/settings">
                <i className="bi bi-gear" />
                Settings
              </Link>
              {user?.role === "Admin" && (
                <>
                  <Link to="/admin" className="lx-navbar-mobile-link">
                    <i className="bi bi-speedometer2" />
                    Dashboard admin
                  </Link>
                  <Link to="/admin/games/new" className="lx-navbar-mobile-link">
                    <i className="bi bi-plus-circle" />
                    Nuovo gioco
                  </Link>
                </>
              )}
              <div className="lx-navbar-mobile-divider" />
              <button className="lx-navbar-mobile-link lx-navbar-mobile-link--danger" onClick={() => dispatch(logoutAction())}>
                <i className="bi bi-box-arrow-right" />
                Logout
              </button>
            </div>
          ) : (
            <div className="lx-navbar-mobile-footer">
              <button type="button" onClick={navigateToAuth} className="lx-navbar-mobile-cta">
                Login
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default MyNavbar;
