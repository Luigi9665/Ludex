import React from "react";

/**
 * Mostra il dettaglio degli effetti per una singola opzione.
 *
 * type: "genres" | "tags" | "metadata"
 * effects: array di oggetti normalizzati:
 *   - genres:   { id, name, delta }
 *   - tags:     { id, name, code?, delta }
 *   - metadata: { id, name, code?, delta }
 */
export default function QuestionEffectsDetail({ type, effects }) {
  const safeEffects = Array.isArray(effects) ? effects : [];

  if (!safeEffects.length) {
    return (
      <div className="lx-effects-detail">
        <div className="lx-effects-empty">
          <i className="bi bi-info-circle me-2" />
          Nessun effetto definito
        </div>
      </div>
    );
  }

  const typeConfig = {
    genres: {
      icon: "bi-collection",
      label: "Generi",
      color: "primary",
    },
    tags: {
      icon: "bi-tags",
      label: "Tag",
      color: "secondary",
    },
    metadata: {
      icon: "bi-sliders",
      label: "Metadata",
      color: "tertiary",
    },
  };

  const config = typeConfig[type] || {
    icon: "bi-question-circle",
    label: "Effetti",
    color: "primary",
  };

  // Somma totale dei delta
  const totalDelta = safeEffects.reduce((sum, e) => sum + (Number(e.delta) || 0), 0);

  return (
    <div className="lx-effects-detail">
      <div className="lx-effects-header">
        <i className={`bi ${config.icon} me-2`} />
        <span className="lx-effects-title">Dettaglio {config.label}</span>
      </div>

      <div className="lx-effects-list">
        {safeEffects.map((effect, idx) => {
          const delta = Number(effect.delta) || 0;

          // Nome visualizzato in base al tipo
          let displayName = effect.name || "";

          if (type === "tags" && effect.code) {
            // es. "Story Rich (TAG:123)" se volessi mostrare il code
            displayName = `${effect.name} (${effect.code})`;
          } else if (type === "metadata" && effect.code) {
            // es. "STORY (Story-driven)" da "FOCUS:STORY"
            const short = (effect.code.split(":")[1] || effect.code || "").toUpperCase();
            displayName = `${short} (${effect.name})`;
          }

          return (
            <div key={effect.id ?? idx} className="lx-effect-item">
              <div className="lx-effect-name">
                <span className="lx-effect-bullet" />
                {displayName}
              </div>

              <div className="lx-effect-bar-wrapper">
                <div className="lx-bar-track lx-bar-track-small lx-bar-track-effect">
                  <div
                    className={`lx-bar-fill lx-bar-fill-${config.color} ${delta < 0 ? "lx-bar-negative" : ""}`}
                    style={{
                      width: `${Math.min(Math.abs(delta) / 1.5, 100)}%`,
                      ...(delta < 0 && { marginLeft: "auto" }),
                    }}
                  />
                </div>

                <span className={`lx-effect-delta ${delta >= 0 ? "positive" : "negative"}`}>
                  {delta >= 0 ? "+" : ""}
                  {delta}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="lx-effects-summary">
        <span className="lx-summary-label">Totale:</span>
        <span className={`lx-summary-value ${totalDelta >= 0 ? "positive" : "negative"}`}>
          {totalDelta >= 0 ? "+" : ""}
          {totalDelta}
        </span>
      </div>
    </div>
  );
}
