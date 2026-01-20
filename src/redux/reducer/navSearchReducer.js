import { NAVSEARCH_CLEAR, NAVSEARCH_ERROR, NAVSEARCH_REQUEST, NAVSEARCH_SET_QUERY, NAVSEARCH_SUCCESS } from "../authTypes";

const initialState = {
  query: "",
  items: [],
  loading: false,
  error: null,
  totalItems: 0,
  open: false,
};

export default function navSearchReducer(state = initialState, action) {
  switch (action.type) {
    case NAVSEARCH_SET_QUERY:
      return {
        ...state,
        query: action.payload,
      };
    case NAVSEARCH_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        open: true,
      };
    case NAVSEARCH_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        open: true,
        items: action.payload.items ?? [],
        totalItems: action.payload.totalItems ?? 0,
      };
    case NAVSEARCH_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
        open: true,
      };
    case NAVSEARCH_CLEAR:
      return { ...initialState };
    default:
      return state;
  }
}
