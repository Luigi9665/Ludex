import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";

import {
  loadQuestionnaire,
  submitQuestionnaire as submitQuestionnaireAction,
  toggleQuestionnaireOption,
  goToNextQuestionnaireStep,
  goToPrevQuestionnaireStep,
} from "../redux/action";

import { selectCurrentStepQuestions, selectAllSelectedOptionIds, selectIsStepValid } from "../redux/reducer/questionnaireReducer";

import ProgressBar from "../components/Questionnaire/ProgressBar";
import QuestionStep from "../components/Questionnaire/QuestionStep";
import LoadingTransition from "../components/Questionnaire/LoadingTransition";

import styles from "../styles/Questionnaire/QuestionnairePage.module.css";

const QuestionnairePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Nota per me futuro:
  // - Questo ref punta alla parte alta del contenuto del questionario.
  //   Lo uso per riportare lo scroll su quando cambio step.
  const topRef = useRef(null);

  // ============================
  // Stato dal Redux store
  // ============================
  const { questions, currentStep, totalSteps, answersByQuestionId, loading, error, submitting, submitError, completed } = useSelector(
    (state) => state.questionnaire,
  );

  const currentStepQuestions = useSelector(selectCurrentStepQuestions);
  const isStepValid = useSelector(selectIsStepValid);
  const selectedOptionIds = useSelector(selectAllSelectedOptionIds);

  // Stato locale solo per messaggi di errore "di pagina"
  const [localError, setLocalError] = useState(null);

  // ============================
  // Fetch domande dal backend
  // ============================
  useEffect(() => {
    // Nota per me futuro:
    // - Questa chiamata popola questions / totalSteps
    //   dentro questionnaireReducer (QUESTIONNAIRE_SUCCESS).
    dispatch(loadQuestionnaire());
  }, [dispatch]);

  // ============================
  // Redirect dopo submit completato
  // ============================
  useEffect(() => {
    if (completed) {
      // Lascio qualche secondo la schermata "stiamo generando..."
      const timeoutId = setTimeout(() => {
        navigate("/recommendations");
      }, 2000);

      return () => clearTimeout(timeoutId);
    }
  }, [completed, navigate]);

  // ============================
  // Quando cambio step → scroll su in alto
  // ============================
  useEffect(() => {
    if (!topRef.current) return;

    // Nota per me futuro:
    // - porto lo scroll in modo che il titolo + progress bar
    //   siano visibili sotto la navbar.
    const y = topRef.current.offsetTop - (parseInt(getComputedStyle(document.documentElement).getPropertyValue("--lx-navbar-h")) || 70) - 16;

    window.scrollTo({
      top: Math.max(y, 0),
      behavior: "smooth",
    });
  }, [currentStep]);

  // ============================
  // Gestione click su un'opzione
  // ============================
  const handleOptionClick = (questionId, optionId, isMultipleChoice) => {
    dispatch(toggleQuestionnaireOption(questionId, optionId, isMultipleChoice));
    // Appena l'utente cambia qualcosa, tolgo eventuali messaggi di errore
    setLocalError(null);
  };

  // ============================
  // Step successivo
  // ============================
  const handleNext = () => {
    if (!isStepValid) {
      setLocalError("Seleziona almeno un'opzione per continuare");
      return;
    }

    setLocalError(null);
    dispatch(goToNextQuestionnaireStep());
  };

  // ============================
  // Step precedente
  // ============================
  const handlePrev = () => {
    dispatch(goToPrevQuestionnaireStep());
    setLocalError(null);
  };

  // ============================
  // Submit finale del questionario
  // ============================
  const handleSubmit = () => {
    // Nota per me futuro:
    // - Qui controllo solo lo step corrente,
    //   perché la logica degli step precedenti
    //   mi ha già “costretto” a rispondere.
    if (!isStepValid) {
      setLocalError("Completa tutte le domande di questo step prima di scoprire i risultati");
      return;
    }

    if (!selectedOptionIds || selectedOptionIds.length === 0) {
      setLocalError("Seleziona almeno un'opzione prima di inviare");
      return;
    }

    setLocalError(null);
    // Il thunk si occupa di:
    // - settare submitting
    // - chiamare POST /api/Recommendation/questionnaire
    // - settare completed / submitError
    dispatch(submitQuestionnaireAction());
  };

  const isLastStep = totalSteps > 0 && currentStep === totalSteps - 1;
  const hasQuestions = questions && questions.length > 0 && totalSteps > 0;

  // ============================
  // Stati "globali" della pagina
  // ============================

  // Caricamento iniziale mentre prendo le domande
  if (loading && !hasQuestions) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Stiamo preparando le domande per te...</p>
      </div>
    );
  }

  // Errore nel fetch del questionario
  if (error && !hasQuestions) {
    return (
      <div className={styles.errorContainer}>
        <p>Ops! Qualcosa è andato storto nel caricamento del questionario.</p>
        <button onClick={() => dispatch(loadQuestionnaire())}>Riprova</button>
      </div>
    );
  }

  // Se sto inviando o ho appena finito, mostro la schermata "magica"
  if (submitting || completed) {
    return <LoadingTransition message="Stiamo creando la tua esperienza personalizzata..." />;
  }

  // Nessuna domanda dal backend → stato un po' strano, ma lo gestisco
  if (!hasQuestions) {
    return (
      <div className={styles.errorContainer}>
        <p>Al momento non ci sono domande disponibili per il questionario. Riprova più tardi.</p>
      </div>
    );
  }

  // ============================
  // Render normale della pagina
  // ============================
  return (
    <div ref={topRef} className={styles.container}>
      <header className={styles.header}>
        <h1>Scopri i Giochi Perfetti per Te</h1>
        <p className={styles.subtitle}>Rispondi ad alcune domande e ti guideremo verso i giochi che amerai davvero.</p>
      </header>

      <ProgressBar currentStep={currentStep + 1} totalSteps={totalSteps} />

      <QuestionStep questions={currentStepQuestions} answersByQuestionId={answersByQuestionId} onOptionClick={handleOptionClick} />

      {/* Messaggi di errore di validazione / submit */}
      {(localError || submitError) && <div className={styles.errorMessage}>{localError || submitError}</div>}

      {/* Navigazione tra gli step */}
      <div className={styles.navigation}>
        {currentStep > 0 && (
          <button onClick={handlePrev} className={styles.btnSecondary} type="button">
            ← Indietro
          </button>
        )}

        {!isLastStep ? (
          <button onClick={handleNext} className={styles.btnPrimary} type="button" disabled={!isStepValid}>
            Continua →
          </button>
        ) : (
          <button onClick={handleSubmit} className={styles.btnPrimary} type="button" disabled={!isStepValid}>
            🎮 Scopri i Risultati
          </button>
        )}
      </div>
    </div>
  );
};

export default QuestionnairePage;
