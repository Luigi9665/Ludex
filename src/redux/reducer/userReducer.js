import { USER_DATA_CLEAR, USER_DATA_ERROR, USER_DATA_REQUEST, USER_DATA_SUCCESS } from "../authTypes";

const initialState = {
  loading: false,
  error: null,
  userDetails: null,
};

export default function userDataReducer(state = initialState, action) {
  switch (action.type) {
    case USER_DATA_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case USER_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        userDetails: action.payload,
      };
    case USER_DATA_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case USER_DATA_CLEAR:
      return initialState;
    default:
      return state;
  }
}
