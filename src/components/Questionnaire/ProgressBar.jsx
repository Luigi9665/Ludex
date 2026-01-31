// src/components/Questionnaire/ProgressBar.jsx
// Nota per me futuro:
// - Barra sempre visibile (sticky) subito sotto la navbar.
// - Visual stile "pill" largo, con bordo luminoso.

import styles from "../../styles/Questionnaire/ProgressBar.module.css";

const ProgressBar = ({ currentStep, totalSteps }) => {
  if (!totalSteps || totalSteps <= 0) return null;

  const clampedStep = Math.min(Math.max(currentStep, 1), totalSteps);
  const progressPercentage = (clampedStep / totalSteps) * 100;

  return (
    <div className={styles.progressContainer}>
      <div className={styles.progressInner}>
        <div className={styles.progressLabel}>
          STEP {clampedStep} DI {totalSteps}
        </div>

        <div className={styles.progressBarTrack}>
          <div className={styles.progressBarFill} style={{ width: `${progressPercentage}%` }} />
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
