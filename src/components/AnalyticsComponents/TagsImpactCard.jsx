import React from "react";

/**
 * Nota per me futuro:
 * - Mostra come i TAG vengono usati nelle regole del questionario.
 * - Ogni riga = un tag:
 *   - Regole: quante regole del questionario lo usano (EffectsCount)
 *   - Delta totale: somma dei DeltaWeight per quel tag
 *   - Peso %: quanto pesa rispetto a tutti gli altri tag
 */
export default function TagsImpactCard({ tags }) {
  const safeTags = Array.isArray(tags) ? tags : [];

  // Ordino per WeightSharePercent desc e prendo i primi 8
  const topTags = [...safeTags].sort((a, b) => (b.WeightSharePercent || 0) - (a.WeightSharePercent || 0)).slice(0, 8);

  const hasData = topTags.length > 0;

  return (
    <div className="lx-chart-card">
      <div className="lx-chart-card-header">
        <h3 className="lx-chart-card-title">
          <i className="bi bi-tags me-2" />
          Tag usati nel questionario
        </h3>
        <span className="lx-chart-card-subtitle">Panoramica dei tag collegati alle regole delle domande</span>
      </div>

      <div className="lx-chart-card-body">
        {hasData && (
          <p className="text-white-50 small mb-3">
            Ogni riga mostra quante <strong>regole</strong> usano il tag, il
            <strong> delta totale</strong> che assegni e il suo <strong>peso percentuale</strong> rispetto agli altri tag.
          </p>
        )}

        {!hasData && <p className="text-white-50 small mb-0">Nessun dato disponibile sui tag al momento.</p>}

        {hasData && (
          <div className="lx-table-admin">
            <div className="lx-table-header">
              <div className="lx-table-col">Nome</div>
              <div className="lx-table-col text-center">Regole</div>
              <div className="lx-table-col text-center">Delta totale</div>
              <div className="lx-table-col text-center">Peso %</div>
            </div>

            {topTags.map((tag) => {
              const totalDelta = tag.TotalDelta || 0;
              const rawPercent = Number(tag.WeightSharePercent) || 0;
              const percent = Math.max(0, Math.min(100, rawPercent));

              return (
                <div key={tag.Id} className="lx-table-row">
                  <div className="lx-table-col">
                    <span className="lx-entity-name">{tag.Name}</span>
                    {tag.Code && <span className="lx-entity-meta">{tag.Code}</span>}
                  </div>

                  <div className="lx-table-col text-center">
                    <span className="lx-badge-soft">{tag.EffectsCount}</span>
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
                        <div className="lx-bar-fill lx-bar-fill-secondary" style={{ width: `${percent}%` }} />
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
