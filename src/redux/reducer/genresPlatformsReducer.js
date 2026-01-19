import { GENRES_ERROR, GENRES_REQUEST, GENRES_SUCCESS, PLATFORMS_ERROR, PLATFORMS_REQUEST, PLATFORMS_SUCCESS } from "../authTypes";

const initialState = {
  genres: { items: [], loading: false, error: null },
  platforms: { items: [], loading: false, error: null },
};

export default function genresPlatformsReducer(state = initialState, action) {
  switch (action.type) {
    case GENRES_REQUEST:
      return { ...state, genres: { ...state.genres, loading: true, error: null } };
    case GENRES_SUCCESS:
      return { ...state, genres: { items: action.payload || [], loading: false, error: null } };
    case GENRES_ERROR:
      return { ...state, genres: { ...state.genres, loading: false, error: action.payload } };

    case PLATFORMS_REQUEST:
      return { ...state, platforms: { ...state.platforms, loading: true, error: null } };
    case PLATFORMS_SUCCESS:
      return { ...state, platforms: { items: action.payload || [], loading: false, error: null } };
    case PLATFORMS_ERROR:
      return { ...state, platforms: { ...state.platforms, loading: false, error: action.payload } };

    default:
      return state;
  }
}
