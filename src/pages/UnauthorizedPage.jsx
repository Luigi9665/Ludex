import { Link } from "react-router";

const UnauthorizedPage = () => {
  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "70vh" }}>
      <div className="lx-glass p-5 text-center lx-unauth-card">
        <div className="lx-unauth-icon mb-3">
          <i className="bi bi-shield-lock"></i>
        </div>

        <h1 className="lx-hero-title mb-2">Accesso negato</h1>

        <p className="lx-text-secondary mb-4">Questa sezione è riservata a livelli di accesso superiori.</p>

        <div className="d-flex justify-content-center gap-3">
          <Link to="/home" className="btn lx-btn-primary">
            Torna alla Home
          </Link>
          <Link to="/profile" className="btn lx-btn-outline">
            Il mio profilo
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
