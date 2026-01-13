import { useState } from "react";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    console.log(email, password);
  };

  return (
    <form onSubmit={onSubmit} className="d-grid gap-3 auth-form">
      <div>
        <label className="form-label">Email</label>
        <input className="form-control" placeholder="you@example.com" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>

      <div>
        <label className="form-label">Password</label>
        <input className="form-control" placeholder="********" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>

      <div className="d-flex align-items-center justify-content-between small">
        <label className="form-check-label d-flex align-items-center gap-2 text-white">
          <input className="form-check-input mt-0" type="checkbox" />
          Ricordami
        </label>
        <button className="btn btn-link p-0 auth-link" type="button">
          Password dimenticata?
        </button>
      </div>

      <button className="btn btn-lx-primary btn-lg" type="submit">
        Login
      </button>

      <p className="text-muted small text-center mb-0">Demo: user / admin (quando lo colleghiamo al backend)</p>
    </form>
  );
};

export default LoginForm;
