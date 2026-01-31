import styles from "../../styles/Recommendations/PreferenceSummaryBox.module.css";

const PreferenceSummaryBox = ({ matchedCount }) => {
  if (!matchedCount || matchedCount <= 0) return null;

  return (
    <div className={styles.box}>
      <span className={styles.icon}>🎯</span>
      <span className={styles.text}>
        Colpisce <strong>{matchedCount}</strong> delle tue preferenze
      </span>
    </div>
  );
};

export default PreferenceSummaryBox;
