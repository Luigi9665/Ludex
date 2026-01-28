// redux/reducer/genresPlatformsReducer.js
import {
  GENRES_ERROR,
  GENRES_REQUEST,
  GENRES_SUCCESS,
  PLATFORMS_ERROR,
  PLATFORMS_REQUEST,
  PLATFORMS_SUCCESS,
  METADATA_REQUEST,
  METADATA_SUCCESS,
  METADATA_ERROR,
} from "../authTypes";

const initialState = {
  genres: { items: [], loading: false, error: null },
  platforms: { items: [], loading: false, error: null },
  metadata: {
    focuses: { items: [], loading: false, error: null },
    moods: { items: [], loading: false, error: null },
    difficulties: { items: [], loading: false, error: null },
    tags: { items: [], loading: false, error: null },
  },
};

export default function genresPlatformsReducer(state = initialState, action) {
  switch (action.type) {
    case GENRES_REQUEST:
      return {
        ...state,
        genres: { ...state.genres, loading: true, error: null },
      };
    case GENRES_SUCCESS:
      return {
        ...state,
        genres: { items: action.payload || [], loading: false, error: null },
      };
    case GENRES_ERROR:
      return {
        ...state,
        genres: { ...state.genres, loading: false, error: action.payload },
      };

    case PLATFORMS_REQUEST:
      return {
        ...state,
        platforms: { ...state.platforms, loading: true, error: null },
      };
    case PLATFORMS_SUCCESS:
      return {
        ...state,
        platforms: { items: action.payload || [], loading: false, error: null },
      };
    case PLATFORMS_ERROR:
      return {
        ...state,
        platforms: { ...state.platforms, loading: false, error: action.payload },
      };

    // 👇 nuova parte per i metadata
    case METADATA_REQUEST:
      return {
        ...state,
        metadata: {
          focuses: { ...state.metadata.focuses, loading: true, error: null },
          moods: { ...state.metadata.moods, loading: true, error: null },
          difficulties: {
            ...state.metadata.difficulties,
            loading: true,
            error: null,
          },
          tags: { ...state.metadata.tags, loading: true, error: null },
        },
      };
    case METADATA_SUCCESS:
      return {
        ...state,
        metadata: {
          focuses: {
            items: action.payload.focuses || [],
            loading: false,
            error: null,
          },
          moods: {
            items: action.payload.moods || [],
            loading: false,
            error: null,
          },
          difficulties: {
            items: action.payload.difficulties || [],
            loading: false,
            error: null,
          },
          tags: {
            items: action.payload.tags || [],
            loading: false,
            error: null,
          },
        },
      };
    case METADATA_ERROR:
      return {
        ...state,
        metadata: {
          focuses: {
            ...state.metadata.focuses,
            loading: false,
            error: action.payload,
          },
          moods: {
            ...state.metadata.moods,
            loading: false,
            error: action.payload,
          },
          difficulties: {
            ...state.metadata.difficulties,
            loading: false,
            error: action.payload,
          },
          tags: {
            ...state.metadata.tags,
            loading: false,
            error: action.payload,
          },
        },
      };

    default:
      return state;
  }
}
