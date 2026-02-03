import { FETCH_QUESTIONNAIRE_ANALYTICS_REQUEST, FETCH_QUESTIONNAIRE_ANALYTICS_SUCCESS, FETCH_QUESTIONNAIRE_ANALYTICS_FAILURE } from "../authTypes.js";

// Nota per me futuro:
// - Questo reducer gestisce SOLO l'overview analytics del questionario admin.
// - Struttura del payload: QuestionnaireAnalyticsOverviewDto dal backend.
// - Stato tipico:
//   loading: true/false,
//   overview: dati dell'overview,
//   error: messaggio di errore (string) se qualcosa va storto.

const initialState = {
  loading: false,
  overview: null, // QuestionnaireAnalyticsOverviewDto
  error: null,
  lastLoadedAt: null, // Data di quando è stato caricato l'ultima volta (ISO string)
};

export default function questionnaireAnalyticsReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_QUESTIONNAIRE_ANALYTICS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case FETCH_QUESTIONNAIRE_ANALYTICS_SUCCESS:
      return {
        ...state,
        loading: false,
        overview: action.payload, // il DTO completo
        error: null,
        lastLoadedAt: new Date().toISOString(),
      };

    case FETCH_QUESTIONNAIRE_ANALYTICS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload || "Errore nel caricamento delle analytics.",
      };

    default:
      return state;
  }
}
