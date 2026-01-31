// Nota per me futuro:
// - Questo componente rappresenta UNA domanda del questionario.
// - Non ha logica di stato interna: riceve già tutto dai parent.
// - "question" contiene: id, textIt, isMultipleChoice, options[]
// - "selectedIds" è l'array degli ID opzione selezionati per questa domanda.
// - "onSelect" riceve l'ID dell'opzione cliccata.
// - Uso forwardRef per poter scrollare il blocco dall'esterno (QuestionStep).
import React from "react";
import QuestionOptionCard from "../Questionnaire/QuestionOptionCard";
import styles from "../../styles/Questionnaire/QuestionBlock.module.css";

const QuestionBlock = React.forwardRef(({ question, selectedIds, onSelect }, ref) => {
  if (!question) {
    // Se mai dovessi vedere questo, qualcosa è andato molto storto lato parent.
    return null;
  }

  const { textIt, isMultipleChoice, options } = question;

  return (
    <section ref={ref} className={styles.questionBlock}>
      <header className={styles.header}>
        <h2 className={styles.title}>{textIt}</h2>
        <p className={styles.hint}>{isMultipleChoice ? "Puoi selezionare più opzioni" : "Seleziona una sola opzione"}</p>
      </header>

      <div className={styles.optionsGrid}>
        {options && options.length > 0 ? (
          options.map((option) => (
            <QuestionOptionCard
              key={option.id}
              option={option}
              // Nota per me futuro:
              // - selectedIds è un array di int → uso includes per capire se è attiva.
              isSelected={selectedIds.includes(option.id)}
              isMultiChoice={isMultipleChoice}
              onClick={() => onSelect(option.id)}
            />
          ))
        ) : (
          <p className={styles.noOptions}>Nessuna opzione disponibile per questa domanda.</p>
        )}
      </div>
    </section>
  );
});

export default QuestionBlock;
