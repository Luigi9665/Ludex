// src/components/SectionAdmin/AdminImpactTable.jsx
import React from "react";

/**
 * Tabella generica per le pagine admin (Generi, Tag, Metadata).
 * Usa una griglia dinamica basata sulle colonne.
 */
export default function AdminImpactTable({
  title,
  subtitle,
  columns = [],
  rows = [],
  percentField,
  onEdit,
  onDelete,
  onViewUsage,
  headerAction,
  emptyMessage = "Nessun elemento trovato",
}) {
  const renderCellContent = (row, column) => {
    const value = row[column.key];

    switch (column.type) {
      case "badge": {
        const num = Number(value) || 0;
        return <span className="lx-badge-soft">{num}</span>;
      }

      case "pill-active": {
        const isActive = Boolean(value);
        return <span className={`lx-pill ${isActive ? "lx-pill-positive" : "lx-pill-negative"}`}>{isActive ? "Attivo" : "Inattivo"}</span>;
      }

      case "pill-category": {
        const raw = typeof value === "string" ? value.toUpperCase() : "";
        const categoryColors = {
          GENRE: "lx-pill-positive",
          FEATURE: "lx-pill-positive-light",
          EXPERIENCE: "lx-pill-neutral",
        };
        const pillClass = categoryColors[raw] || "lx-pill-neutral";

        return <span className={`lx-pill ${pillClass}`}>{value}</span>;
      }

      case "delta": {
        const num = Number(value) || 0;
        const signClass = num >= 0 ? "positive" : "negative";
        return (
          <span className={`lx-delta-value ${signClass}`}>
            {num >= 0 ? "+" : ""}
            {num}
          </span>
        );
      }

      case "count-with-tooltip": {
        const count = Number(value?.count) || 0;
        const examples = Array.isArray(value?.examples) ? value.examples : [];

        return (
          <div className="lx-count-tooltip-wrapper">
            <span className="lx-count-value">{count}</span>
            {examples.length > 0 && (
              <div className="lx-tooltip-content">
                {examples.slice(0, 3).map((ex, i) => (
                  <div key={i} className="lx-tooltip-item">
                    {ex}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      }

      case "percent-bar": {
        const rawPercent = percentField ? Number(row[percentField]) : Number(value);
        const safePercent = Number.isFinite(rawPercent) ? rawPercent : 0;
        const clamped = Math.max(0, Math.min(100, safePercent));

        return (
          <div className="lx-bar-container">
            <div className="lx-bar-track">
              <div className="lx-bar-fill lx-bar-fill-primary" style={{ width: `${clamped}%` }} />
            </div>
            <span className="lx-bar-label">{clamped.toFixed(1)}%</span>
          </div>
        );
      }

      default:
        return value;
    }
  };

  const hasActions = Boolean(onEdit || onDelete || onViewUsage);

  // es: "2fr 0.8fr 0.8fr 1.5fr"
  const baseTemplate = columns.map((c) => c.width || "1fr").join(" ");
  // se ci sono le azioni, aggiungo una colonna finale
  const fullTemplate = hasActions ? `${baseTemplate} 0.6fr` : baseTemplate;

  // CSS variable consumata dalle classi .lx-admin-table-*
  const gridStyle = { "--lx-grid-template": fullTemplate };

  return (
    <div className="lx-chart-card">
      <div className="lx-chart-card-header d-flex justify-content-between align-items-center">
        <div>
          <h3 className="lx-chart-card-title">{title}</h3>
          {subtitle && <span className="lx-chart-card-subtitle">{subtitle}</span>}
        </div>
        {headerAction && <div className="lx-header-action">{headerAction}</div>}
      </div>

      <div className="lx-chart-card-body">
        {rows.length === 0 ? (
          <div className="lx-empty-state">
            <i className="bi bi-inbox lx-empty-icon" />
            <p className="lx-empty-text">{emptyMessage}</p>
          </div>
        ) : (
          <div className="lx-table-admin">
            {/* HEADER DESKTOP */}
            <div className="lx-table-header lx-admin-table-header d-none d-md-grid" style={gridStyle}>
              {columns.map((col, idx) => (
                <div key={col.key ?? idx} className={`lx-table-col ${col.align ? `text-${col.align}` : ""}`}>
                  {col.label}
                </div>
              ))}
              {hasActions && <div className="lx-table-col text-center">Azioni</div>}
            </div>

            {/* RIGHE */}
            {rows.map((row, rowIdx) => (
              <div key={row.id ?? rowIdx} className="lx-table-row lx-admin-table-row" style={gridStyle}>
                {columns.map((col, colIdx) => (
                  <div key={col.key ?? colIdx} className={`lx-table-col ${col.align ? `text-${col.align}` : ""}`}>
                    {/* Label mobile */}
                    <span className="lx-mobile-label d-md-none">{col.label}:</span>
                    {renderCellContent(row, col)}
                  </div>
                ))}

                {hasActions && (
                  <div className="lx-table-col text-end lx-table-actions">
                    {onViewUsage && (
                      <button type="button" className="lx-btn-table-action" onClick={() => onViewUsage(row)} title="Vedi utilizzi nel questionario">
                        <i className="bi bi-search" />
                      </button>
                    )}
                    {onEdit && (
                      <button type="button" className="lx-btn-table-action" onClick={() => onEdit(row)} title="Modifica">
                        <i className="bi bi-pencil" />
                      </button>
                    )}
                    {onDelete && (
                      <button type="button" className="lx-btn-table-action lx-btn-danger" onClick={() => onDelete(row)} title="Elimina">
                        <i className="bi bi-trash" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
