import {
  RECOMMENDATIONS_REQUEST,
  RECOMMENDATIONS_SUCCESS,
  RECOMMENDATIONS_ERROR,
  RECOMMENDATIONS_LOAD_MORE,
  RECOMMENDATIONS_RESET,
  RECOMMENDATION_REMOVE_LOCAL,
  RECOMMENDATION_INTEREST_REQUEST,
  RECOMMENDATION_INTEREST_SUCCESS,
  RECOMMENDATION_INTEREST_ERROR,
  RECOMMENDATION_NOT_INTEREST_REQUEST,
  RECOMMENDATION_NOT_INTEREST_SUCCESS,
  RECOMMENDATION_NOT_INTEREST_ERROR,
  RECOMMENDATION_CLEAR_FEEDBACK,
} from "../authTypes";

// Nota per me futuro:
// - items = TUTTI i giochi raccomandati restituiti dal backend (una sola chiamata).
// - page/pageSize = quante card mostro per "blocchi" (es. 6 alla volta).
// - visibleCount = quante card sto mostrando ora (page * pageSize).

const initialState = {
  items: [],
  loading: false,
  error: null,
  page: 1,
  pageSize: 6,

  pendingByGameId: {}, // { [gameId]: "interested" | "not_interested" }
  lastActionMessage: null,
  lastActionError: null,
};

export default function recommendationReducer(state = initialState, action) {
  switch (action.type) {
    case RECOMMENDATIONS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case RECOMMENDATIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        items: action.payload || [],
        page: 1, // ricomincio sempre dalla prima "pagina" visibile
      };

    case RECOMMENDATIONS_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload || "Errore nel caricamento delle raccomandazioni.",
      };

    case RECOMMENDATIONS_LOAD_MORE:
      return {
        ...state,
        page: state.page + 1,
      };

    case RECOMMENDATION_REMOVE_LOCAL: {
      const gameId = action.payload;
      return {
        ...state,
        items: state.items.filter((g) => g.gameId !== gameId),
        // pulizia pending se presente
        pendingByGameId: Object.fromEntries(Object.entries(state.pendingByGameId).filter(([k]) => k !== String(gameId))),
      };
    }

    // ===== Interested =====
    case RECOMMENDATION_INTEREST_REQUEST: {
      const { gameId } = action.payload;
      return {
        ...state,
        lastActionMessage: null,
        pendingByGameId: { ...state.pendingByGameId, [gameId]: "interested" },
      };
    }
    case RECOMMENDATION_INTEREST_SUCCESS: {
      const { gameId, message } = action.payload;
      const nextPending = { ...state.pendingByGameId };
      delete nextPending[gameId];

      return {
        ...state,
        lastActionMessage: message || "Aggiunto al backlog.",
        lastActionError: null,
        pendingByGameId: nextPending,
        // NB: la rimozione la facciamo con RECOMMENDATION_REMOVE_LOCAL
      };
    }
    case RECOMMENDATION_INTEREST_ERROR: {
      const { gameId, error } = action.payload;
      const nextPending = { ...state.pendingByGameId };
      delete nextPending[gameId];

      return {
        ...state,
        lastActionMessage: null,
        lastActionError: error || "Errore durante l'operazione.",
        pendingByGameId: nextPending,
      };
    }

    // ===== Not Interested =====
    case RECOMMENDATION_NOT_INTEREST_REQUEST: {
      const { gameId } = action.payload;
      return {
        ...state,
        lastActionMessage: null,
        pendingByGameId: { ...state.pendingByGameId, [gameId]: "not_interested" },
      };
    }
    case RECOMMENDATION_NOT_INTEREST_SUCCESS: {
      const { gameId, message } = action.payload;
      const nextPending = { ...state.pendingByGameId };
      delete nextPending[gameId];

      return {
        ...state,
        lastActionMessage: message || "Ok, non te lo mostreremo per un po'.",
        lastActionError: null,
        pendingByGameId: nextPending,
      };
    }
    case RECOMMENDATION_NOT_INTEREST_ERROR: {
      const { gameId, error } = action.payload;
      const nextPending = { ...state.pendingByGameId };
      delete nextPending[gameId];

      return {
        ...state,
        lastActionMessage: null,
        lastActionError: error || "Errore durante l'operazione.",
        pendingByGameId: nextPending,
      };
    }

    case RECOMMENDATION_CLEAR_FEEDBACK:
      return {
        ...state,
        lastActionMessage: null,
        lastActionError: null,
      };

    case RECOMMENDATIONS_RESET:
      return initialState;

    default:
      return state;
  }
}
