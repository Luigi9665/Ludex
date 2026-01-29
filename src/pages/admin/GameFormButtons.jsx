import React from "react";

/**
 * Pulsanti footer (indietro / avanti / salva)
 */
const GameFormButtons = ({ currentStep, totalSteps, onPrevious, onNext, onSave, isSaving = false, isNextDisabled = false }) => {
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  return (
    <div className="lx-form-buttons">
      <div className="d-flex justify-content-between align-items-center">
        <div>
          {!isFirstStep && (
            <button type="button" className="btn btn-outline-secondary lx-btn-back" onClick={onPrevious} disabled={isSaving}>
              <i className="bi bi-arrow-left me-2" />
              Indietro
            </button>
          )}
        </div>

        <div>
          {isLastStep ? (
            <button type="button" className="btn btn-success lx-btn-save" onClick={onSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                  Salvataggio...
                </>
              ) : (
                <>
                  <i className="bi bi-check-lg me-2" />
                  Salva gioco
                </>
              )}
            </button>
          ) : (
            <button type="button" className="btn btn-primary lx-btn-next" onClick={onNext} disabled={isNextDisabled || isSaving}>
              Avanti
              <i className="bi bi-arrow-right ms-2" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameFormButtons;
