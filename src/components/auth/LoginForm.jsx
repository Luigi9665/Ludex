import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginAction } from "../../redux/action";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isEmailTouched, setIsEmailTouched] = useState(false);
  const [isPasswordTouched, setIsPasswordTouched] = useState(false);
  const [backendError, setBackendError] = useState("");

  const dispatch = useDispatch();
  // const { loadig, error, isAuthenticated } = useSelector((state) => state.auth);

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(loginAction({ email, password }));
  };

  const isEmailValid = email.trim().length > 0;
  const isPasswordValid = password.length >= 8;
  const showEmailError = isEmailTouched && !isEmailValid;
  const showPasswordError = isPasswordTouched && !isPasswordValid;
  const isFormValid = isEmailValid && isPasswordValid;

  return (
    <form onSubmit={onSubmit} className="d-grid gap-3 auth-form">
      <div>
        <label className="form-label">Email</label>
        <input
          className={`form-control ${showEmailError ? "is-invalid" : ""}`}
          placeholder="you@example.com"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setBackendError("");
          }}
          onBlur={() => setIsEmailTouched(true)}
          required
        />

        {showEmailError && <div className="invalid-feedback">Inserisci un’email valida.</div>}
      </div>

      <div>
        <label className="form-label">Password</label>
        <input
          className={`form-control ${showPasswordError ? "is-invalid" : ""}`}
          placeholder="********"
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setBackendError("");
          }}
          onBlur={() => setIsPasswordTouched(true)}
          required
        />
        {showPasswordError && <div className="invalid-feedback">Inserisci una password valida</div>}
      </div>

      {/* CONTAINER PER BUTTON RICORDAMI E PASSWORD DIMENTICATA */}
      {/* <div className="d-flex align-items-center justify-content-between small">
        <label className="form-check-label d-flex align-items-center gap-2 text-white">
          <input className="form-check-input mt-0" type="checkbox" />
          Ricordami
        </label>
        <button className="btn btn-link p-0 auth-link" type="button">
          Password dimenticata?
        </button>
      </div> */}

      {backendError && <div className="alert alert-danger text-center mb-2">{backendError}</div>}

      <button className="btn btn-lx-primary btn-lg" type="submit" disabled={!isFormValid}>
        Login
      </button>

      <p className="text-muted small text-center mb-0">Demo: user / admin (quando lo colleghiamo al backend)</p>
    </form>
  );
};

export default LoginForm;
