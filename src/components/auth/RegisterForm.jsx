import { Link } from "react-router";

const RegisterForm = () => {
  return (
    <div className="container mt-5">
      <h2>Registrazione</h2>

      <form>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input type="email" className="form-control" />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input type="password" className="form-control" />
        </div>

        <button className="btn btn-success w-100">Registrati</button>
      </form>

      <p className="mt-3 text-center">
        Hai già un account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default RegisterForm;
