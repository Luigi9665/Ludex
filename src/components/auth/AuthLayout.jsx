const AuthLayout = ({ children }) => {
  return (
    // <div className="auth-bg min-vh-100 d-flex align-items-center justify-content-center p-3 position-relative overflow-hidden">
    //   <div className="w-100 position-relative" style={{ maxWidth: 520, zIndex: 1 }}>
    //     {children}
    //   </div>
    // </div>
    <div className="auth-page">
      <div className="auth-content d-flex justify-content-center align-items-center">{children}</div>
    </div>
  );
};

export default AuthLayout;
