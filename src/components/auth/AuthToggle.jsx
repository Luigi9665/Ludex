const AuthToggle = ({ mode, onChange }) => {
  return (
    <div className="btn-group w-100 mb-4" role="gorup" aria-label="Auth toogle">
      <button type="button" className={`btn ${mode === "login" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => onChange("login")}>
        {" "}
        Login{" "}
      </button>
      <button type="button" className={`btn ${mode === "register" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => onChange("register")}>
        {" "}
        Register
      </button>
    </div>
  );
};

export default AuthToggle;
