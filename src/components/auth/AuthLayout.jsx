const AuthLayout = ({ children }) => {
  return (
    <div className="auth-page">
      <div className="auth-content d-flex justify-content-center align-items-center">{children}</div>
    </div>
  );
};

export default AuthLayout;
