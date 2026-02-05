import {
  QUESTIONNAIRE_EFFECTS_FETCH_REQUEST,
  QUESTIONNAIRE_EFFECTS_FETCH_SUCCESS,
  QUESTIONNAIRE_EFFECTS_FETCH_FAILURE,
  QUESTIONNAIRE_EFFECTS_CREATE_REQUEST,
  QUESTIONNAIRE_EFFECTS_CREATE_SUCCESS,
  QUESTIONNAIRE_EFFECTS_CREATE_FAILURE,
  QUESTIONNAIRE_EFFECTS_UPDATE_REQUEST,
  QUESTIONNAIRE_EFFECTS_UPDATE_SUCCESS,
  QUESTIONNAIRE_EFFECTS_UPDATE_FAILURE,
  QUESTIONNAIRE_EFFECTS_DELETE_REQUEST,
  QUESTIONNAIRE_EFFECTS_DELETE_SUCCESS,
  QUESTIONNAIRE_EFFECTS_DELETE_FAILURE,
  QUESTIONNAIRE_EFFECTS_SUGGESTIONS_REQUEST,
  QUESTIONNAIRE_EFFECTS_SUGGESTIONS_SUCCESS,
  QUESTIONNAIRE_EFFECTS_SUGGESTIONS_FAILURE,
  QUESTIONNAIRE_EFFECTS_SUGGESTIONS_CLEAR,
} from "../authTypes.js";

/**
 * Nota per me futuro:
 * - State strutturato per optionId.
 *   state.questionnaireEffects = {
 *     byOptionId: {
 *       [optionId]: {
 *         items: QuestionnaireOptionEffectAdminDto[],
 *         loading: boolean,
 *         error: string | null,
 *         saving: boolean,          // true durante create/update
 *         deletingId: number | null // id dell'effetto che sto cancellando
 *       }
 *     },
 *     suggestions: {
 *       loading: boolean,
 *       error: string | null,
 *       data: EntityLinkSuggestionResponseDto | null
 *     }
 *   }
 */

const initialState = {
  byOptionId: {},
  suggestions: {
    loading: false,
    error: null,
    data: null,
  },
};

export default function questionnaireEffectsReducer(state = initialState, action) {
  switch (action.type) {
    // ========= FETCH LISTA EFFETTI PER OPTION =========
    case QUESTIONNAIRE_EFFECTS_FETCH_REQUEST: {
      const { optionId } = action.payload;
      const prev = state.byOptionId[optionId] || {};

      return {
        ...state,
        byOptionId: {
          ...state.byOptionId,
          [optionId]: {
            ...prev,
            loading: true,
            error: null,
          },
        },
      };
    }

    case QUESTIONNAIRE_EFFECTS_FETCH_SUCCESS: {
      const { optionId, effects } = action.payload;

      return {
        ...state,
        byOptionId: {
          ...state.byOptionId,
          [optionId]: {
            items: effects,
            loading: false,
            error: null,
            saving: false,
            deletingId: null,
          },
        },
      };
    }

    case QUESTIONNAIRE_EFFECTS_FETCH_FAILURE: {
      const { optionId, message } = action.payload;
      const prev = state.byOptionId[optionId] || {};

      return {
        ...state,
        byOptionId: {
          ...state.byOptionId,
          [optionId]: {
            ...prev,
            loading: false,
            error: message,
          },
        },
      };
    }

    // ========= CREATE =========
    case QUESTIONNAIRE_EFFECTS_CREATE_REQUEST: {
      const { optionId } = action.payload;
      const prev = state.byOptionId[optionId] || { items: [] };

      return {
        ...state,
        byOptionId: {
          ...state.byOptionId,
          [optionId]: {
            ...prev,
            items: prev.items || [],
            saving: true,
            error: null,
          },
        },
      };
    }

    case QUESTIONNAIRE_EFFECTS_CREATE_SUCCESS: {
      const { optionId, effect } = action.payload;
      const prev = state.byOptionId[optionId] || { items: [] };

      return {
        ...state,
        byOptionId: {
          ...state.byOptionId,
          [optionId]: {
            ...prev,
            items: [...(prev.items || []), effect],
            saving: false,
          },
        },
      };
    }

    case QUESTIONNAIRE_EFFECTS_CREATE_FAILURE: {
      const { optionId, message } = action.payload;
      const prev = state.byOptionId[optionId] || { items: [] };

      return {
        ...state,
        byOptionId: {
          ...state.byOptionId,
          [optionId]: {
            ...prev,
            saving: false,
            error: message,
          },
        },
      };
    }

    // ========= UPDATE =========
    case QUESTIONNAIRE_EFFECTS_UPDATE_REQUEST: {
      const { optionId } = action.payload;
      const prev = state.byOptionId[optionId] || { items: [] };

      return {
        ...state,
        byOptionId: {
          ...state.byOptionId,
          [optionId]: {
            ...prev,
            saving: true,
            error: null,
          },
        },
      };
    }

    case QUESTIONNAIRE_EFFECTS_UPDATE_SUCCESS: {
      const { optionId, effect } = action.payload;
      const prev = state.byOptionId[optionId] || { items: [] };

      return {
        ...state,
        byOptionId: {
          ...state.byOptionId,
          [optionId]: {
            ...prev,
            saving: false,
            items: (prev.items || []).map((e) => (e.id === effect.id ? effect : e)),
          },
        },
      };
    }

    case QUESTIONNAIRE_EFFECTS_UPDATE_FAILURE: {
      const { optionId, message } = action.payload;
      const prev = state.byOptionId[optionId] || { items: [] };

      return {
        ...state,
        byOptionId: {
          ...state.byOptionId,
          [optionId]: {
            ...prev,
            saving: false,
            error: message,
          },
        },
      };
    }

    // ========= DELETE =========
    case QUESTIONNAIRE_EFFECTS_DELETE_REQUEST: {
      const { optionId, effectId } = action.payload;
      const prev = state.byOptionId[optionId] || { items: [] };

      return {
        ...state,
        byOptionId: {
          ...state.byOptionId,
          [optionId]: {
            ...prev,
            deletingId: effectId,
            error: null,
          },
        },
      };
    }

    case QUESTIONNAIRE_EFFECTS_DELETE_SUCCESS: {
      const { optionId, effectId } = action.payload;
      const prev = state.byOptionId[optionId] || { items: [] };

      return {
        ...state,
        byOptionId: {
          ...state.byOptionId,
          [optionId]: {
            ...prev,
            deletingId: null,
            items: (prev.items || []).filter((e) => e.id !== effectId),
          },
        },
      };
    }

    case QUESTIONNAIRE_EFFECTS_DELETE_FAILURE: {
      const { optionId, message } = action.payload;
      const prev = state.byOptionId[optionId] || { items: [] };

      return {
        ...state,
        byOptionId: {
          ...state.byOptionId,
          [optionId]: {
            ...prev,
            deletingId: null,
            error: message,
          },
        },
      };
    }

    // ========= SUGGESTIONS =========
    case QUESTIONNAIRE_EFFECTS_SUGGESTIONS_REQUEST: {
      return {
        ...state,
        suggestions: {
          loading: true,
          error: null,
          data: null,
        },
      };
    }

    case QUESTIONNAIRE_EFFECTS_SUGGESTIONS_SUCCESS: {
      const { data } = action.payload;
      return {
        ...state,
        suggestions: {
          loading: false,
          error: null,
          data,
        },
      };
    }

    case QUESTIONNAIRE_EFFECTS_SUGGESTIONS_FAILURE: {
      const { message } = action.payload;
      return {
        ...state,
        suggestions: {
          loading: false,
          error: message,
          data: null,
        },
      };
    }

    case QUESTIONNAIRE_EFFECTS_SUGGESTIONS_CLEAR: {
      return {
        ...state,
        suggestions: {
          loading: false,
          error: null,
          data: null,
        },
      };
    }

    default:
      return state;
  }
}
