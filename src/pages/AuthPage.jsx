import { useState } from "react";
import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";
import AuthCarousel from "../components/auth/AuthCarousel";
import LogoLudexPng from "../assets/LogoLudex3Ridimensionato.png";

const AuthPage = () => {
  const [mode, setMode] = useState("login"); // "login" | "register"

  return (
    <div className={`lx-auth-page lx-auth-page--${mode}`}>
      <div className="lx-auth-inner">
        <div className={`lx-auth-split ${mode === "register" ? "lx-auth-split--flipped" : ""}`}>
          {/* Carousel Side */}
          <div className="lx-auth-carousel-side">
            <AuthCarousel variant={mode} />
          </div>

          {/* Form Side */}
          <div className="lx-auth-form-side">
            <div className="lx-auth-form-card">
              {/* Logo */}
              <div className="lx-auth-logo">
                <img src={LogoLudexPng} alt="Ludex" className="lx-auth-logo-img" />
              </div>

              {/* Title & Subtitle */}
              {mode === "login" ? (
                <>
                  <h1 className="lx-auth-title">Bentornato su Ludex</h1>
                  <p className="lx-auth-subtitle">Accedi per vedere la tua libreria e i consigli personalizzati</p>
                </>
              ) : (
                <>
                  <h1 className="lx-auth-title">Crea il tuo account Ludex</h1>
                  <p className="lx-auth-subtitle">Inizia a organizzare i tuoi giochi e scopri cosa gioca la community</p>
                </>
              )}

              {/* Form */}
              <div className="lx-auth-form-content">{mode === "login" ? <LoginForm /> : <RegisterForm onRegistered={() => setMode("login")} />}</div>

              {/* Toggle login / register */}
              <div className="lx-auth-toggle">
                {mode === "login" ? (
                  <>
                    <span className="lx-auth-toggle-text">Nuovo su Ludex?</span>
                    <button type="button" className="lx-auth-toggle-link" onClick={() => setMode("register")}>
                      Crea un account
                    </button>
                  </>
                ) : (
                  <>
                    <span className="lx-auth-toggle-text">Hai già un account?</span>
                    <button type="button" className="lx-auth-toggle-link" onClick={() => setMode("login")}>
                      Accedi
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
