import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import LogoLudexPng from "../assets/LogoLudex3Ridimensionato.png";

const safeJson = async (res) => {
  try {
    return await res.json();
  } catch {
    return null;
  }
};

const ConfirmEmailPage = () => {
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [errorField, setErrorField] = useState("");

  const location = useLocation();
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const confirmEmail = async () => {
      const params = new URLSearchParams(location.search);
      const userId = params.get("userId");
      const token = params.get("token");

      if (!userId || !token) {
        setErrorMessage("Link non valido. Parametri mancanti.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${baseUrl}/api/Auth/confirm-email`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, token }),
        });

        const data = await safeJson(response);

        if (!response.ok) {
          // il backend restituisce { field, message } nelle CheckException
          throw data || { message: "Errore durante la conferma email" };
        }

        setSuccessMessage(data?.message || "Email confermata con successo! Ora puoi effettuare il login.");
      } catch (err) {
        const field = err?.field || "";
        const message = err?.message || "Errore durante la conferma. Riprova.";
        setErrorField(field);
        setErrorMessage(message);
      } finally {
        setLoading(false);
      }
    };

    confirmEmail();
  }, [location, baseUrl]);

  return (
    <div className="lx-auth-page">
      <div className="lx-auth-simple-container">
        <div className="lx-auth-simple-card">
          <div className="lx-auth-logo">
            <img src={LogoLudexPng} alt="Ludex" className="lx-auth-logo-img" />
          </div>

          {loading ? (
            <>
              <h1 className="lx-auth-title">Conferma email in corso...</h1>
              <div className="lx-auth-loading">
                <span className="lx-auth-spinner-lg" />
                <p>Stiamo confermando la tua email, attendere...</p>
              </div>
            </>
          ) : successMessage ? (
            <>
              <div className="lx-auth-success-hero">
                <i className="bi bi-check-circle-fill" />
              </div>
              <h1 className="lx-auth-title">Email confermata!</h1>
              <p className="lx-auth-subtitle">{successMessage}</p>
              <div className="lx-auth-footer-link">
                <Link to="/auth" className="lx-auth-btn lx-auth-btn--primary">
                  Vai al login
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="lx-auth-error-hero">
                <i className="bi bi-x-circle-fill" />
              </div>
              <h1 className="lx-auth-title">Errore nella conferma</h1>
              <p className="lx-auth-subtitle">{errorMessage}</p>

              {errorField === "token" && (
                <div className="lx-auth-hint lx-auth-hint--error">Il token potrebbe essere scaduto o non valido. Richiedi un nuovo link di conferma.</div>
              )}

              <div className="lx-auth-footer-link">
                <Link to="/auth" className="lx-auth-link-soft">
                  Torna al login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfirmEmailPage;
