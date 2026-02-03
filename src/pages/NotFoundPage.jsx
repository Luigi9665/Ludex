import { Link } from "react-router";

const NotFoundPage = () => {
  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "70vh" }}>
      <div className="lx-glass p-5 text-center lx-notfound-card">
        <div className="lx-notfound-code">404</div>

        <h1 className="lx-hero-title mb-2">Area inesplorata</h1>

        <p className="lx-text-secondary mb-4">La pagina che stai cercando non esiste o è stata rimossa dal mondo di Ludex.</p>

        <div className="d-flex justify-content-center gap-3">
          <Link to="/home" className="btn lx-btn-primary">
            Rientra nella Home
          </Link>
          <Link to="/library" className="btn lx-btn-outline d-flex align-items-center">
            Vai alla Libreria
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
