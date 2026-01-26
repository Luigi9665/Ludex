import React from "react";
import ReactDOM from "react-dom";

const ConfirmDialog = ({ open, title, message, confirmLabel = "Conferma", cancelLabel = "Annulla", onConfirm, onCancel, loading = false }) => {
  if (!open) return null;

  const handleConfirm = () => {
    if (!loading && onConfirm) onConfirm();
  };

  const handleCancel = () => {
    if (!loading && onCancel) onCancel();
  };

  const content = (
    <div className="lx-confirm-overlay">
      <div className="lx-confirm-backdrop" onClick={handleCancel} />
      <div className="lx-confirm-card" role="dialog" aria-modal="true" aria-labelledby="lx-confirm-title">
        <h4 id="lx-confirm-title" className="lx-confirm-title">
          {title}
        </h4>

        {message && <p className="lx-confirm-message">{message}</p>}

        <div className="lx-confirm-actions">
          <button type="button" className="btn btn-sm btn-outline-secondary" onClick={handleCancel} disabled={loading}>
            {cancelLabel}
          </button>
          <button type="button" className="btn btn-sm btn-danger" onClick={handleConfirm} disabled={loading}>
            {loading && <span className="lx-btn-spinner me-2" aria-hidden="true" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );

  const target = document.body || document.getElementById("root");
  return ReactDOM.createPortal(content, target);
};

export default ConfirmDialog;
