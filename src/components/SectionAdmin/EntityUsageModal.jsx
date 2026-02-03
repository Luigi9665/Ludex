import React from "react";

/**
 * Modal che mostra dove una entità (Genere/Tag/Metadata) è usata nel questionario.
 *
 * Props:
 * - isOpen: boolean
 * - onClose: () => void
 * - entityName: string
 * - entityType: string ("genere", "tag", "focus", ecc.)
 * - usages: Array<{ questionCode, questionText, optionText, delta }>
 * - loading?: boolean
 * - error?: string | null
 */
export default function EntityUsageModal({ isOpen, onClose, entityName, entityType, usages = [], loading = false, error = null }) {
  if (!isOpen) return null;

  const hasData = Array.isArray(usages) && usages.length > 0;

  return (
    <>
      <div className="lx-modal-backdrop" onClick={onClose} />

      <div className="lx-modal-panel lx-modal-lg">
        <div className="lx-modal-header">
          <h3 className="lx-modal-title">
            <i className="bi bi-list-check me-2" />
            Utilizzi nel questionario
          </h3>
          <button className="lx-modal-close" onClick={onClose}>
            <i className="bi bi-x-lg" />
          </button>
        </div>

        <div className="lx-modal-body">
          <div className="lx-usage-summary mb-3">
            <p className="lx-usage-entity-info">
              <strong>{entityType}:</strong> {entityName}
            </p>

            {!loading && !error && (
              <p className="lx-usage-count">
                Utilizzato in <strong>{usages.length}</strong> opzione
                {usages.length === 1 ? "" : "i"}
              </p>
            )}
          </div>

          {/* Stato: loading */}
          {loading && (
            <div className="lx-loading-container py-4">
              <div className="lx-spinner" />
              <p className="lx-loading-text">Caricamento utilizzi...</p>
            </div>
          )}

          {/* Stato: errore */}
          {!loading && error && (
            <div className="lx-alert lx-alert-error">
              <i className="bi bi-exclamation-triangle me-2" />
              {error}
            </div>
          )}

          {/* Stato: nessun dato */}
          {!loading && !error && !hasData && (
            <div className="lx-empty-state mt-3">
              <i className="bi bi-inbox lx-empty-icon" />
              <p className="lx-empty-text">Questo {entityType} non è attualmente utilizzato nel questionario.</p>
            </div>
          )}

          {/* Stato: dati presenti */}
          {!loading && !error && hasData && (
            <div className="lx-usage-list mt-2">
              {usages.map((usage, idx) => (
                <div key={idx} className="lx-usage-item">
                  <div className="lx-usage-question">
                    <span className="lx-usage-question-code">{usage.questionCode}</span>
                    <span className="lx-usage-question-text">{usage.questionText}</span>
                  </div>

                  <div className="lx-usage-option">
                    <i className="bi bi-arrow-return-right me-2" />
                    <span className="lx-usage-option-text">{usage.optionText}</span>
                  </div>

                  <div className="lx-usage-delta">
                    <span className={`lx-delta-value ${(usage.delta ?? 0) >= 0 ? "positive" : "negative"}`}>
                      Delta: {(usage.delta ?? 0) >= 0 ? "+" : ""}
                      {usage.delta ?? 0}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="lx-modal-footer">
          <button className="lx-btn lx-btn-outline" onClick={onClose}>
            Chiudi
          </button>
        </div>
      </div>
    </>
  );
}
