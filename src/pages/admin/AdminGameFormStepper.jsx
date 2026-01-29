import React from "react";

/**
 * AdminGameFormStepper - Stepper orizzontale per i 3 step del form
 *
 * Props:
 * - currentStep (number 1-3)
 * - completedSteps (number[]) es: [1,2]
 * - onStepClick(stepNumber)
 */
const AdminGameFormStepper = ({ currentStep, completedSteps, onStepClick }) => {
  const steps = [
    { number: 1, title: "Informazioni base", icon: "bi-info-circle" },
    { number: 2, title: "Piattaforme & generi", icon: "bi-grid-3x3" },
    { number: 3, title: "Metadata & tag", icon: "bi-tags" },
  ];

  const getStepClass = (stepNumber) => {
    if (stepNumber === currentStep) return "lx-step-active";
    if (completedSteps.includes(stepNumber)) return "lx-step-completed";
    return "lx-step-inactive";
  };

  const isStepClickable = (stepNumber) => stepNumber <= currentStep;

  return (
    <div className="lx-form-stepper mb-4">
      <div className="d-flex justify-content-between align-items-center">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div
              className={`lx-step-item ${getStepClass(step.number)} ${isStepClickable(step.number) ? "lx-step-clickable" : ""}`}
              onClick={() => isStepClickable(step.number) && onStepClick(step.number)}
              role="button"
              tabIndex={isStepClickable(step.number) ? 0 : -1}
              aria-current={step.number === currentStep ? "step" : undefined}
              onKeyDown={(e) => {
                if (!isStepClickable(step.number)) return;
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onStepClick(step.number);
                }
              }}
            >
              <div className="lx-step-circle">
                {completedSteps.includes(step.number) && step.number !== currentStep ? <i className="bi bi-check-lg" /> : <span>{step.number}</span>}
              </div>

              {/* Desktop: icona + label */}
              <div className="lx-step-content d-none d-md-flex align-items-center">
                <i className={`bi ${step.icon} me-2`} />
                <span className="lx-step-title">{step.title}</span>
              </div>

              {/* Mobile: solo icona */}
              <div className="lx-step-content d-md-none">
                <i className={`bi ${step.icon}`} />
              </div>
            </div>

            {index < steps.length - 1 && <div className={`lx-step-connector ${completedSteps.includes(step.number) ? "lx-connector-completed" : ""}`} />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default AdminGameFormStepper;
