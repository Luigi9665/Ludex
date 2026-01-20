import { useState } from "react";
import Email from "./Email";
import Username from "./Username";

const RegisterForm = ({ onRegistered }) => {
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
  const [alert, setAlert] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(null);

  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  //controlli per validazione password anche a livelli di backend
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const passwordsMatch = password === confirmPassword;
  const isPasswordValid = hasMinLength && hasUppercase && hasLowercase && passwordsMatch;

  const isFirstNameValid = firstName.trim().length >= 2;
  const isLastNameValid = lastName.trim().length >= 2;

  //booleano per controllo email e password
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
    // console.log(firstName, lastName, userName, email, password);
    setIsSubmitting(true);
    setAlert(null);

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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await safeJson(response);
      if (!response.ok) {
        throw data || { message: "Errore durante la registrazione" };
      }
      setAlert({ type: "success", message: "Registrazione completata! Ora puoi fare login." });

      setTimeout(() => {
        onRegistered();
      }, 800);
    } catch (err) {
      const field = err?.field;
      const message = err?.message || "Errore durante la registrazione. Riprova tra poco.";

      if (field === "email") {
        setEmailServerError(message);
      } else if (field === "username") {
        setUsernameServerError(message);
      } else {
        setAlert({ type: "danger", message });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="d-grid gap-3 auth-form">
      <div>
        <label className="form-label">Name</label>
        <input
          className="form-control"
          placeholder="Mario"
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
          maxLength={50}
        />
      </div>
      <div>
        <label className="form-label">Cognome</label>
        <input
          className="form-control"
          placeholder="Rossi"
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
          maxLength={50}
        />
      </div>

      <Username
        userName={userName}
        setUserName={setUserName}
        baseUrl={baseUrl}
        setUsernameAvailableParent={setIsUsernameOkForSubmit}
        userNameServerErrorParent={userNameServerError}
      />

      <Email
        baseUrl={baseUrl}
        email={email}
        confirmEmail={confirmEmail}
        setEmail={setEmail}
        setConfirmEmail={setConfirmEmail}
        setIsEmailOkForSubmit={setIsEmailOkForSubmit}
        emailServerErrorParent={emailServerError}
      />

      <div>
        <label className="form-label">Password</label>
        <input
          className="form-control"
          placeholder="Crea una password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <ul className="small mt-2 ps-3">
        <li className={hasMinLength ? "text-success" : "text-danger"}>Minimo 8 caratteri</li>
        <li className={hasUppercase ? "text-success" : "text-danger"}>Almeno una lettera maiuscola</li>
        <li className={hasLowercase ? "text-success" : "text-danger"}>Almeno una lettera minuscola</li>
        <li className={passwordsMatch ? "text-success" : "text-danger"}>Le password coincidono</li>
      </ul>
      <div>
        <label className="form-label">Conferma password</label>
        <input
          className="form-control"
          placeholder="Ripeti la password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>
      <label className="form-check-label d-flex align-items-start gap-2 text-white small">
        <input className="form-check-input mt-1" type="checkbox" required />
        Accetto i termini e la privacy policy.
      </label>
      {alert && (
        <div className={`alert alert-${alert.type} mb-3`} role="alert">
          {alert.message}
        </div>
      )}

      <button className="btn btn-lx-warm btn-lg" type="submit" disabled={!isFormValid || isSubmitting}>
        {isSubmitting ? "Registrazione..." : "Registrati"}
      </button>
    </form>
  );
};

export default RegisterForm;
