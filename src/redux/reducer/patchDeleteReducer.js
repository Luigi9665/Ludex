import {
  DELETE_USER_GAME_FAIL,
  DELETE_USER_GAME_REQUEST,
  DELETE_USER_GAME_SUCCESS,
  UPDATE_USER_GAME_FAIL,
  UPDATE_USER_GAME_REQUEST,
  UPDATE_USER_GAME_SUCCESS,
  UPDATE_USER_GAME_QUICK_REQUEST,
  UPDATE_USER_GAME_QUICK_SUCCESS,
  UPDATE_USER_GAME_QUICK_FAIL,
} from "../authTypes";

const initialState = {
  LoadingPatch: false,
  ErrorPatch: null,
  LoadingDelete: false,
  ErrorDelete: null,
};

export default function patchDeleteReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_USER_GAME_REQUEST:
    case UPDATE_USER_GAME_QUICK_REQUEST:
      return {
        ...state,
        LoadingPatch: true,
        ErrorPatch: null,
      };
    case UPDATE_USER_GAME_SUCCESS:
    case UPDATE_USER_GAME_QUICK_SUCCESS:
      return {
        ...state,
        LoadingPatch: false,
      };
    case UPDATE_USER_GAME_FAIL:
    case UPDATE_USER_GAME_QUICK_FAIL:
      return {
        ...state,
        LoadingPatch: false,
        ErrorPatch: action.payload,
      };
    case DELETE_USER_GAME_REQUEST:
      return {
        ...state,
        LoadingDelete: true,
        ErrorDelete: null,
      };
    case DELETE_USER_GAME_SUCCESS:
      return {
        ...state,
        LoadingDelete: false,
      };
    case DELETE_USER_GAME_FAIL:
      return {
        ...state,
        LoadingDelete: false,
        ErrorDelete: action.payload,
      };

    default:
      return state;
  }
}
