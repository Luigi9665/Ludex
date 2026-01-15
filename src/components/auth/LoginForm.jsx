import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginAction } from "../../redux/action";
import { useNavigate } from "react-router";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isEmailTouched, setIsEmailTouched] = useState(false);
  const [isPasswordTouched, setIsPasswordTouched] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home", { replace: true });
    }
  }, [isAuthenticated, navigate]);

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

      {error && <div className="alert alert-danger text-center mb-2">{error}</div>}

      <button className="btn btn-lx-primary btn-lg d-flex align-items-center justify-content-center gap-2" type="submit" disabled={!isFormValid || loading}>
        {loading ? (
          <>
            <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
            <span role="status">Accesso in corso...</span>
          </>
        ) : (
          "Login"
        )}
      </button>
    </form>
  );
};

export default LoginForm;
