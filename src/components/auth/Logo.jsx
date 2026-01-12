import LogoLudex from "../../assets/logoSVG.svg?react";

export default function Logo({ subtitle, variant = "auth" }) {
  return (
    <div className="text-center mb-4">
      <div className={`d-inline-flex align-items-center gap-3 ${variant === "auth" ? "mb-2" : ""}`}>
        <div className={variant === "auth" ? "logo-badge" : ""}>
          <LogoLudex className={variant === "auth" ? "logoSvg logoAuth" : "logoSvg logoNav"} />
        </div>

        {variant === "auth" ? <div className="text-start">{subtitle ? <p className="text-secondary mb-0">{subtitle}</p> : null}</div> : null}
      </div>
    </div>
  );
}
