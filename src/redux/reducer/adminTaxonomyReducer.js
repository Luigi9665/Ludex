import {
  ADMIN_TAXONOMY_GENRES_FETCH_REQUEST,
  ADMIN_TAXONOMY_GENRES_FETCH_SUCCESS,
  ADMIN_TAXONOMY_GENRES_FETCH_FAILURE,
  ADMIN_TAXONOMY_GENRE_CREATE_SUCCESS,
  ADMIN_TAXONOMY_GENRE_UPDATE_SUCCESS,
  ADMIN_TAXONOMY_GENRE_DELETE_SUCCESS,
  ADMIN_TAXONOMY_TAGS_FETCH_REQUEST,
  ADMIN_TAXONOMY_TAGS_FETCH_SUCCESS,
  ADMIN_TAXONOMY_TAGS_FETCH_FAILURE,
  ADMIN_TAXONOMY_TAG_CREATE_SUCCESS,
  ADMIN_TAXONOMY_TAG_UPDATE_SUCCESS,
  ADMIN_TAXONOMY_TAG_DELETE_SUCCESS,
  ADMIN_TAXONOMY_METADATA_FETCH_REQUEST,
  ADMIN_TAXONOMY_METADATA_FETCH_SUCCESS,
  ADMIN_TAXONOMY_METADATA_FETCH_FAILURE,
  ADMIN_TAXONOMY_METADATA_CREATE_SUCCESS,
  ADMIN_TAXONOMY_METADATA_UPDATE_SUCCESS,
  ADMIN_TAXONOMY_METADATA_DELETE_SUCCESS,
} from "../authTypes";

const initialSubState = {
  items: [],
  loading: false,
  error: null,
};

const initialState = {
  genres: { ...initialSubState },
  tags: { ...initialSubState },
  metadata: { ...initialSubState },
};

/**
 * Nota per me futuro:
 * - Gestisce SOLO la tassonomia admin (generi, tag, metadata).
 * - Gli oggetti items sono esattamente i DTO del backend:
 *   - GenreAdminListItemDto
 *   - TagAdminListItemDto
 *   - MetadataAdminListItemDto
 */
export default function adminTaxonomyReducer(state = initialState, action) {
  switch (action.type) {
    // ====== GENERI ======
    case ADMIN_TAXONOMY_GENRES_FETCH_REQUEST:
      return {
        ...state,
        genres: { ...state.genres, loading: true, error: null },
      };

    case ADMIN_TAXONOMY_GENRES_FETCH_SUCCESS:
      return {
        ...state,
        genres: { items: action.payload, loading: false, error: null },
      };

    case ADMIN_TAXONOMY_GENRES_FETCH_FAILURE:
      return {
        ...state,
        genres: { ...state.genres, loading: false, error: action.payload || "Errore nel caricamento generi." },
      };

    case ADMIN_TAXONOMY_GENRE_CREATE_SUCCESS:
      return {
        ...state,
        genres: {
          ...state.genres,
          items: [...state.genres.items, action.payload],
        },
      };

    case ADMIN_TAXONOMY_GENRE_UPDATE_SUCCESS: {
      const updated = action.payload; // { id, name, keywordsIt, gamesCount ...parziale }

      return {
        ...state,
        genres: {
          ...state.genres,
          items: state.genres.items.map((g) =>
            g.id === updated.id
              ? {
                  ...g,
                  // patch solo i campi realmente aggiornati dal form
                  name: updated.name,
                  keywordsIt: updated.keywordsIt,
                  // se vuoi, puoi tenere anche gamesCount aggiornato
                  gamesCount: updated.gamesCount ?? g.gamesCount,
                  // lasciamo intatte tutte le stats questionario
                  // questionnaireEffectsCount: g.questionnaireEffectsCount,
                  // questionnaireTotalDelta: g.questionnaireTotalDelta,
                  // questionnaireOptionsCount: g.questionnaireOptionsCount,
                  // questionnaireQuestionsCount: g.questionnaireQuestionsCount,
                  // sampleGames: g.sampleGames,
                  // hasQuestionnairePower: g.hasQuestionnairePower,
                }
              : g,
          ),
        },
      };
    }

    case ADMIN_TAXONOMY_GENRE_DELETE_SUCCESS:
      return {
        ...state,
        genres: {
          ...state.genres,
          items: state.genres.items.filter((g) => g.id !== action.payload),
        },
      };

    // ====== TAG ======
    case ADMIN_TAXONOMY_TAGS_FETCH_REQUEST:
      return {
        ...state,
        tags: { ...state.tags, loading: true, error: null },
      };

    case ADMIN_TAXONOMY_TAGS_FETCH_SUCCESS:
      return {
        ...state,
        tags: { items: action.payload, loading: false, error: null },
      };

    case ADMIN_TAXONOMY_TAGS_FETCH_FAILURE:
      return {
        ...state,
        tags: { ...state.tags, loading: false, error: action.payload || "Errore nel caricamento tag." },
      };

    case ADMIN_TAXONOMY_TAG_CREATE_SUCCESS:
      return {
        ...state,
        tags: {
          ...state.tags,
          items: [...state.tags.items, action.payload],
        },
      };

    case ADMIN_TAXONOMY_TAG_UPDATE_SUCCESS:
      return {
        ...state,
        tags: {
          ...state.tags,
          items: state.tags.items.map((t) =>
            t.id === action.payload.id
              ? {
                  ...t,
                  // campi “anagrafici” aggiornabili
                  code: action.payload.code, // in teoria immutabile, ma se il backend lo manda ok tenerlo allineato
                  displayName: action.payload.displayName,
                  category: action.payload.category,
                  description: action.payload.description,
                  keywordsIt: action.payload.keywordsIt,
                  isActive: action.payload.isActive,
                  displayOrder: action.payload.displayOrder,
                  gamesCount: action.payload.gamesCount,
                  // ⚠️ NON tocchiamo:
                  // - questionnaireEffectsCount
                  // - questionnaireTotalDelta
                  // - questionnaireOptionsCount
                  // - questionnaireQuestionsCount
                  // - hasQuestionnairePower (se lo calcoli lato FE)
                }
              : t,
          ),
        },
      };

    case ADMIN_TAXONOMY_TAG_DELETE_SUCCESS:
      return {
        ...state,
        tags: {
          ...state.tags,
          items: state.tags.items.filter((t) => t.id !== action.payload),
        },
      };

    // ====== METADATA ======
    case ADMIN_TAXONOMY_METADATA_FETCH_REQUEST:
      return {
        ...state,
        metadata: { ...state.metadata, loading: true, error: null },
      };

    case ADMIN_TAXONOMY_METADATA_FETCH_SUCCESS:
      return {
        ...state,
        metadata: { items: action.payload, loading: false, error: null },
      };

    case ADMIN_TAXONOMY_METADATA_FETCH_FAILURE:
      return {
        ...state,
        metadata: { ...state.metadata, loading: false, error: action.payload || "Errore nel caricamento metadata." },
      };

    case ADMIN_TAXONOMY_METADATA_CREATE_SUCCESS:
      return {
        ...state,
        metadata: {
          ...state.metadata,
          items: [...state.metadata.items, action.payload],
        },
      };

    case ADMIN_TAXONOMY_METADATA_UPDATE_SUCCESS:
      return {
        ...state,
        metadata: {
          ...state.metadata,
          items: state.metadata.items.map((m) =>
            m.id === action.payload.id
              ? {
                  ...m,
                  // anagrafica
                  type: action.payload.type, // "FOCUS" | "MOOD" | "DIFFICULTY"
                  code: action.payload.code,
                  name: action.payload.name,
                  description: action.payload.description,
                  keywordsIt: action.payload.keywordsIt,
                  gamesCount: action.payload.gamesCount,
                  // ⚠️ NON tocchiamo le stats questionnaire* esistenti
                }
              : m,
          ),
        },
      };

    case ADMIN_TAXONOMY_METADATA_DELETE_SUCCESS:
      return {
        ...state,
        metadata: {
          ...state.metadata,
          items: state.metadata.items.filter((m) => m.id !== action.payload),
        },
      };

    default:
      return state;
  }
}
