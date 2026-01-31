import styles from "../../styles/Recommendations/ReasonsList.module.css";

const ReasonsList = ({ reasons }) => {
  if (!reasons || reasons.length === 0) return null;

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Perché te lo consigliamo:</h3>
      <ul className={styles.list}>
        {reasons.map((reason, index) => (
          <li key={index} className={styles.item}>
            <span className={styles.bullet}>•</span>
            <span>{reason}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReasonsList;
