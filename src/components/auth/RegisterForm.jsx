import { useState } from "react";
import Email from "./Email";
import Username from "./Username";

const RegisterForm = ({ onRegistered = () => {} }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isEmailOkForSubmit, setIsEmailOkForSubmit] = useState(false);
  const [isUsernameOkForSubmit, setIsUsernameOkForSubmit] = useState(false);

  const [emailServerError, setEmailServerError] = useState("");
  const [userNameServerError, setUsernameServerError] = useState("");
  const [globalError, setGlobalError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  // --- Validazioni password / nome / cognome ---
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const passwordsMatch = password === confirmPassword;
  const isPasswordValid = hasMinLength && hasUppercase && hasLowercase && passwordsMatch;

  const isFirstNameValid = firstName.trim().length >= 2;
  const isLastNameValid = lastName.trim().length >= 2;

  const isFormValid = isEmailOkForSubmit && isUsernameOkForSubmit && isPasswordValid && isFirstNameValid && isLastNameValid;

  const safeJson = async (res) => {
    try {
      return await res.json();
    } catch {
      return null;
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // pulizia errori prima di un nuovo tentativo
    setIsSubmitting(true);
    setGlobalError("");
    setSuccessMessage("");
    setEmailServerError("");
    setUsernameServerError("");

    const payload = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email,
      confirmEmail,
      password,
      confirmPassword,
      userName,
    };

    const URL = `${baseUrl}/api/Auth/register`;

    try {
      const response = await fetch(URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await safeJson(response);

      if (!response.ok) {
        // il backend manda { field, message } per le CheckException
        throw data || { message: "Errore durante la registrazione" };
      }

      setSuccessMessage(data?.message || "Registrazione completata! Controlla la tua email per confermare l'account.");

      // dopo 2s switch su login
      setTimeout(() => {
        onRegistered();
      }, 2000);
    } catch (err) {
      const field = err?.field;
      const message = err?.message || "Errore durante la registrazione. Riprova tra poco.";

      if (field === "email") {
        setEmailServerError(message);
      } else if (field === "username") {
        setUsernameServerError(message);
      } else {
        // "form", "server" o qualsiasi altro -> errore globale
        setGlobalError(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="lx-auth-form">
      {/* Username */}
      <div className="lx-auth-field">
        <label className="lx-auth-label">Username</label>
        <Username
          userName={userName}
          setUserName={(value) => {
            setUserName(value);
            // quando l'utente modifica l'username, pulisco eventuale errore server
            setUsernameServerError("");
            setGlobalError("");
          }}
          baseUrl={baseUrl}
          setUsernameAvailableParent={setIsUsernameOkForSubmit}
          userNameServerErrorParent={userNameServerError}
        />
      </div>

      {/* Email */}
      <div className="lx-auth-field">
        <label className="lx-auth-label">Email</label>
        <Email
          baseUrl={baseUrl}
          email={email}
          confirmEmail={confirmEmail}
          setEmail={(value) => {
            setEmail(value);
            // se l'utente cambia email, ha senso pulire l'errore server
            setEmailServerError("");
            setGlobalError("");
          }}
          setConfirmEmail={setConfirmEmail}
          setIsEmailOkForSubmit={setIsEmailOkForSubmit}
          emailServerErrorParent={emailServerError}
          // opzionale: se aggiorni Email, puoi usare questa per pulire l'errore dall'interno
          // clearEmailServerError={setEmailServerError}
        />
      </div>

      {/* Nome + Cognome */}
      <div className="lx-auth-row">
        <div className="lx-auth-field">
          <label className="lx-auth-label">Nome</label>
          <input
            className="lx-auth-input"
            placeholder="Mario"
            type="text"
            value={firstName}
            onChange={(e) => {
              setFirstName(e.target.value);
              setGlobalError("");
            }}
            required
            maxLength={50}
          />
        </div>

        <div className="lx-auth-field">
          <label className="lx-auth-label">Cognome</label>
          <input
            className="lx-auth-input"
            placeholder="Rossi"
            type="text"
            value={lastName}
            onChange={(e) => {
              setLastName(e.target.value);
              setGlobalError("");
            }}
            required
            maxLength={50}
          />
        </div>
      </div>

      {/* Password */}
      <div className="lx-auth-field">
        <label className="lx-auth-label">Password</label>
        <input
          className="lx-auth-input"
          placeholder="Crea una password sicura"
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setGlobalError("");
          }}
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

      {/* Conferma password */}
      <div className="lx-auth-field">
        <label className="lx-auth-label">Conferma password</label>
        <input
          className="lx-auth-input"
          placeholder="Ripeti la password"
          type="password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            setGlobalError("");
          }}
          required
        />
        {confirmPassword && !passwordsMatch && (
          <div className="lx-auth-hint lx-auth-hint--error">
            <i className="bi bi-x-circle" /> Le password non coincidono
          </div>
        )}
      </div>

      {/* Hint conferma email */}
      <div className="lx-auth-hint">
        <i className="bi bi-envelope" /> Ti invieremo un link di conferma email dopo la registrazione.
      </div>

      {/* Privacy / Termini */}
      <label className="lx-auth-checkbox">
        <input
          type="checkbox"
          required
          onChange={() => {
            setGlobalError("");
          }}
        />
        <span>Accetto i termini e la privacy policy</span>
      </label>

      {/* Errori globali */}
      {globalError && (
        <div className="lx-auth-error lx-auth-error--global">
          <i className="bi bi-exclamation-circle" /> {globalError}
        </div>
      )}

      {/* Success message */}
      {successMessage && (
        <div className="lx-auth-success">
          <i className="bi bi-check-circle" /> {successMessage}
        </div>
      )}

      {/* Submit */}
      <button className="lx-auth-btn lx-auth-btn--primary" type="submit" disabled={!isFormValid || isSubmitting}>
        {isSubmitting ? (
          <>
            <span className="lx-auth-spinner" />
            <span>Registrazione...</span>
          </>
        ) : (
          "Registrati"
        )}
      </button>
    </form>
  );
};

export default RegisterForm;
