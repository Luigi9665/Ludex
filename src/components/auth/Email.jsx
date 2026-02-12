import { useEffect, useState } from "react";

const Email = ({ baseUrl, email, confirmEmail, setEmail, setConfirmEmail, setIsEmailOkForSubmit, emailServerErrorParent }) => {
  const [isEmailTouched, setIsEmailTouched] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState(null);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [emailServerError, setEmailServerError] = useState(emailServerErrorParent);

  // Se il parent aggiorna l'errore server (es. 409 da /register), allinealo qui
  useEffect(() => {
    setEmailServerError(emailServerErrorParent || "");
  }, [emailServerErrorParent]);

  const isValidEmailFormat = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

  const emailFormatOk = isValidEmailFormat(email);
  const showEmailFormatError = isEmailTouched && email.trim().length > 0 && !emailFormatOk;
  const showEmailTakenError = isEmailTouched && emailFormatOk && emailAvailable === false;
  const showEmailMismatch = confirmEmail.length > 0 && email !== confirmEmail;

  const checkEmailAvailability = async () => {
    const value = email.trim();
    if (!value || !isValidEmailFormat(value)) {
      setEmailAvailable(null);
      return;
    }

    const URL = `${baseUrl}/api/Auth/checkEmail?email=${encodeURIComponent(value)}`;

    setCheckingEmail(true);
    setEmailServerError("");

    try {
      const response = await fetch(URL);
      if (response.ok) {
        const dataObj = await response.json();
        setEmailAvailable(dataObj.available);
      } else {
        throw new Error("Errore nel controllo email");
      }
    } catch (err) {
      console.error(err);
      setEmailServerError("Errore nel controllo email. Riprova.");
      // opzionale: se vuoi che questo NON blocchi il submit, puoi anche fare:
      // setEmailAvailable(true);
    } finally {
      setCheckingEmail(false);
    }
  };

  // Comunichiamo al parent se l'email è ok per il submit
  useEffect(() => {
    const ok =
      email === confirmEmail &&
      emailFormatOk &&
      emailAvailable === true && // serve il check di disponibilità positivo
      !emailServerError; // e niente errore lato server

    setIsEmailOkForSubmit(ok);
  }, [email, confirmEmail, emailFormatOk, emailAvailable, emailServerError, setIsEmailOkForSubmit]);

  return (
    <>
      <input
        className={`lx-auth-input ${showEmailFormatError || showEmailTakenError ? "lx-auth-input--error" : ""}`}
        placeholder="you@example.com"
        type="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setEmailAvailable(null);
          setEmailServerError("");
        }}
        onBlur={() => {
          setIsEmailTouched(true);
          checkEmailAvailability();
        }}
        required
      />

      {showEmailFormatError && (
        <div className="lx-auth-error">
          <i className="bi bi-x-circle" /> Inserisci un'email valida
        </div>
      )}

      {showEmailTakenError && (
        <div className="lx-auth-error">
          <i className="bi bi-x-circle" /> Email già registrata
        </div>
      )}

      {emailServerError && (
        <div className="lx-auth-error">
          <i className="bi bi-exclamation-triangle" /> {emailServerError}
        </div>
      )}

      {checkingEmail && (
        <div className="lx-auth-hint">
          <span className="lx-auth-spinner-sm" /> Controllo disponibilità...
        </div>
      )}

      {emailAvailable === true && !emailServerError && (
        <div className="lx-auth-hint lx-auth-hint--success">
          <i className="bi bi-check-circle" /> Email disponibile
        </div>
      )}

      <div className="lx-auth-field lx-auth-field--confirm-email">
        <label className="lx-auth-label">Conferma Email</label>
        <input
          className={`lx-auth-input ${showEmailMismatch ? "lx-auth-input--error" : ""}`}
          placeholder="you@example.com"
          type="email"
          value={confirmEmail}
          onChange={(e) => setConfirmEmail(e.target.value)}
          required
        />
        {showEmailMismatch && (
          <div className="lx-auth-error">
            <i className="bi bi-x-circle" /> Le email non coincidono
          </div>
        )}
      </div>
    </>
  );
};

export default Email;
