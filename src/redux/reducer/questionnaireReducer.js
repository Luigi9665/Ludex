import {
  QUESTIONNAIRE_REQUEST,
  QUESTIONNAIRE_SUCCESS,
  QUESTIONNAIRE_ERROR,
  QUESTIONNAIRE_TOGGLE_OPTION,
  QUESTIONNAIRE_NEXT_STEP,
  QUESTIONNAIRE_PREV_STEP,
  QUESTIONNAIRE_SET_SUBMITTING,
  QUESTIONNAIRE_SET_COMPLETED,
  QUESTIONNAIRE_SET_SUBMIT_ERROR,
  QUESTIONNAIRE_RESET,
  QUESTIONNAIRE_STATUS_REQUEST,
  QUESTIONNAIRE_STATUS_SUCCESS,
  QUESTIONNAIRE_STATUS_ERROR,
} from "../authTypes";

// Nota per me futuro:
// - Quante domande mostro per "pagina" del wizard del questionario.
const QUESTIONS_PER_STEP = 3;

const initialState = {
  questions: [], // Domande arrivate dal backend
  loading: false, // Fetch iniziale in corso
  error: null, // Errore sul caricamento domande

  currentStep: 0, // Step corrente (0-based)
  totalSteps: 0, // Numero totale step = ceil(questions.length / QUESTIONS_PER_STEP)

  // Mappa: { [questionId]: [optionId1, optionId2, ...] }
  answersByQuestionId: {},

  submitting: false, // True mentre sto inviando il questionario
  submitError: null, // Messaggio errore submit
  completed: false, // True dopo submit ok

  status: {
    loading: false,
    error: null,
    hasCompletedQuestionnaire: false,
    lastCompletedAtUtc: null,
    hasAnyPreferences: false,
  },
};

export default function questionnaireReducer(state = initialState, action) {
  switch (action.type) {
    // ===============================
    // FETCH DOMANDE
    // ===============================
    case QUESTIONNAIRE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case QUESTIONNAIRE_SUCCESS: {
      const questions = action.payload || [];
      return {
        ...state,
        loading: false,
        error: null,
        questions,
        totalSteps: Math.ceil(questions.length / QUESTIONS_PER_STEP),
        currentStep: 0,
        // NON resetto per forza le risposte qui,
        // ma per il first load è comunque vuoto.
        answersByQuestionId: {},
      };
    }

    case QUESTIONNAIRE_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload || "Errore durante il caricamento del questionario.",
      };

    // ===============================
    // INTERAZIONE UTENTE (risposte)
    // ===============================
    case QUESTIONNAIRE_TOGGLE_OPTION: {
      const { questionId, optionId, isMultipleChoice } = action.payload;

      const currentAnswers = state.answersByQuestionId[questionId] || [];
      let newAnswers;

      if (isMultipleChoice) {
        // Multi-choice → toggle in array
        if (currentAnswers.includes(optionId)) {
          newAnswers = currentAnswers.filter((id) => id !== optionId);
        } else {
          newAnswers = [...currentAnswers, optionId];
        }
      } else {
        // Single choice → sovrascrivo con un solo valore
        newAnswers = [optionId];
      }

      return {
        ...state,
        answersByQuestionId: {
          ...state.answersByQuestionId,
          [questionId]: newAnswers,
        },
      };
    }

    // ===============================
    // NAVIGAZIONE STEP
    // ===============================
    case QUESTIONNAIRE_NEXT_STEP: {
      const next = state.currentStep + 1;
      if (next >= state.totalSteps) return state;
      return {
        ...state,
        currentStep: next,
      };
    }

    case QUESTIONNAIRE_PREV_STEP: {
      const prev = state.currentStep - 1;
      if (prev < 0) return state;
      return {
        ...state,
        currentStep: prev,
      };
    }

    // ===============================
    // SUBMIT STATO
    // ===============================
    case QUESTIONNAIRE_SET_SUBMITTING:
      return {
        ...state,
        submitting: action.payload,
        submitError: null,
      };

    case QUESTIONNAIRE_SET_COMPLETED:
      return {
        ...state,
        completed: true,
        submitting: false,
      };

    case QUESTIONNAIRE_SET_SUBMIT_ERROR:
      return {
        ...state,
        submitError: action.payload,
        submitting: false,
      };

    case QUESTIONNAIRE_RESET:
      return initialState;

    case QUESTIONNAIRE_STATUS_REQUEST:
      return {
        ...state,
        status: {
          ...state.status,
          loading: true,
          error: null,
        },
      };

    case QUESTIONNAIRE_STATUS_SUCCESS:
      return {
        ...state,
        status: {
          loading: false,
          error: null,
          hasCompletedQuestionnaire: action.payload.hasCompletedQuestionnaire,
          lastCompletedAtUtc: action.payload.lastCompletedAtUtc,
          hasAnyPreferences: action.payload.hasAnyPreferences,
        },
      };

    case QUESTIONNAIRE_STATUS_ERROR:
      return {
        ...state,
        status: {
          ...state.status,
          loading: false,
          error: action.payload,
        },
      };

    default:
      return state;
  }
}

/* ============================
   SELECTORS
   Nota per me futuro:
   - I selector lavorano sullo state globale Redux.
   - Li uso nei component con useSelector(state => ...)
============================ */

const selectQuestionnaireState = (state) => state.questionnaire;

// Domande dello step corrente
export const selectCurrentStepQuestions = (state) => {
  const { questions, currentStep } = selectQuestionnaireState(state);
  const start = currentStep * QUESTIONS_PER_STEP;
  const end = start + QUESTIONS_PER_STEP;
  return questions.slice(start, end);
};

// Tutti gli optionId selezionati → payload per il POST
export const selectAllSelectedOptionIds = (state) => {
  const { answersByQuestionId } = selectQuestionnaireState(state);
  return Object.values(answersByQuestionId).flat();
};

// True se TUTTE le domande dello step corrente hanno almeno una risposta
export const selectIsStepValid = (state) => {
  const { answersByQuestionId } = selectQuestionnaireState(state);
  const currentQuestions = selectCurrentStepQuestions(state);

  return currentQuestions.every((q) => {
    const answers = answersByQuestionId[q.id];
    return answers && answers.length > 0;
  });
};
