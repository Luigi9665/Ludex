/**
 * Nota per me futuro:
 * - Card singola KPI con:
 *   - title: etichetta ("Generi coperti")
 *   - value: valore principale ("26 su 30")
 *   - subtitle: testino sotto ("Copertura 87%")
 * - trend per ora non usato, ma lasciato per eventuali confronti periodo vs periodo.
 */
export default function KpiCard({ title, value, subtitle, icon, trend }) {
  const hasTrend = typeof trend === "number" && !Number.isNaN(trend);

  return (
    <div className="lx-kpi-card">
      <div className="lx-kpi-icon-wrapper">
        <i className={`bi ${icon} lx-kpi-icon`} />
      </div>

      <div className="lx-kpi-content">
        <div className="lx-kpi-label text-truncate">{title}</div>
        <div className="lx-kpi-value">{value}</div>

        {subtitle && <div className="lx-kpi-subtext">{subtitle}</div>}

        {hasTrend && (
          <div className={`lx-kpi-trend ${trend > 0 ? "positive" : trend < 0 ? "negative" : "neutral"}`}>
            <i className={`bi ${trend > 0 ? "bi-arrow-up" : trend < 0 ? "bi-arrow-down" : "bi-dot"}`} />
            {Math.abs(trend)}%
          </div>
        )}
      </div>
    </div>
  );
}
