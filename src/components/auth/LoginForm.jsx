// src/components/auth/LoginForm.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router";
import { loginAction } from "../../redux/action";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const [isEmailTouched, setIsEmailTouched] = useState(false);
  const [isPasswordTouched, setIsPasswordTouched] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  // redirect se già loggato
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = (e) => {
    e.preventDefault();

    // per ora rememberMe è solo UI → non lo passo all’azione
    dispatch(loginAction({ email, password }));
  };

  const isEmailValid = email.trim().length > 0;
  const isPasswordValid = password.length >= 8;

  const showEmailError = isEmailTouched && !isEmailValid;
  const showPasswordError = isPasswordTouched && !isPasswordValid;

  const isFormValid = isEmailValid && isPasswordValid;

  return (
    <form onSubmit={onSubmit} className="lx-auth-form">
      {/* Email */}
      <div className="lx-auth-field">
        <label className="lx-auth-label">Email</label>
        <input
          className={`lx-auth-input ${showEmailError ? "lx-auth-input--invalid" : ""}`}
          placeholder="you@example.com"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => setIsEmailTouched(true)}
          required
        />
        {showEmailError && <div className="lx-auth-error">Inserisci un’email valida.</div>}
      </div>

      {/* Password */}
      <div className="lx-auth-field">
        <label className="lx-auth-label">Password</label>
        <input
          className={`lx-auth-input ${showPasswordError ? "lx-auth-input--invalid" : ""}`}
          placeholder="••••••••"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onBlur={() => setIsPasswordTouched(true)}
          required
        />
        {showPasswordError && <div className="lx-auth-error">Inserisci una password valida (min. 8 caratteri).</div>}
      </div>

      {/* Opzioni: remember + forgot */}
      <div className="lx-auth-options">
        <label className="lx-auth-checkbox">
          <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
          <span>Ricordami</span>
        </label>

        {/* questa route la aggiungeremo in App.jsx */}
        <Link to="/forgot-password" className="lx-auth-link-soft">
          Password dimenticata?
        </Link>
      </div>

      {/* Errore globale da Redux */}
      {error && (
        <div className="lx-auth-error lx-auth-error--global">
          <i className="bi bi-exclamation-circle" /> {error}
        </div>
      )}

      {/* Submit */}
      <button className="lx-auth-btn lx-auth-btn--primary" type="submit" disabled={!isFormValid || loading}>
        {loading ? (
          <>
            <span className="lx-auth-spinner" />
            <span>Accesso in corso...</span>
          </>
        ) : (
          "Accedi"
        )}
      </button>
    </form>
  );
};

export default LoginForm;
