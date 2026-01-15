import { LOGIN_ERROR, LOGIN_REQUEST, LOGIN_SUCCESS, LOGOUT } from "../action";

const initialstate = {
  accessToken: null,
  refreshToken: null,
  expiresAt: null,
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

export default function loginReducer(state = initialstate, action) {
  switch (action.type) {
    case LOGIN_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        expiresAt: action.payload.expiresAt,
        user: action.payload.user,
        isAuthenticated: true,
      };
    case LOGIN_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
        isAuthenticated: false,
      };
    case LOGOUT:
      return initialstate;
    default:
      return state;
  }
}
