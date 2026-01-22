import { GAME_DETAIL_ERROR, GAME_DETAIL_REQUEST, GAME_DETAIL_SUCCESS } from "../authTypes";

const initaliState = {
  loading: false,
  error: null,
  game: null,
  related: [],
};

export default function gameDetailReducer(state = initaliState, action) {
  switch (action.type) {
    case GAME_DETAIL_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case GAME_DETAIL_SUCCESS:
      return {
        ...state,
        loading: false,
        game: action.payload.game,
        related: action.payload.related || [],
      };
    case GAME_DETAIL_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
        game: null,
        related: null,
      };
    default:
      return state;
  }
}
