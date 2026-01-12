import Logo from "./Logo";

const AuthCard = ({ title, subtitle, children }) => {
  return (
    <div className="card auth-card">
      <div className="card-body p-4 p-md-5">
        <Logo title={title} subtitle={subtitle} />
        {children}
      </div>
    </div>
  );
};

export default AuthCard;
