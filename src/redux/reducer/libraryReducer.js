import { LIBRARY_ERROR, LIBRARY_REQUEST, LIBRARY_SUCCESS } from "../authTypes";

const initialState = {
  items: [],
  loading: false,
  error: null,
  page: 1,
  pageSize: 20,
  totalItems: 0,
  totalPages: 0,
  filters: {
    search: "",
    genres: [],
    platforms: [],
  },
  mode: "all", // "all" | "search"
};

export default function libraryReducer(state = initialState, action) {
  switch (action.type) {
    case LIBRARY_REQUEST:
      return { ...state, loading: true, error: null };

    case LIBRARY_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        items: action.payload.items,
        page: action.payload.page,
        pageSize: action.payload.pageSize,
        totalItems: action.payload.totalItems,
        totalPages: action.payload.totalPages,
        filters: action.payload.filters,
        mode: action.payload.mode,
      };

    case LIBRARY_ERROR:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}
