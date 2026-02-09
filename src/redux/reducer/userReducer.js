import {
  USER_MY_PROFILE_REQUEST,
  USER_MY_PROFILE_SUCCESS,
  USER_MY_PROFILE_ERROR,
  USER_MY_PROFILE_CLEAR,
  USER_PROFILE_REQUEST,
  USER_PROFILE_SUCCESS,
  USER_PROFILE_ERROR,
  USER_PROFILE_CLEAR,
  USER_DATA_CLEAR,
} from "../authTypes";

const myInitial = {
  loading: false,
  error: null,
  data: null,
  loaded: false,
};

const profileInitial = {
  loading: false,
  error: null,
  data: null,
  loaded: false,
};

const initialState = {
  my: { ...myInitial }, // mio profilo
  profile: { ...profileInitial }, // profilo che sto guardando (altri utenti)
};

export default function userDataReducer(state = initialState, action) {
  switch (action.type) {
    // ===== MIO PROFILO =====
    case USER_MY_PROFILE_REQUEST:
      return {
        ...state,
        my: {
          ...state.my,
          loading: true,
          error: null,
        },
      };

    case USER_MY_PROFILE_SUCCESS:
      return {
        ...state,
        my: {
          loading: false,
          error: null,
          data: action.payload,
          loaded: true,
        },
      };

    case USER_MY_PROFILE_ERROR:
      return {
        ...state,
        my: {
          ...state.my,
          loading: false,
          error: action.payload,
        },
      };

    case USER_MY_PROFILE_CLEAR:
      return {
        ...state,
        my: { ...myInitial },
      };

    // ===== PROFILO PUBBLICO (ALTRO UTENTE) =====
    case USER_PROFILE_REQUEST:
      return {
        ...state,
        profile: {
          ...state.profile,
          loading: true,
          error: null,
        },
      };

    case USER_PROFILE_SUCCESS:
      return {
        ...state,
        profile: {
          loading: false,
          error: null,
          data: action.payload,
          loaded: true,
        },
      };

    case USER_PROFILE_ERROR:
      return {
        ...state,
        profile: {
          ...state.profile,
          loading: false,
          error: action.payload,
        },
      };

    case USER_PROFILE_CLEAR:
      return {
        ...state,
        profile: { ...profileInitial },
      };

    // opzionale: clear totale, tipo su logout
    case USER_DATA_CLEAR:
      return initialState;

    default:
      return state;
  }
}
