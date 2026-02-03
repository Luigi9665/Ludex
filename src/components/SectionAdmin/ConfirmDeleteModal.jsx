import React from "react";

/**
 * Nota per me futuro:
 * - Modal di conferma eliminazione riutilizzabile.
 * - Non fa chiamate API: il genitore passa onConfirm che si occupa di tutto.
 */
export default function ConfirmDeleteModal({ isOpen, onClose, onConfirm, entityName, entityType, warningMessage }) {
  if (!isOpen) return null;

  return (
    <>
      <div className="lx-modal-backdrop" onClick={onClose}></div>

      <div className="lx-modal-panel lx-modal-sm">
        <div className="lx-modal-header lx-modal-danger">
          <h3 className="lx-modal-title">
            <i className="bi bi-exclamation-triangle me-2" />
            Conferma eliminazione
          </h3>
          <button className="lx-modal-close" onClick={onClose}>
            <i className="bi bi-x-lg" />
          </button>
        </div>

        <div className="lx-modal-body">
          <p className="lx-confirm-message">
            Sei sicuro di voler eliminare {entityType} <strong>{entityName}</strong>?
          </p>

          {warningMessage && (
            <div className="lx-alert lx-alert-warning mt-3">
              <i className="bi bi-exclamation-triangle me-2" />
              {warningMessage}
            </div>
          )}

          <p className="lx-confirm-note mt-3">Questa azione non può essere annullata.</p>
        </div>

        <div className="lx-modal-footer">
          <button className="lx-btn lx-btn-outline" onClick={onClose}>
            Annulla
          </button>
          <button className="lx-btn lx-btn-danger" onClick={onConfirm}>
            <i className="bi bi-trash me-2" />
            Elimina
          </button>
        </div>
      </div>
    </>
  );
}
