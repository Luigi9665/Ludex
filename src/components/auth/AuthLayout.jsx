const AuthLayout = ({ children }) => {
  return (
    <div className="auth-bg min-vh-100 d-flex align-items-center justify-content-center p-3 position-relative overflow-hidden">
      {/* Glow blobs */}
      <div className="auth-blob auth-blob-1" />
      <div className="auth-blob auth-blob-2" />

      <div className="w-100 position-relative" style={{ maxWidth: 520, zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
