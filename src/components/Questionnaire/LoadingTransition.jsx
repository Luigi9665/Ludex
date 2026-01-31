// Nota per me futuro:
// - Schermata usata sia dopo il submit del questionario
//   sia quando carico raccomandazioni.
// - Grafica "console sci-fi" con glow e particelle.

import styles from "../../styles/Questionnaire/LoadingTransition.module.css";

const LoadingTransition = ({ message }) => {
  return (
    <div className={styles.container}>
      {/* glow di sfondo */}
      <div className={styles.glowLayer} />

      {/* particelle decorative */}
      <div className={styles.particles}>
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>

      <div className={styles.card}>
        {/* orb centrale animato */}
        <div className={styles.orbitWrapper}>
          <div className={styles.orbitCore} />
          <div className={`${styles.orbitRing} ${styles.orbitRingOne}`} />
          <div className={`${styles.orbitRing} ${styles.orbitRingTwo}`} />
          <div className={`${styles.orbitRing} ${styles.orbitRingThree}`} />
        </div>

        <h2 className={styles.message}>{message}</h2>

        <p className={styles.subtext}>Analizzando le tue preferenze e cercando i match perfetti tra migliaia di titoli…</p>

        {/* barra di "calcolo" finta */}
        <div className={styles.progressShell}>
          <div className={styles.progressTrack}>
            <div className={styles.progressFill} />
          </div>
          <div className={styles.progressLabels}>
            <span>Profilo giocatore</span>
            <span>Generi &amp; tag</span>
            <span>Match finale</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingTransition;
