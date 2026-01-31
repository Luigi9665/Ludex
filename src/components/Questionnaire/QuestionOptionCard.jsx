// Nota per me futuro:
// - Questa è la "card" per una singola opzione del questionario.
// - Non ha stato interno: lo stato (selected / non selected) arriva dai parent.
// - isMultiChoice = true  → stile checkbox (toggle)
// - isMultiChoice = false → stile radio (solo una per domanda)
//
// Props:
// - option: { id, textIt, ... }
// - isSelected: bool → decide lo stile
// - isMultiChoice: bool → cambia solo l'iconcina a sinistra
// - onClick: function → viene chiamata quando l'utente clicca la card

import styles from "../../styles/Questionnaire/QuestionOptionCard.module.css";

const QuestionOptionCard = ({ option, isSelected, isMultiChoice, onClick }) => {
  if (!option) return null;

  const cardClassName = [styles.card, isSelected ? styles.selected : ""].join(" ");

  return (
    <button
      type="button"
      className={cardClassName}
      onClick={onClick}
      // Nota per me futuro:
      // - aria-pressed aiuta gli screen reader a capire che è "toggle"
      aria-pressed={isSelected}
    >
      <div className={styles.indicator}>
        {isMultiChoice ? (
          // Checkbox style
          <div className={styles.checkbox}>{isSelected && <span className={styles.checkmark}>✓</span>}</div>
        ) : (
          // Radio style
          <div className={styles.radio}>{isSelected && <div className={styles.radioDot}></div>}</div>
        )}
      </div>

      <div className={styles.textWrapper}>
        <span className={styles.optionText}>{option.textIt}</span>
      </div>
    </button>
  );
};

export default QuestionOptionCard;
