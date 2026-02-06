// src/redux/reducers/adminTaxonomyReducer.js (o dove lo tieni ora)
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

/**
 * Sottostato standard per liste semplici (generi, tag).
 */
const initialSubState = {
  items: [],
  loading: false,
  error: null,
};

/**
 * Sottostato per ciascun "tipo" di metadata.
 */
const createMetaBucket = () => ({
  items: [],
  loading: false,
  error: null,
});

/**
 * Stato iniziale complessivo:
 * - genres: lista generi
 * - tags:   lista tag
 * - metadata: suddiviso in 3 bucket indipendenti (focus / mood / difficulty)
 */
const initialState = {
  genres: { ...initialSubState },
  tags: { ...initialSubState },
  metadata: {
    focus: createMetaBucket(),
    mood: createMetaBucket(),
    difficulty: createMetaBucket(),
  },
};

/**
 * Helper interno: mappa il campo DTO `type` → chiave del bucket nello state.
 * Backend manda "FOCUS" | "MOOD" | "DIFFICULTY".
 */
function mapDtoTypeToBucket(type) {
  switch (type) {
    case "FOCUS":
      return "focus";
    case "MOOD":
      return "mood";
    case "DIFFICULTY":
      return "difficulty";
    default:
      return null;
  }
}

/**
 * Nota per me futuro:
 * - Gestisce SOLO la tassonomia admin (generi, tag, metadata).
 * - Gli oggetti items sono esattamente i DTO del backend:
 *   - GenreAdminListItemDto
 *   - TagAdminListItemDto
 *   - MetadataAdminListItemDto (ora splittati per tipo in metadata.focus / mood / difficulty)
 */
export default function adminTaxonomyReducer(state = initialState, action) {
  switch (action.type) {
    // =========================================================
    // GENERI
    // =========================================================
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
        genres: {
          ...state.genres,
          loading: false,
          error: action.payload || "Errore nel caricamento generi.",
        },
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
      const updated = action.payload; // { id, name, keywordsIt, gamesCount? ... }

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
                  // se il backend manda gamesCount, lo tengo allineato,
                  // altrimenti lascio il valore precedente.
                  gamesCount: updated.gamesCount ?? g.gamesCount,
                  // le stats questionnaire* rimangono come sono:
                  // questionnaireEffectsCount, questionnaireTotalDelta,
                  // questionnaireOptionsCount, questionnaireQuestionsCount,
                  // sampleGames, hasQuestionnairePower...
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

    // =========================================================
    // TAG
    // =========================================================
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
        tags: {
          ...state.tags,
          loading: false,
          error: action.payload || "Errore nel caricamento tag.",
        },
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
                  code: action.payload.code, // in teoria immutabile, ma se il backend lo manda lo tengo allineato
                  displayName: action.payload.displayName,
                  category: action.payload.category,
                  description: action.payload.description,
                  keywordsIt: action.payload.keywordsIt,
                  isActive: action.payload.isActive,
                  displayOrder: action.payload.displayOrder,
                  // stats questionario lasciate intatte
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

    // =========================================================
    // METADATA (FOCUS / MOOD / DIFFICULTY)
    // =========================================================

    /**
     * Nota: qui lo stato è diviso in 3 bucket:
     * - state.metadata.focus
     * - state.metadata.mood
     * - state.metadata.difficulty
     *
     * Le thunk restano le stesse:
     * - fetchAdminMetadata() → riceve una lista mista di DTO e la sparge sui 3 bucket
     * - create/update/delete per focus/mood/difficulty aggiornano solo il bucket giusto.
     */

    case ADMIN_TAXONOMY_METADATA_FETCH_REQUEST:
      return {
        ...state,
        metadata: {
          focus: { ...state.metadata.focus, loading: true, error: null },
          mood: { ...state.metadata.mood, loading: true, error: null },
          difficulty: {
            ...state.metadata.difficulty,
            loading: true,
            error: null,
          },
        },
      };

    case ADMIN_TAXONOMY_METADATA_FETCH_SUCCESS: {
      const incoming = Array.isArray(action.payload) ? action.payload : [];

      const focusItems = [];
      const moodItems = [];
      const difficultyItems = [];

      // Spargo i DTO nei bucket corretti in base a `type`
      for (const item of incoming) {
        if (!item || !item.type) continue;
        const bucket = mapDtoTypeToBucket(item.type);
        if (!bucket) continue;

        if (bucket === "focus") focusItems.push(item);
        else if (bucket === "mood") moodItems.push(item);
        else if (bucket === "difficulty") difficultyItems.push(item);
      }

      return {
        ...state,
        metadata: {
          focus: {
            ...state.metadata.focus,
            items: focusItems,
            loading: false,
            error: null,
          },
          mood: {
            ...state.metadata.mood,
            items: moodItems,
            loading: false,
            error: null,
          },
          difficulty: {
            ...state.metadata.difficulty,
            items: difficultyItems,
            loading: false,
            error: null,
          },
        },
      };
    }

    case ADMIN_TAXONOMY_METADATA_FETCH_FAILURE: {
      const errorMsg = action.payload || "Errore nel caricamento metadata.";
      return {
        ...state,
        metadata: {
          focus: {
            ...state.metadata.focus,
            loading: false,
            error: errorMsg,
          },
          mood: {
            ...state.metadata.mood,
            loading: false,
            error: errorMsg,
          },
          difficulty: {
            ...state.metadata.difficulty,
            loading: false,
            error: errorMsg,
          },
        },
      };
    }

    case ADMIN_TAXONOMY_METADATA_CREATE_SUCCESS: {
      const created = action.payload;
      const bucket = mapDtoTypeToBucket(created?.type);
      if (!bucket) return state;

      const currentBucket = state.metadata[bucket];

      // se per qualche motivo esiste già un elemento con lo stesso id, lo sostituisco
      const exists = currentBucket.items.some((m) => m.id === created.id);

      return {
        ...state,
        metadata: {
          ...state.metadata,
          [bucket]: {
            ...currentBucket,
            items: exists ? currentBucket.items.map((m) => (m.id === created.id ? created : m)) : [...currentBucket.items, created],
          },
        },
      };
    }

    case ADMIN_TAXONOMY_METADATA_UPDATE_SUCCESS: {
      const updated = action.payload;
      const bucket = mapDtoTypeToBucket(updated?.type);
      if (!bucket) return state;

      const currentBucket = state.metadata[bucket];

      return {
        ...state,
        metadata: {
          ...state.metadata,
          [bucket]: {
            ...currentBucket,
            items: currentBucket.items.map((m) =>
              m.id === updated.id
                ? {
                    ...m,
                    // patch anagrafica; le stats questionnaire* restano
                    name: updated.name,
                    description: updated.description,
                    keywordsIt: updated.keywordsIt,
                    // type e code di solito non cambiano; se vuoi puoi
                    // tenerli allineati con quanto torna dal backend:
                    // type: updated.type,
                    // code: updated.code,
                    // gamesCount: updated.gamesCount ?? m.gamesCount,
                  }
                : m,
            ),
          },
        },
      };
    }

    case ADMIN_TAXONOMY_METADATA_DELETE_SUCCESS: {
      const idToRemove = action.payload;

      return {
        ...state,
        metadata: {
          focus: {
            ...state.metadata.focus,
            items: state.metadata.focus.items.filter((m) => m.id !== idToRemove),
          },
          mood: {
            ...state.metadata.mood,
            items: state.metadata.mood.items.filter((m) => m.id !== idToRemove),
          },
          difficulty: {
            ...state.metadata.difficulty,
            items: state.metadata.difficulty.items.filter((m) => m.id !== idToRemove),
          },
        },
      };
    }

    default:
      return state;
  }
}
