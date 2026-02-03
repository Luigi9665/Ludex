import React from "react";

/**
 * Nota per me futuro:
 * - Mostra i generi più "spinti" dalle regole del questionario.
 * - Dati dal backend (PreferenceAggregateDto):
 *   Id, Name, EffectsCount, TotalDelta, QuestionsCount, WeightSharePercent, ecc.
 * - "Regole": quante regole del questionario usano questo genere.
 * - "Somma pesi": somma dei DeltaWeight (può essere positiva o negativa).
 * - "Peso relativo": quanto pesa il genere rispetto agli altri (0–100%).
 */
export default function GenresImpactCard({ genres }) {
  // Fallback se il prop non è ancora valorizzato
  const safeGenres = Array.isArray(genres) ? genres : [];

  // Ordino per WeightSharePercent desc e prendo i primi 8
  const topGenres = [...safeGenres].sort((a, b) => (b.WeightSharePercent || 0) - (a.WeightSharePercent || 0)).slice(0, 8);

  const hasData = topGenres.length > 0;

  return (
    <div className="lx-chart-card">
      <div className="lx-chart-card-header">
        <h3 className="lx-chart-card-title">
          <i className="bi bi-collection me-2" />
          Generi più influenzati
        </h3>
        <span className="lx-chart-card-subtitle">Quanto ogni genere viene spinto dalle regole del questionario.</span>
      </div>

      <div className="lx-chart-card-body">
        {hasData && (
          <p className="text-white-50 small mb-3">
            <strong>Genere</strong> = nome del genere. <strong>Regole</strong> = quante regole lo usano. <strong>Somma pesi</strong> = somma dei delta (+/‑).{" "}
            <strong>Peso relativo</strong> = impatto rispetto agli altri generi.
          </p>
        )}

        {!hasData && <p className="text-white-50 small mb-0">Nessun dato disponibile sui generi al momento.</p>}

        {hasData && (
          <div className="lx-table-admin">
            <div className="lx-table-header">
              <div className="lx-table-col">Genere</div>
              <div className="lx-table-col text-center">Regole</div>
              <div className="lx-table-col text-center">Somma pesi</div>
              <div className="lx-table-col text-center">Peso relativo</div>
            </div>

            {topGenres.map((genre) => {
              const totalDelta = genre.TotalDelta || 0;
              // Clamp percent tra 0 e 100 per sicurezza
              const rawPercent = Number(genre.WeightSharePercent) || 0;
              const percent = Math.max(0, Math.min(100, rawPercent));

              return (
                <div key={genre.Id} className="lx-table-row">
                  <div className="lx-table-col">
                    <span className="lx-entity-name">{genre.Name}</span>
                    <span className="lx-entity-meta">{genre.QuestionsCount} domande</span>
                  </div>

                  <div className="lx-table-col text-center">
                    <span className="lx-badge-soft">{genre.EffectsCount}</span>
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
                        <div className="lx-bar-fill lx-bar-fill-primary" style={{ width: `${percent}%` }} />
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
