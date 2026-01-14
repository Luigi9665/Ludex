import { useEffect, useState } from "react";

const Email = ({ baseUrl, email, confirmEmail, setEmail, setConfirmEmail, setIsEmailOkForSubmit, emailServerErrorParent }) => {
  //stati per controllo duplicazioni
  const [isEmailTouched, setIsEmailTouched] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState(null);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [emailServerError, setEmailServerError] = useState(emailServerErrorParent);

  //controllo validazione email
  const isEmailValid = email.length > 0 && email === confirmEmail;
  const showEmailError = confirmEmail.length > 0 && email !== confirmEmail;
  const isValidEmailFormat = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

  const emailFormatOk = isValidEmailFormat(email);
  const showEmailFormatError = isEmailTouched && email.trim().length > 0 && !emailFormatOk;
  const showEmailTakenError = isEmailTouched && emailFormatOk && emailAvailable === false;

  const checkEmailAvaibility = async () => {
    const value = email.trim();
    const URL = `${baseUrl}/api/Auth/checkEmail?email=${value}`;
    if (!value || !isValidEmailFormat(value)) {
      setEmailAvailable(null);
      return;
    }
    setCheckingEmail(true);
    setEmailServerError("");
    try {
      const response = await fetch(URL);

      if (response.ok) {
        const dataObj = await response.json();
        setEmailAvailable(dataObj.available);
      } else if (response.status === 404) {
        throw new Error("Risorsa non trovata (404). Riprova con la ricerca.");
      } else if (response.status >= 500) {
        throw new Error("Errore del server, riprova più tardi.");
      } else {
        throw new Error("Errore nella richiesta: " + response.status);
      }
    } catch (err) {
      setEmailAvailable(null);
      console.log(err);
      setEmailServerError("Errore nel controllo email. Riprova.");
    } finally {
      setCheckingEmail(false);
    }
  };

  useEffect(() => {
    const ok = isEmailValid && emailFormatOk && emailAvailable === true;
    setIsEmailOkForSubmit(ok);
  }, [isEmailValid, emailFormatOk, emailAvailable]);

  return (
    <>
      <div>
        <label className="form-label">Email</label>
        <input
          className={`form-control ${showEmailFormatError || showEmailTakenError ? "is-invalid" : ""}`}
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
            checkEmailAvaibility();
          }}
          required
        />

        {showEmailFormatError && <div className="invalid-feedback">Inserisci un’email valida.</div>}

        {showEmailTakenError && <div className="invalid-feedback">Email già in uso.</div>}

        {emailServerError && <div className="text-warning small mt-1">{emailServerError}</div>}

        {checkingEmail && <div className="text-muted small mt-1">Controllo email in corso...</div>}
      </div>

      <div>
        <label className="form-label">Conferma Email</label>
        <input
          className={`form-control ${showEmailError ? "is-invalid" : ""}`}
          placeholder="you@example.com"
          type="email"
          value={confirmEmail}
          onChange={(e) => setConfirmEmail(e.target.value)}
          required
        />
        {showEmailError && <div className="invalid-feedback">Le email non coincidono.</div>}
      </div>
    </>
  );
};

export default Email;
