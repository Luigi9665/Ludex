// Nota per me futuro:
// - Questo componente NON gestisce più lo scroll.
// - Lo scroll tra gli step è gestito centralmente in QuestionnairePage,
//   usando currentStep e la navbar height.
// - Qui mi limito solo a mostrare le domande dello step corrente.

import QuestionBlock from "../Questionnaire/QuestionBlock";
import styles from "../../styles/Questionnaire/QuestionStep.module.css";

const QuestionStep = ({ questions, answersByQuestionId, onOptionClick }) => {
  if (!questions || questions.length === 0) {
    return (
      <div className={styles.emptyStep}>
        <p>Nessuna domanda per questo step.</p>
      </div>
    );
  }

  return (
    <div className={styles.stepContainer}>
      {questions.map((question) => (
        <QuestionBlock
          key={question.id}
          question={question}
          // Nota per me futuro:
          // - answersByQuestionId è una mappa: { [questionId]: number[] }
          // - se non ho ancora risposte per questa domanda → array vuoto
          selectedIds={answersByQuestionId[question.id] || []}
          onSelect={(optionId) => onOptionClick(question.id, optionId, question.isMultipleChoice)}
        />
      ))}
    </div>
  );
};

export default QuestionStep;
