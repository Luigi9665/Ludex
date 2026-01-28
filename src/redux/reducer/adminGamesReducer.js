import { ADMIN_GAMES_REQUEST, ADMIN_GAMES_SUCCESS, ADMIN_GAMES_ERROR } from "../authTypes";

// Nota per me futuro:
// questo slice è SOLO per l'area admin -> lista giochi
// tiene dentro:
// - items: la pagina corrente di giochi
// - paginazione (page, pageSize, totalItems)
// - searchTerm: testo ricerca corrente
// - loading/error per mostrare loader e messaggi
const initialState = {
  items: [],
  page: 1,
  pageSize: 20,
  totalItems: 0,
  searchTerm: "",
  loading: false,
  error: null,
};

export default function adminGamesReducer(state = initialState, action) {
  switch (action.type) {
    case ADMIN_GAMES_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case ADMIN_GAMES_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        items: action.payload?.items || [],
        page: action.payload?.page ?? state.page,
        pageSize: action.payload?.pageSize ?? state.pageSize,
        totalItems: action.payload?.totalItems ?? state.totalItems,
        // salvo anche il termine di ricerca che ho usato per questa chiamata
        searchTerm: action.payload?.searchTerm ?? state.searchTerm,
      };

    case ADMIN_GAMES_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
}
