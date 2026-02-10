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
  UPDATE_USER_GAME_QUICK_SUCCESS,
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

// helper per tradurre eventuale enum numerico in stringa
const normalizeStatus = (status) => {
  if (typeof status === "string") return status;

  switch (status) {
    case 0:
      return "Backlog";
    case 1:
      return "Playing";
    case 2:
      return "Paused";
    case 3:
      return "Dropped";
    case 4:
      return "Completed";
    default:
      return "Backlog";
  }
};

// helper: merge di uno userGame aggiornato dentro un sotto-stato (my / profile)
const mergeUpdatedUserGameIntoProfile = (profileState, updated) => {
  if (!profileState?.data) return profileState;
  if (!updated) return profileState;

  const prevData = profileState.data;

  // l’array, nel tuo stato reale, si chiama "games"
  const gamesKey = Array.isArray(prevData.games) ? "games" : Array.isArray(prevData.userGames) ? "userGames" : null;

  if (!gamesKey) return profileState;

  const prevGames = prevData[gamesKey];

  const nextGames = prevGames.map((g) => {
    // gestisco tutte le varianti possibili
    const gUserGameId = g.userGameId ?? g.usergameId ?? g.id ?? null;
    if (!gUserGameId) return g;

    if (gUserGameId !== updated.userGameId) {
      return g;
    }
    console.log("[mergeUpdatedUserGameIntoProfile] match", {
      gamesKey,
      beforeStatus: g.status,
      afterStatus: normalizeStatus(updated.status),
    });

    return {
      ...g,
      status: normalizeStatus(updated.status),
      // se il backend torna null, tengo il vecchio valore
      progress: updated.progress ?? g.progress,
      rating: updated.rating ?? g.rating,
      review: typeof updated.review === "string" ? updated.review : g.review,
      isReviewPublic: typeof updated.isReviewPublic === "boolean" ? updated.isReviewPublic : g.isReviewPublic,
      lastUpdatedAt: updated.lastUpdatedAt ?? g.lastUpdatedAt,
    };
  });

  return {
    ...profileState,
    data: {
      ...prevData,
      [gamesKey]: nextGames,
    },
  };
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

    // ===== QUICK PATCH USERGAME (no refetch completo) =====
    case UPDATE_USER_GAME_QUICK_SUCCESS: {
      const updated = action.payload; // ResponseUserGameDetailOnlyOwnerDto
      return {
        ...state,
        my: mergeUpdatedUserGameIntoProfile(state.my, updated),
        profile: mergeUpdatedUserGameIntoProfile(state.profile, updated),
      };
    }

    // opzionale: clear totale, tipo su logout
    case USER_DATA_CLEAR:
      return initialState;

    default:
      return state;
  }
}
