import { RECOMMENDATIONS_REQUEST, RECOMMENDATIONS_SUCCESS, RECOMMENDATIONS_ERROR, RECOMMENDATIONS_LOAD_MORE, RECOMMENDATIONS_RESET } from "../authTypes";

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

    case RECOMMENDATIONS_RESET:
      return initialState;

    default:
      return state;
  }
}
