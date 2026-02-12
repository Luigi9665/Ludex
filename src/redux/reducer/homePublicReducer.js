import {
  LATESTREVIEWS_ERROR,
  LATESTREVIEWS_REQUEST,
  LATESTREVIEWS_SUCCESS,
  TOPREVIEWERS_ERROR,
  TOPREVIEWERS_REQUEST,
  TOPREVIEWERS_SUCCESS,
  TRENDING_ERROR,
  TRENDING_REQUEST,
  TRENDING_SUCCESS,
} from "../authTypes";

const initialState = {
  trendingWeeklyGames: {
    items: [],
    loading: false,
    error: null,
    lastFetchedAt: 0,
  },
  latestReviews: {
    items: [],
    loading: false,
    error: null,
    lastFetchedAt: 0,
  },
  topReviewers: {
    items: [],
    loading: false,
    error: null,
    lastFetchedAt: 0,
  },
};

export default function homePublicReducer(state = initialState, action) {
  switch (action.type) {
    case TRENDING_REQUEST:
      return {
        ...state,
        trendingWeeklyGames: {
          ...state.trendingWeeklyGames,
          loading: true,
          error: null,
        },
      };

    case TRENDING_SUCCESS:
      return {
        ...state,
        trendingWeeklyGames: {
          loading: false,
          error: null,
          items: action.payload || [],
          lastFetchedAt: Date.now(),
        },
      };

    case TRENDING_ERROR:
      return {
        ...state,
        trendingWeeklyGames: {
          ...state.trendingWeeklyGames,
          loading: false,
          error: action.payload,
        },
      };

    case LATESTREVIEWS_REQUEST:
      return {
        ...state,
        latestReviews: {
          ...state.latestReviews,
          loading: true,
          error: null,
        },
      };

    case LATESTREVIEWS_SUCCESS:
      return {
        ...state,
        latestReviews: {
          items: action.payload || [],
          loading: false,
          error: null,
          lastFetchedAt: Date.now(),
        },
      };

    case LATESTREVIEWS_ERROR:
      return {
        ...state,
        latestReviews: {
          ...state.latestReviews,
          loading: false,
          error: action.payload,
        },
      };

    case TOPREVIEWERS_REQUEST:
      return {
        ...state,
        topReviewers: {
          ...state.topReviewers,
          loading: true,
          error: null,
        },
      };

    case TOPREVIEWERS_SUCCESS:
      return {
        ...state,
        topReviewers: {
          items: action.payload || [],
          loading: false,
          error: null,
          lastFetchedAt: Date.now(),
        },
      };

    case TOPREVIEWERS_ERROR:
      return {
        ...state,
        topReviewers: {
          ...state.topReviewers,
          loading: false,
          error: action.payload,
        },
      };
    default:
      return state;
  }
}
