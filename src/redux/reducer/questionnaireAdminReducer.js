// src/redux/reducer/questionnaireAdminReducer.js

import {
  QUESTIONNAIRE_ADMIN_CREATE_QUESTION_REQUEST,
  QUESTIONNAIRE_ADMIN_CREATE_QUESTION_SUCCESS,
  QUESTIONNAIRE_ADMIN_CREATE_QUESTION_FAILURE,
  QUESTIONNAIRE_ADMIN_UPDATE_QUESTION_REQUEST,
  QUESTIONNAIRE_ADMIN_UPDATE_QUESTION_SUCCESS,
  QUESTIONNAIRE_ADMIN_UPDATE_QUESTION_FAILURE,
  QUESTIONNAIRE_ADMIN_CREATE_OPTION_REQUEST,
  QUESTIONNAIRE_ADMIN_CREATE_OPTION_SUCCESS,
  QUESTIONNAIRE_ADMIN_CREATE_OPTION_FAILURE,
  QUESTIONNAIRE_ADMIN_UPDATE_OPTION_REQUEST,
  QUESTIONNAIRE_ADMIN_UPDATE_OPTION_SUCCESS,
  QUESTIONNAIRE_ADMIN_UPDATE_OPTION_FAILURE,
  QUESTIONNAIRE_ADMIN_DELETE_OPTION_REQUEST,
  QUESTIONNAIRE_ADMIN_DELETE_OPTION_SUCCESS,
  QUESTIONNAIRE_ADMIN_DELETE_OPTION_FAILURE,
} from "../authTypes.js";

/**
 * Nota per me futuro:
 * - Questa slice gestisce la STRUTTURA completa del questionario in area admin:
 *   - lista domande con dentro le opzioni (e relativi effetti se il backend li include).
 *
 * state shape:
 * {
 *   items: QuestionnaireQuestionDto[],
 *   loading: boolean,   // caricamento struttura
 *   error: string | null,
 *   saving: boolean,    // flag generico per create/update/delete
 * }
 *
 * Per semplificare, dopo ogni create/update/delete facciamo un refresh completo con
 * fetchQuestionnaireAdminQuestions(), quindi qui non sto facendo update immutabili
 * annidati su items.
 */

const initialState = {
  items: [],
  loading: false,
  error: null,
  saving: false,
};

export const questionnaireAdminReducer = (state = initialState, action) => {
  switch (action.type) {
    // ===== CREATE / UPDATE / DELETE QUESTIONS =====
    case QUESTIONNAIRE_ADMIN_CREATE_QUESTION_REQUEST:
    case QUESTIONNAIRE_ADMIN_UPDATE_QUESTION_REQUEST:
      return {
        ...state,
        saving: true,
        // non tocco items qui, aspetto il refresh
      };

    case QUESTIONNAIRE_ADMIN_CREATE_QUESTION_SUCCESS:
    case QUESTIONNAIRE_ADMIN_UPDATE_QUESTION_SUCCESS:
      return {
        ...state,
        saving: false,
        // items verrà aggiornato dal SUCCESS del fetch successivo
      };

    case QUESTIONNAIRE_ADMIN_CREATE_QUESTION_FAILURE:
    case QUESTIONNAIRE_ADMIN_UPDATE_QUESTION_FAILURE:
      return {
        ...state,
        saving: false,
        error: action.payload?.message || action.payload || "Errore operazione sulla domanda.",
      };

    // ===== CREATE / UPDATE / DELETE OPTIONS =====
    case QUESTIONNAIRE_ADMIN_CREATE_OPTION_REQUEST:
    case QUESTIONNAIRE_ADMIN_UPDATE_OPTION_REQUEST:
    case QUESTIONNAIRE_ADMIN_DELETE_OPTION_REQUEST:
      return {
        ...state,
        saving: true,
      };

    case QUESTIONNAIRE_ADMIN_CREATE_OPTION_SUCCESS:
    case QUESTIONNAIRE_ADMIN_UPDATE_OPTION_SUCCESS:
    case QUESTIONNAIRE_ADMIN_DELETE_OPTION_SUCCESS:
      return {
        ...state,
        saving: false,
      };

    case QUESTIONNAIRE_ADMIN_CREATE_OPTION_FAILURE:
    case QUESTIONNAIRE_ADMIN_UPDATE_OPTION_FAILURE:
    case QUESTIONNAIRE_ADMIN_DELETE_OPTION_FAILURE:
      return {
        ...state,
        saving: false,
        error: action.payload?.message || action.payload || "Errore operazione sull'opzione.",
      };

    default:
      return state;
  }
};
