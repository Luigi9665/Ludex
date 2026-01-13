import { useState } from "react";
import AuthCard from "../components/auth/AuthCard";
import AuthLayout from "../components/auth/AuthLayout";
import AuthToggle from "../components/auth/AuthToggle";
import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";

const AuthPage = () => {
  const [mode, setMode] = useState("login"); //  login || register

  return (
    <AuthLayout>
      <AuthCard title="LUDEX" subtitle="Scegli i tuoi giochi e condividi le tue recensioni con gli amici">
        <AuthToggle mode={mode} onChange={setMode} />
        {mode === "login" ? <LoginForm /> : <RegisterForm onRegistered={() => setMode("login")} />}
      </AuthCard>
    </AuthLayout>
  );
};

export default AuthPage;
