import { useState } from "react";

const RegisterForm = ({ onRegistered }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  //controllo validazione email
  const isEmailValid = email.length > 0 && email === confirmEmail;
  const showEmailError = confirmEmail.length > 0 && email !== confirmEmail;

  //controlli per validazione password anche a livelli di backend
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const passwordsMatch = password === confirmPassword;
  const isPasswordValid = hasMinLength && hasUppercase && hasLowercase && passwordsMatch;

  //booleano per controllo email e password
  const isFormValid = isEmailValid && isPasswordValid;

  const onSubmit = (e) => {
    e.preventDefault();
    console.log(firstName, lastName, userName, email, password);
    onRegistered();
  };

  return (
    <form onSubmit={onSubmit} className="d-grid gap-3 auth-form">
      <div>
        <label className="form-label">Name</label>
        <input className="form-control" placeholder="Mario" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
      </div>

      <div>
        <label className="form-label">Cognome</label>
        <input className="form-control" placeholder="Rossi" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
      </div>

      <div>
        <label className="form-label">Username</label>
        <input className="form-control" placeholder="Mariorossi1" type="text" value={userName} onChange={(e) => setUserName(e.target.value)} required />
      </div>

      {/* con onBlur aspetto che l'utente esca dal campo per mandare l'email lato backend e controllare se è già registrata come email nel db (fare lo stesso controllo anche nel register per evitare duplicazioni nel caso un altro utente stesse per registrarsi nello stesso momento) */}
      <div>
        <label className="form-label">Email</label>
        <input className="form-control" placeholder="you@example.com" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>

      {showEmailError && <small className="text-danger">Le email non coincidono</small>}

      <div>
        <label className="form-label">Conferma Email</label>
        <input
          className="form-control"
          placeholder="you@example.com"
          type="email"
          value={confirmEmail}
          onChange={(e) => setConfirmEmail(e.target.value)}
          required
        />
      </div>

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

      <button className="btn btn-success btn-lg" type="submit" disabled={!isFormValid}>
        Registrati
      </button>
    </form>
  );
};

export default RegisterForm;
