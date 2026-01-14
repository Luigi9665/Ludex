import LogoLudex from "../../assets/logoSVG.svg?react";
import LogoLudexPng from "../../assets/LogoLudex3Ridimensionato.png";

export default function Logo({ subtitle, variant = "auth" }) {
  return (
    <div className="text-center mb-4">
      {/* <div className={`d-inline-flex align-items-center gap-3 containerLogo ${variant === "auth" ? "mb-2" : ""}`}> */}
      <div className={`d-flex flex-column `}>
        <div className={variant === "auth" ? "logo-badge" : ""}>
          {/* <LogoLudex className={variant === "auth" ? "logoSvg logoAuth" : "logoSvg logoNav"} /> */}
          <img src={LogoLudexPng} className="logo-img" alt="Ludex logo" />
        </div>

        {variant === "auth" ? (
          <div className="text-start">
            {subtitle ? (
              <p style={{ fontSize: "18px", letterSpacing: "-0.5px" }} className="text-white mb-0">
                {subtitle}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
