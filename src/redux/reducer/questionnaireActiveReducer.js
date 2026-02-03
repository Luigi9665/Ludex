import {
  QUESTIONNAIRE_ACTIVE_FETCH_REQUEST,
  QUESTIONNAIRE_ACTIVE_FETCH_SUCCESS,
  QUESTIONNAIRE_ACTIVE_FETCH_FAILURE,
  QUESTIONNAIRE_ACTIVE_TOGGLE_REQUEST,
  QUESTIONNAIRE_ACTIVE_TOGGLE_SUCCESS,
  QUESTIONNAIRE_ACTIVE_TOGGLE_FAILURE,
} from "../authTypes";

const initialState = {
  overview: null, // QuestionActiveOverviewDto pieno
  loading: false,
  error: null,
  togglingById: {}, // es. { 1: true, 5: false }
};

/**
 * Nota per me futuro:
 * - overview arriva direttamente da /api/QuestionnaireAdmin/questions/active-overview
 * - Non manipolo il contenuto: lo passo ai componenti React così com’è.
 * - togglingById mi serve per mostrare loader sullo switch di una singola domanda.
 */
export default function questionnaireActiveReducer(state = initialState, action) {
  switch (action.type) {
    case QUESTIONNAIRE_ACTIVE_FETCH_REQUEST:
      return { ...state, loading: true, error: null };

    case QUESTIONNAIRE_ACTIVE_FETCH_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        overview: action.payload || null, // payload = QuestionActiveOverviewDto
        togglingById: {}, // reset eventuali toggle in corso
      };

    case QUESTIONNAIRE_ACTIVE_FETCH_FAILURE:
      return { ...state, loading: false, error: action.payload || "Errore nel caricamento delle domande attive." };

    // =========================
    // TOGGLE ATTIVA / DISATTIVA
    // =========================

    case QUESTIONNAIRE_ACTIVE_TOGGLE_REQUEST: {
      const questionId = action.payload;
      return {
        ...state,
        togglingById: { ...state.togglingById, [questionId]: true },
      };
    }

    case QUESTIONNAIRE_ACTIVE_TOGGLE_SUCCESS: {
      const { questionId, isActive } = action.payload || {};

      // Se per qualche motivo non ho l’overview, non faccio crashare tutto
      if (!state.overview || !Array.isArray(state.overview.questions)) {
        return {
          ...state,
          togglingById: {
            ...state.togglingById,
            [questionId]: false,
          },
        };
      }

      return {
        ...state,
        overview: {
          ...state.overview,
          questions: state.overview.questions.map((q) => (q.id === questionId ? { ...q, isActive } : q)),
        },
        togglingById: {
          ...state.togglingById,
          [questionId]: false,
        },
      };
    }

    case QUESTIONNAIRE_ACTIVE_TOGGLE_FAILURE: {
      const questionId = action.payload?.questionId;
      if (!questionId) return state;

      const { [questionId]: _, ...rest } = state.togglingById;

      return {
        ...state,
        togglingById: rest,
        error: action.payload?.message || "Errore nel cambio stato domanda.",
      };
    }

    default:
      return state;
  }
}
