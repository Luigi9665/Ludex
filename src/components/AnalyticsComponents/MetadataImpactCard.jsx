import React from "react";

/**
 * Nota per me futuro:
 * - Mostra come i METADATA vengono usati nelle regole del questionario.
 * - Ogni riga = un metadata (FOCUS / MOOD / DIFFICULTY / FLAG / LENGTH):
 *   - Regole: quante regole lo usano (EffectsCount)
 *   - Delta totale: somma dei DeltaWeight per quel codice
 *   - Peso %: quanto pesa rispetto agli altri metadata
 */
export default function MetadataImpactCard({ metadata }) {
  const safeMetadata = Array.isArray(metadata) ? metadata : [];

  // Ordino per WeightSharePercent desc e prendo i primi 8
  const topMetadata = [...safeMetadata].sort((a, b) => (b.WeightSharePercent || 0) - (a.WeightSharePercent || 0)).slice(0, 8);

  const hasData = topMetadata.length > 0;

  // Helper per scegliere l’icona in base al Type
  const getMetadataIcon = (type) => {
    const icons = {
      FOCUS: "bi-bullseye",
      MOOD: "bi-emoji-smile",
      DIFFICULTY: "bi-speedometer2",
      FLAG: "bi-flag",
      LENGTH: "bi-clock-history",
    };
    return icons[type] || "bi-gear";
  };

  return (
    <div className="lx-chart-card">
      <div className="lx-chart-card-header">
        <h3 className="lx-chart-card-title">
          <i className="bi bi-sliders me-2" />
          Metadata usati nel questionario
        </h3>
        <span className="lx-chart-card-subtitle">Focus, mood, difficoltà, flag e durata collegati alle domande</span>
      </div>

      <div className="lx-chart-card-body">
        {hasData && (
          <p className="text-white-50 small mb-3">
            Ogni riga mostra <strong>tipo e valore</strong> del metadata, quante <strong>regole</strong> lo usano, il
            <strong> delta totale</strong> e il suo <strong>peso %</strong> rispetto agli altri metadata.
          </p>
        )}

        {!hasData && <p className="text-white-50 small mb-0">Nessun dato disponibile sui metadata al momento.</p>}

        {hasData && (
          <div className="lx-table-admin">
            <div className="lx-table-header">
              <div className="lx-table-col">Tipo / valore</div>
              <div className="lx-table-col text-center">Regole</div>
              <div className="lx-table-col text-center">Delta totale</div>
              <div className="lx-table-col text-center">Peso %</div>
            </div>

            {topMetadata.map((meta) => {
              const totalDelta = meta.TotalDelta || 0;
              const rawPercent = Number(meta.WeightSharePercent) || 0;
              const percent = Math.max(0, Math.min(100, rawPercent));

              return (
                <div key={meta.Code} className="lx-table-row">
                  <div className="lx-table-col">
                    <div className="lx-metadata-type">
                      <i className={`bi ${getMetadataIcon(meta.Type)} me-1`} />
                      {meta.Type}
                    </div>
                    <span className="lx-entity-name">{meta.Value}</span>
                    <span className="lx-entity-meta">{meta.Code}</span>
                  </div>

                  <div className="lx-table-col text-center">
                    <span className="lx-badge-soft">{meta.EffectsCount}</span>
                  </div>

                  <div className="lx-table-col text-center">
                    <span className={`lx-delta-value ${totalDelta >= 0 ? "positive" : "negative"}`}>
                      {totalDelta >= 0 ? "+" : ""}
                      {totalDelta}
                    </span>
                  </div>

                  <div className="lx-table-col lx-col-impact">
                    <div className="lx-bar-container">
                      <div className="lx-bar-track">
                        <div className="lx-bar-fill lx-bar-fill-tertiary" style={{ width: `${percent}%` }} />
                      </div>
                      <span className="lx-bar-label">{percent.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
