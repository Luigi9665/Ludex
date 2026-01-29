// src/pages/admin/GameFormMessages.jsx
import React, { useEffect } from "react";

const GameFormMessages = ({ successMessage, errorMessage, onDismiss, variant = "inline" }) => {
  // auto-hide dopo 5 secondi se non si interagisce
  useEffect(() => {
    if (!successMessage && !errorMessage) return;
    const id = setTimeout(() => {
      onDismiss && onDismiss();
    }, 5000);
    return () => clearTimeout(id);
  }, [successMessage, errorMessage, onDismiss]);

  if (!successMessage && !errorMessage) return null;

  // Variante TOAST (basso a destra)
  if (variant === "toast") {
    return (
      <div className="lx-toast-container">
        {successMessage && (
          <div className="lx-toast lx-toast-success">
            <i className="bi bi-check-circle-fill me-2" />
            <div className="flex-grow-1">{successMessage}</div>
            <button type="button" className="lx-toast-close" onClick={onDismiss} aria-label="Chiudi">
              <i className="bi bi-x-lg" />
            </button>
          </div>
        )}

        {errorMessage && (
          <div className="lx-toast lx-toast-error">
            <i className="bi bi-exclamation-triangle-fill me-2" />
            <div className="flex-grow-1">{errorMessage}</div>
            <button type="button" className="lx-toast-close" onClick={onDismiss} aria-label="Chiudi">
              <i className="bi bi-x-lg" />
            </button>
          </div>
        )}
      </div>
    );
  }

  // Variante INLINE (classica, se ti serve altrove)
  return (
    <div className="mb-3">
      {successMessage && (
        <div className="alert lx-alert-success d-flex align-items-center justify-content-between">
          <div>
            <i className="bi bi-check-circle-fill me-2" />
            {successMessage}
          </div>
          <button type="button" className="btn-close btn-close-white" onClick={onDismiss} aria-label="Chiudi" />
        </div>
      )}
      {errorMessage && (
        <div className="alert lx-alert-error d-flex align-items-center justify-content-between">
          <div>
            <i className="bi bi-exclamation-triangle-fill me-2" />
            {errorMessage}
          </div>
          <button type="button" className="btn-close btn-close-white" onClick={onDismiss} aria-label="Chiudi" />
        </div>
      )}
    </div>
  );
};

export default GameFormMessages;
