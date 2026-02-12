import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import LogoLudexPng from "../assets/LogoLudex3Ridimensionato.png";

const ResetPasswordPage = () => {
  const [token, setToken] = useState("");
  const [isTokenChecked, setIsTokenChecked] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [errorField, setErrorField] = useState("");

  const location = useLocation();
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenFromUrl = params.get("token");

    if (tokenFromUrl) {
      // URLSearchParams fa già la decode, quindi qui hai il rawToken
      setToken(tokenFromUrl);
    } else {
      setErrorMessage("Link non valido. Token mancante.");
    }

    setIsTokenChecked(true);
  }, [location]);

  const safeJson = async (res) => {
    try {
      return await res.json();
    } catch {
      return null;
    }
  };

  const hasMinLength = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasLowercase = /[a-z]/.test(newPassword);
  const passwordsMatch = newPassword === confirmPassword;
  const isPasswordValid = hasMinLength && hasUppercase && hasLowercase && passwordsMatch;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Guard in più: se per qualche motivo arriviamo qui senza token, blocca tutto
    if (!token) {
      setErrorField("token");
      setErrorMessage("Link di reset non valido o scaduto.");
      return;
    }

    if (!isPasswordValid) {
      setErrorMessage("La password non rispetta i requisiti minimi.");
      setErrorField("password");
      return;
    }

    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");
    setErrorField("");

    try {
      const response = await fetch(`${baseUrl}/api/Auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await safeJson(response);

      if (!response.ok) {
        // Backend: { field, message } per CheckException
        throw data || { message: "Errore durante il reset della password" };
      }

      setSuccessMessage(data?.message || "Password aggiornata con successo!");
      // piccolo delay per far leggere il messaggio
      setTimeout(() => navigate("/auth"), 2000);
    } catch (err) {
      const field = err?.field || "";
      const message = err?.message || "Errore durante il reset. Riprova.";
      setErrorField(field);
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  // Schermata "link non valido": la mostriamo solo dopo aver controllato il token
  if (!token && isTokenChecked && !loading && !successMessage) {
    return (
      <div className="lx-auth-page">
        <div className="lx-auth-simple-container">
          <div className="lx-auth-simple-card">
            <div className="lx-auth-logo">
              <img src={LogoLudexPng} alt="Ludex" className="lx-auth-logo-img" />
            </div>
            <h1 className="lx-auth-title">Link non valido</h1>
            <p className="lx-auth-subtitle">Il link di reset password è mancante, non valido o scaduto.</p>
            <div className="lx-auth-footer-link">
              <Link to="/forgot-password" className="lx-auth-link-soft">
                Richiedi un nuovo link
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="lx-auth-page">
      <div className="lx-auth-simple-container">
        <div className="lx-auth-simple-card">
          <div className="lx-auth-logo">
            <img src={LogoLudexPng} alt="Ludex" className="lx-auth-logo-img" />
          </div>

          <h1 className="lx-auth-title">Reimposta la password</h1>
          <p className="lx-auth-subtitle">Inserisci una nuova password sicura per il tuo account.</p>

          <form onSubmit={handleSubmit} className="lx-auth-form">
            <div className="lx-auth-field">
              <label className="lx-auth-label">Nuova password</label>
              <input
                className={`lx-auth-input ${errorField === "password" ? "lx-auth-input--error" : ""}`}
                type="password"
                placeholder="Crea una password sicura"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />

              <ul className="lx-auth-pwd-checks">
                <li className={hasMinLength ? "valid" : "invalid"}>
                  <i className={`bi ${hasMinLength ? "bi-check-circle-fill" : "bi-x-circle"}`} />
                  Minimo 8 caratteri
                </li>
                <li className={hasUppercase ? "valid" : "invalid"}>
                  <i className={`bi ${hasUppercase ? "bi-check-circle-fill" : "bi-x-circle"}`} />
                  Almeno una maiuscola
                </li>
                <li className={hasLowercase ? "valid" : "invalid"}>
                  <i className={`bi ${hasLowercase ? "bi-check-circle-fill" : "bi-x-circle"}`} />
                  Almeno una minuscola
                </li>
              </ul>
            </div>

            <div className="lx-auth-field">
              <label className="lx-auth-label">Conferma password</label>
              <input
                className="lx-auth-input"
                type="password"
                placeholder="Ripeti la password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              {confirmPassword && !passwordsMatch && (
                <div className="lx-auth-hint lx-auth-hint--error">
                  <i className="bi bi-x-circle" /> Le password non coincidono
                </div>
              )}
            </div>

            {errorMessage && (
              <div className="lx-auth-error lx-auth-error--global">
                <i className="bi bi-exclamation-circle" /> {errorMessage}
                {errorField === "token" && (
                  <div style={{ marginTop: "0.5rem" }}>
                    <Link to="/forgot-password" className="lx-auth-link-soft">
                      Richiedi un nuovo link di reset
                    </Link>
                  </div>
                )}
              </div>
            )}

            {successMessage && (
              <div className="lx-auth-success">
                <i className="bi bi-check-circle" /> {successMessage}
              </div>
            )}

            <button className="lx-auth-btn lx-auth-btn--primary" type="submit" disabled={!isPasswordValid || loading}>
              {loading ? (
                <>
                  <span className="lx-auth-spinner" />
                  <span>Aggiornamento...</span>
                </>
              ) : (
                "Imposta nuova password"
              )}
            </button>
          </form>

          {successMessage && (
            <div className="lx-auth-footer-link">
              <Link to="/auth" className="lx-auth-btn lx-auth-btn--secondary">
                Vai al login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
