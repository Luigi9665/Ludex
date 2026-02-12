import { useState } from "react";
import { Link } from "react-router";
import LogoLudexPng from "../assets/LogoLudex3Ridimensionato.png";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const safeJson = async (res) => {
    try {
      return await res.json();
    } catch {
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedEmail = email.trim();
    if (!trimmedEmail) return;

    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await fetch(`${baseUrl}/api/Auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail }),
      });

      const data = await safeJson(response);

      if (!response.ok) {
        // Il controller può restituire oggetti diversi (ModelState, ecc.),
        // quindi cerco di ricavare un messaggio sensato.
        const serverMessage = data?.message || data?.error || (typeof data === "string" ? data : null);

        throw new Error(serverMessage || "Errore durante l'invio del link di reset");
      }

      setSuccessMessage(data?.message || "Se esiste un account associato a questa email, ti abbiamo inviato le istruzioni per il reset.");
      setEmail("");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Errore di rete. Riprova più tardi.");
    } finally {
      setLoading(false);
    }
  };

  const isEmailEmpty = email.trim().length === 0;

  return (
    <div className="lx-auth-page">
      <div className="lx-auth-simple-container">
        <div className="lx-auth-simple-card">
          <div className="lx-auth-logo">
            <img src={LogoLudexPng} alt="Ludex" className="lx-auth-logo-img" />
          </div>

          <h1 className="lx-auth-title">Password dimenticata?</h1>
          <p className="lx-auth-subtitle">Inserisci la tua email. Se esiste un account associato, ti invieremo il link per reimpostare la password.</p>

          <form onSubmit={handleSubmit} className="lx-auth-form">
            <div className="lx-auth-field">
              <label className="lx-auth-label">Email</label>
              <input className="lx-auth-input" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            {errorMessage && (
              <div className="lx-auth-error lx-auth-error--global">
                <i className="bi bi-exclamation-circle" /> {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className="lx-auth-success">
                <i className="bi bi-check-circle" /> {successMessage}
              </div>
            )}

            <button className="lx-auth-btn lx-auth-btn--primary" type="submit" disabled={loading || isEmailEmpty}>
              {loading ? (
                <>
                  <span className="lx-auth-spinner" />
                  <span>Invio in corso...</span>
                </>
              ) : (
                "Invia link di reset"
              )}
            </button>
          </form>

          <div className="lx-auth-footer-link">
            <Link to="/auth" className="lx-auth-link-soft">
              <i className="bi bi-arrow-left" /> Torna al login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
