import { useState } from "react";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    console.log(email, password);
  };

  return (
    <form onSubmit={onSubmit} className="d-grid gap-3">
      <div>
        <label className="form-label">Email</label>
        <input className="form-control" placeholder="you@example.com" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>

      <div>
        <label className="form-label">Password</label>
        <input className="form-control" placeholder="********" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>

      <button className="btn btn-primary btn-lg" type="submit">
        Login
      </button>

      <p className="text-muted small text-center mb-0">Demo: user / admin (quando lo colleghiamo al backend)</p>
    </form>
  );
};

export default LoginForm;
