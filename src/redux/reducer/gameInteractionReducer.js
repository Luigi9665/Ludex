import { MARK_GAME_VIEWED_REQUEST, MARK_GAME_VIEWED_SUCCESS, MARK_GAME_VIEWED_FAIL, MARK_GAME_VIEWED_CLEAR } from "../authTypes";

const initialState = {
  loadingViewed: false,
  errorViewed: null,
  lastViewedGameId: null,
  lastViewedAt: null,
};

export default function gameInteractionReducer(state = initialState, action) {
  switch (action.type) {
    case MARK_GAME_VIEWED_REQUEST:
      return {
        ...state,
        loadingViewed: true,
        errorViewed: null,
      };

    case MARK_GAME_VIEWED_SUCCESS:
      return {
        ...state,
        loadingViewed: false,
        errorViewed: null,
        lastViewedGameId: action.payload?.gameId ?? null,
        lastViewedAt: action.payload?.timestamp ?? null,
      };

    case MARK_GAME_VIEWED_FAIL:
      return {
        ...state,
        loadingViewed: false,
        errorViewed: action.payload || "Errore durante la registrazione della visualizzazione.",
      };

    case MARK_GAME_VIEWED_CLEAR:
      return initialState;

    default:
      return state;
  }
}
