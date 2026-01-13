const AuthToggle = ({ mode, onChange }) => {
  return (
    <div className="btn-group w-100 mb-4" role="gorup" aria-label="Auth toogle">
      <button type="button" className={`btn btn-toggle-lx ${mode === "login" ? "active" : ""}`} onClick={() => onChange("login")}>
        {" "}
        Login{" "}
      </button>
      <button type="button" className={`btn btn-toggle-lx ${mode === "register" ? "active" : ""}`} onClick={() => onChange("register")}>
        {" "}
        Register
      </button>
    </div>
  );
};

export default AuthToggle;
