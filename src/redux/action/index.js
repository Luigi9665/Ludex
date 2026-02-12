import { jwtDecode } from "jwt-decode";
import { apiFetch } from "../../apiFetch Autenticate/apiFetch";
import {
  DELETE_USER_GAME_FAIL,
  DELETE_USER_GAME_REQUEST,
  DELETE_USER_GAME_SUCCESS,
  GAME_DETAIL_ERROR,
  GAME_DETAIL_REQUEST,
  GAME_DETAIL_SUCCESS,
  METADATA_REQUEST,
  METADATA_SUCCESS,
  METADATA_ERROR,
  GENRES_ERROR,
  GENRES_REQUEST,
  GENRES_SUCCESS,
  LATESTREVIEWS_ERROR,
  LATESTREVIEWS_REQUEST,
  LATESTREVIEWS_SUCCESS,
  LIBRARY_ERROR,
  LIBRARY_REQUEST,
  LIBRARY_SUCCESS,
  LOGIN_ERROR,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT,
  NAVSEARCH_CLEAR,
  NAVSEARCH_ERROR,
  NAVSEARCH_REQUEST,
  NAVSEARCH_SET_QUERY,
  NAVSEARCH_SUCCESS,
  PLATFORMS_ERROR,
  PLATFORMS_REQUEST,
  PLATFORMS_SUCCESS,
  TOPREVIEWERS_ERROR,
  TOPREVIEWERS_REQUEST,
  TOPREVIEWERS_SUCCESS,
  TRENDING_ERROR,
  TRENDING_REQUEST,
  TRENDING_SUCCESS,
  UPDATE_USER_GAME_FAIL,
  UPDATE_USER_GAME_REQUEST,
  UPDATE_USER_GAME_SUCCESS,
  UPDATE_USER_GAME_QUICK_REQUEST,
  UPDATE_USER_GAME_QUICK_SUCCESS,
  UPDATE_USER_GAME_QUICK_FAIL,
  USER_DATA_CLEAR,
  USER_MY_PROFILE_REQUEST,
  USER_MY_PROFILE_SUCCESS,
  USER_MY_PROFILE_ERROR,
  USER_PROFILE_REQUEST,
  USER_PROFILE_SUCCESS,
  USER_PROFILE_ERROR,
  ADMIN_GAMES_REQUEST,
  ADMIN_GAMES_SUCCESS,
  ADMIN_GAMES_ERROR,
  QUESTIONNAIRE_REQUEST,
  QUESTIONNAIRE_SUCCESS,
  QUESTIONNAIRE_ERROR,
  QUESTIONNAIRE_TOGGLE_OPTION,
  QUESTIONNAIRE_NEXT_STEP,
  QUESTIONNAIRE_PREV_STEP,
  QUESTIONNAIRE_SET_SUBMITTING,
  QUESTIONNAIRE_SET_COMPLETED,
  QUESTIONNAIRE_SET_SUBMIT_ERROR,
  QUESTIONNAIRE_RESET,
  RECOMMENDATIONS_REQUEST,
  RECOMMENDATIONS_SUCCESS,
  RECOMMENDATIONS_ERROR,
  RECOMMENDATIONS_LOAD_MORE,
  RECOMMENDATIONS_RESET,
  QUESTIONNAIRE_STATUS_REQUEST,
  QUESTIONNAIRE_STATUS_SUCCESS,
  QUESTIONNAIRE_STATUS_ERROR,
  FETCH_QUESTIONNAIRE_ANALYTICS_REQUEST,
  FETCH_QUESTIONNAIRE_ANALYTICS_SUCCESS,
  FETCH_QUESTIONNAIRE_ANALYTICS_FAILURE,
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
  QUESTIONNAIRE_ACTIVE_FETCH_REQUEST,
  QUESTIONNAIRE_ACTIVE_FETCH_SUCCESS,
  QUESTIONNAIRE_ACTIVE_FETCH_FAILURE,
  QUESTIONNAIRE_ACTIVE_TOGGLE_REQUEST,
  QUESTIONNAIRE_ACTIVE_TOGGLE_SUCCESS,
  QUESTIONNAIRE_ACTIVE_TOGGLE_FAILURE,
  QUESTIONNAIRE_EFFECTS_FETCH_REQUEST,
  QUESTIONNAIRE_EFFECTS_FETCH_SUCCESS,
  QUESTIONNAIRE_EFFECTS_FETCH_FAILURE,
  QUESTIONNAIRE_EFFECTS_CREATE_REQUEST,
  QUESTIONNAIRE_EFFECTS_CREATE_SUCCESS,
  QUESTIONNAIRE_EFFECTS_CREATE_FAILURE,
  QUESTIONNAIRE_EFFECTS_UPDATE_REQUEST,
  QUESTIONNAIRE_EFFECTS_UPDATE_SUCCESS,
  QUESTIONNAIRE_EFFECTS_UPDATE_FAILURE,
  QUESTIONNAIRE_EFFECTS_DELETE_REQUEST,
  QUESTIONNAIRE_EFFECTS_DELETE_SUCCESS,
  QUESTIONNAIRE_EFFECTS_DELETE_FAILURE,
  QUESTIONNAIRE_EFFECTS_SUGGESTIONS_REQUEST,
  QUESTIONNAIRE_EFFECTS_SUGGESTIONS_SUCCESS,
  QUESTIONNAIRE_EFFECTS_SUGGESTIONS_FAILURE,
  QUESTIONNAIRE_EFFECTS_SUGGESTIONS_CLEAR,
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
  MARK_GAME_VIEWED_REQUEST,
  MARK_GAME_VIEWED_SUCCESS,
  MARK_GAME_VIEWED_FAIL,
} from "../authTypes";
import { STATUS_TO_ENUM } from "../../utils/statusMapper";
import { mapStatusToEnumQuick, mapStatusEnumToStringQuick } from "../../utils/statusMappingQuick";

const safeJson = async (res) => {
  try {
    return await res.json();
  } catch {
    return null;
  }
};

// ===============
// ACTION SEMPLICI
// ===============
export const toggleQuestionnaireOption = (questionId, optionId, isMultipleChoice) => ({
  type: QUESTIONNAIRE_TOGGLE_OPTION,
  payload: { questionId, optionId, isMultipleChoice },
});

export const goToNextQuestionnaireStep = () => ({
  type: QUESTIONNAIRE_NEXT_STEP,
});

export const goToPrevQuestionnaireStep = () => ({
  type: QUESTIONNAIRE_PREV_STEP,
});

export const resetQuestionnaire = () => ({
  type: QUESTIONNAIRE_RESET,
});

export const loadMoreRecommendations = () => ({
  type: RECOMMENDATIONS_LOAD_MORE,
});

export const resetRecommendations = () => ({
  type: RECOMMENDATIONS_RESET,
});

const mapUserFromClaims = (c) => ({
  userId: c.sub || c["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"],
  email: c.email || c["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"],
  username: c.username || c["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
  role: c.role || c["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
});

const baseUrl = import.meta.env.VITE_API_BASE_URL;

//azione per il login , salva le credenziali come il token, il refreshToken e alcuni dati dell'user come l'id, email e ruolo
export const loginAction = (credentials) => {
  return async (dispatch) => {
    dispatch({ type: LOGIN_REQUEST });

    try {
      const response = await fetch(`${baseUrl}/api/Auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await safeJson(response);

      if (!response.ok) {
        throw data || { message: "Credenziali non valide" };
      }

      const claims = jwtDecode(data.accessToken);
      const user = mapUserFromClaims(claims);

      dispatch({
        type: LOGIN_SUCCESS,
        payload: { ...data, user },
      });
    } catch (error) {
      dispatch({
        type: LOGIN_ERROR,
        payload: error?.message || "Errore durante il login",
      });
    }
  };
};

//pulisce completamente lo stato del redux per quanto riguarda l'autenticazione
export const logoutAction = () => {
  return (dispatch) => {
    dispatch({
      type: LOGOUT,
    });
    dispatch({
      type: USER_DATA_CLEAR,
    });
  };
};

// =========== MIO PROFILO (utente loggato) ===========
export const loadMyProfile = (userId) => {
  return async (dispatch) => {
    if (!userId) return;

    dispatch({ type: USER_MY_PROFILE_REQUEST });

    try {
      const url = `/api/Users/MyProfile?id=${userId}`;

      const response = await apiFetch(url, { method: "GET" });

      if (response.status === 401) {
        // opzionale: puoi gestire logout o altro
        return;
      }

      if (!response.ok) {
        throw new Error("Impossibile caricare il tuo profilo");
      }

      const data = await safeJson(response);

      dispatch({
        type: USER_MY_PROFILE_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: USER_MY_PROFILE_ERROR,
        payload: error?.message || "Errore durante il caricamento del profilo",
      });
    }
  };
};

// =========== PROFILO PUBBLICO (altro utente) ===========
export const loadUserPublicProfile = (userId) => {
  return async (dispatch) => {
    if (!userId) return;

    dispatch({ type: USER_PROFILE_REQUEST });

    try {
      const url = `/api/Users/GetUtenteById?id=${userId}`;

      const response = await apiFetch(url, { method: "GET" });

      if (response.status === 401) {
        return;
      }

      if (!response.ok) {
        throw new Error("Impossibile caricare il profilo utente");
      }

      const data = await safeJson(response);

      dispatch({
        type: USER_PROFILE_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: USER_PROFILE_ERROR,
        payload: error?.message || "Errore durante il caricamento del profilo utente",
      });
    }
  };
};

//action per prenderci i giochi di tendenza settimanale
export const loadTrendingWeeklyGames = () => {
  return async (dispatch) => {
    dispatch({ type: TRENDING_REQUEST });

    try {
      const response = await apiFetch("/api/UserGames/public/topWeeklyGames?take=10");

      if (!response.ok) {
        throw new Error("Impossibile caricare i dati");
      }

      const data = await safeJson(response);

      dispatch({
        type: TRENDING_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: TRENDING_ERROR,
        payload: error?.message || "Errore durante il caricamento, riprova più tardi",
      });
    }
  };
};

//action per prenderci le ultime recensioni
export const loadLatestReviews = () => {
  return async (dispatch) => {
    dispatch({ type: LATESTREVIEWS_REQUEST });

    try {
      const response = await apiFetch("/api/UserGames/public/latestReviews?take=10");

      if (!response.ok) {
        throw new Error("Impossibile caricare i dati");
      }

      const data = await safeJson(response);

      dispatch({
        type: LATESTREVIEWS_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: LATESTREVIEWS_ERROR,
        payload: error?.message || "Errore durante il caricamento, riprova più tardi",
      });
    }
  };
};

//action per prenderci gli utenti in tendenza
export const loadTopReviewers = () => {
  return async (dispatch) => {
    dispatch({ type: TOPREVIEWERS_REQUEST });

    try {
      const response = await apiFetch("/api/UserGames/public/topReviewers?take=10");

      if (!response.ok) {
        throw new Error("Impossibile caricare i dati");
      }

      const data = await safeJson(response);

      dispatch({
        type: TOPREVIEWERS_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: TOPREVIEWERS_ERROR,
        payload: error?.message || "Errore durante il caricamento, riprova più tardi",
      });
    }
  };
};

//action per prendere i Generi di un game
export const loadGenres = () => {
  return async (dispatch) => {
    dispatch({ type: GENRES_REQUEST });
    try {
      const response = await apiFetch("/api/Genre");

      if (!response.ok) {
        throw new Error("Impossibile caricare i dati");
      }

      const data = await safeJson(response);

      dispatch({
        type: GENRES_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: GENRES_ERROR,
        payload: error?.message || "Errore generi",
      });
    }
  };
};

//action per prendere le Platforms di un game
export const loadPlatforms = () => {
  return async (dispatch) => {
    dispatch({ type: PLATFORMS_REQUEST });
    try {
      const response = await apiFetch("/api/Platform");

      if (!response.ok) {
        throw new Error("Impossibile caricare i dati");
      }

      const data = await safeJson(response);

      dispatch({
        type: PLATFORMS_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: PLATFORMS_ERROR,
        payload: error?.message || "Errore piattaforme",
      });
    }
  };
};

// Nota per me futuro:
// questa thunk carica in PARALLELO: focuses, moods, difficulties e tags
// dal controller MetadataController (/api/Metadata/...)
// e le mette in state.selectGame.metadata
export const loadGameMetadata = () => {
  return async (dispatch) => {
    dispatch({ type: METADATA_REQUEST });

    try {
      const [fRes, mRes, dRes, tRes] = await Promise.all([
        apiFetch("/api/Metadata/focuses"),
        apiFetch("/api/Metadata/moods"),
        apiFetch("/api/Metadata/difficulties"),
        apiFetch("/api/Metadata/tags"),
      ]);

      if (!fRes.ok || !mRes.ok || !dRes.ok || !tRes.ok) {
        throw new Error("Errore nel caricamento dei metadata");
      }

      const [focuses, moods, difficulties, tags] = await Promise.all([safeJson(fRes), safeJson(mRes), safeJson(dRes), safeJson(tRes)]);

      dispatch({
        type: METADATA_SUCCESS,
        payload: { focuses, moods, difficulties, tags },
      });
    } catch (err) {
      dispatch({
        type: METADATA_ERROR,
        payload: err?.message || "Errore caricamento metadata",
      });
    }
  };
};

// Nota per me futuro:
// questa chiamata prende la lista paginata "generica" dei giochi admin
// → usa /api/Games/admin/list
export const loadAdminGames = (page = 1, pageSize = 20) => {
  return async (dispatch) => {
    dispatch({ type: ADMIN_GAMES_REQUEST });

    try {
      const res = await apiFetch(`/api/Games/admin/list?page=${page}&pageSize=${pageSize}`);

      if (!res.ok) {
        throw new Error("Impossibile caricare la lista giochi admin.");
      }

      const data = await safeJson(res);
      // mi aspetto che il backend usi PagedResultDto:
      // {
      //   items: [...],
      //   page: 1,
      //   pageSize: 20,
      //   totalItems: 123
      // }
      dispatch({
        type: ADMIN_GAMES_SUCCESS,
        payload: {
          ...data,
          searchTerm: "", // nessuna ricerca nella list "base"
        },
      });
    } catch (error) {
      dispatch({
        type: ADMIN_GAMES_ERROR,
        payload: error?.message || "Errore durante il caricamento dei giochi admin.",
      });
    }
  };
};

// Nota per me futuro:
// questa è la versione con filtro testo.
// usa /api/Games/admin/search?title=...&page=...&pageSize=...
export const searchAdminGames = (title = "", page = 1, pageSize = 20) => {
  return async (dispatch) => {
    dispatch({ type: ADMIN_GAMES_REQUEST });

    try {
      const params = new URLSearchParams();
      if (title) params.append("title", title);
      params.append("page", String(page));
      params.append("pageSize", String(pageSize));

      const res = await apiFetch(`/api/Games/admin/search?${params.toString()}`);

      if (!res.ok) {
        throw new Error("Impossibile cercare giochi (admin).");
      }

      const data = await safeJson(res);

      dispatch({
        type: ADMIN_GAMES_SUCCESS,
        payload: {
          ...data,
          searchTerm: title,
        },
      });
    } catch (error) {
      dispatch({
        type: ADMIN_GAMES_ERROR,
        payload: error?.message || "Errore durante la ricerca dei giochi nell'area admin.",
      });
    }
  };
};

//action per il load dei giochi
export const loadLibraryPage = (page = 1) => {
  return async (dispatch, getState) => {
    dispatch({ type: LIBRARY_REQUEST });

    try {
      const pageSize = getState().libraryGames.pageSize ?? 20;

      const response = await apiFetch(`/api/Games/pages?page=${page}&pageSize=${pageSize}`);

      if (!response.ok) {
        throw new Error("Impossibile caricare il catalogo giochi");
      }

      const data = await safeJson(response);
      // { items, page, pageSize, totalItems, totalPages }

      dispatch({
        type: LIBRARY_SUCCESS,
        payload: {
          items: data.items,
          page: data.page,
          pageSize: data.pageSize,
          totalItems: data.totalItems,
          totalPages: data.totalPages,
          filters: { search: "", genres: [], platforms: [] },
          mode: "all",
        },
      });
    } catch (err) {
      dispatch({
        type: LIBRARY_ERROR,
        payload: err?.message || "Errore durante il caricamento della libreria",
      });
    }
  };
};

//action per la search
export const searchLibraryGames = ({ page = 1, search = "", genres = [], platforms = [] }) => {
  return async (dispatch) => {
    dispatch({ type: LIBRARY_REQUEST });

    try {
      const params = [];

      // --- TESTO ---
      if (search.trim() !== "") {
        params.push(`Title=${encodeURIComponent(search.trim())}`);
      }

      // --- GENERI ---
      genres.forEach((g) => {
        params.push(`Genres=${encodeURIComponent(g)}`);
      });

      // --- PIATTAFORME ---
      platforms.forEach((p) => {
        params.push(`Platforms=${encodeURIComponent(p)}`);
      });

      // --- PAGINAZIONE ---
      params.push(`page=${page}`);
      params.push(`pageSize=20`);

      const url = `/api/Games/search?${params.join("&")}`;

      const response = await apiFetch(url);
      if (!response.ok) throw new Error("Errore nel caricamento dei giochi filtrati");

      const data = await safeJson(response);

      dispatch({
        type: LIBRARY_SUCCESS,
        payload: {
          ...data,
          mode: "search",
          filters: { search, genres, platforms },
        },
      });
    } catch (err) {
      dispatch({
        type: LIBRARY_ERROR,
        payload: err.message,
      });
    }
  };
};

//action per la gestione della navSearch

export const setNavSearchQuery = (q) => ({ type: NAVSEARCH_SET_QUERY, payload: q });

export const clearNavSearch = () => ({ type: NAVSEARCH_CLEAR });

export const loadNavSearchPreview = ({ title, pageSize = 20 }) => {
  return async (dispatch) => {
    const q = (title ?? "").trim();

    if (q.length < 2) {
      dispatch(clearNavSearch());
      dispatch(setNavSearchQuery(q));
      return;
    }

    dispatch(setNavSearchQuery(q));
    dispatch({ type: NAVSEARCH_REQUEST });

    try {
      const url = `/api/Games/search?Title=${encodeURIComponent(q)}&page=1&pageSize=${pageSize}`;
      const res = await apiFetch(url, { method: "GET" });

      if (!res.ok) throw new Error("Errore nel caricamento risultati ricerca");

      const data = await safeJson(res);

      dispatch({
        type: NAVSEARCH_SUCCESS,
        payload: {
          items: data?.items ?? [],
          totalItems: data?.totalItems ?? data?.items?.length ?? 0,
        },
      });
    } catch (error) {
      dispatch({
        type: NAVSEARCH_ERROR,
        payload: error?.message || "Errore ricerca, riprova",
      });
    }
  };
};

//metodo per richiamare i dettagli di un gioco per il suo profilo
export const loadGameDetail = (gameId) => {
  return async (dispatch) => {
    dispatch({ type: GAME_DETAIL_REQUEST });

    try {
      const res = await apiFetch(`/api/Games/${gameId}`, { method: "GET" });

      if (!res.ok) {
        throw new Error("Impossibile caricare i dettagli del gioco.");
      }

      const game = await safeJson(res);

      let related = [];
      if (Array.isArray(game.genre) && game.genre.length > 0) {
        const mainGenre = game.genre[0];

        try {
          const relRes = await apiFetch(`/api/Games/search?Genres=${mainGenre}`, { method: "GET" });

          if (relRes.ok) {
            const relData = await safeJson(relRes);
            const items = Array.isArray(relData?.items) ? relData.items : [];

            related = items.filter((g) => g.gameId !== game.gameId);
          }
        } catch {
          // silenzioso: related rimane []
        }
      }

      dispatch({
        type: GAME_DETAIL_SUCCESS,
        payload: { game, related },
      });
    } catch (err) {
      dispatch({
        type: GAME_DETAIL_ERROR,
        payload: err?.message || "Errore imprevisto durante il caricamento.",
      });
    }
  };
};

// helper per convertire string → enum
const mapStatusToEnum = (status) => {
  if (status === null || status === undefined) return null;
  if (typeof status === "number") return status;

  const mapped = STATUS_TO_ENUM[status];

  return typeof mapped === "number" ? mapped : null;
};

//metodo per la patch usergame
export const loadPatchUsergame = (userGameId, patch, isMe) => {
  return async (dispatch, getState) => {
    const state = getState();
    const authUser = state.auth.user;
    const effectiveUserId = state.userData.userDetails?.userId ?? authUser?.userId ?? null;

    if (!effectiveUserId) {
      console.warn("[loadPatchUsergame] nessun effectiveUserId, esco");
      return;
    }

    // 💥 CONVERSIONE SICURA QUI
    const safePatch = {
      ...patch,
      status: mapStatusToEnum(patch.status),
    };

    dispatch({ type: UPDATE_USER_GAME_REQUEST });

    try {
      const res = await apiFetch(`/api/UserGames/UpdateUserGame/${userGameId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(safePatch),
      });

      if (!res.ok) {
        throw new Error("Impossibile aggiornare il gioco nella libreria.");
      }

      await safeJson(res);

      dispatch({ type: UPDATE_USER_GAME_SUCCESS });

      if (isMe) {
        dispatch(loadMyProfile(effectiveUserId));
      } else {
        dispatch(loadUserPublicProfile(effectiveUserId));
      }
    } catch (error) {
      console.error("[loadPatchUsergame] exception", error);
      dispatch({
        type: UPDATE_USER_GAME_FAIL,
        payload: error?.message || "Errore imprevisto durante il caricamento.",
      });
      throw error;
    }
  };
};

// helpers da mettere vicino alle altre utility nel file action/index.js

// DTO backend → client
const mapBackendUserGameDtoToClient = (dto) => {
  if (!dto) return null;

  const statusEnum = dto.status ?? dto.Status;

  return {
    userGameId: dto.userGameId ?? dto.UserGameId,
    gameId: dto.gameId ?? dto.GameId,
    title: dto.title ?? dto.Title ?? "",
    coverUrl: dto.coverUrl ?? dto.CoverUrl ?? "",
    status: mapStatusEnumToStringQuick(statusEnum),
    progress: dto.progress ?? dto.Progress ?? 0,
    rating: dto.rating ?? dto.Rating ?? 0,
    review: dto.review ?? dto.Review ?? "",
    isReviewPublic: dto.isReviewPublic ?? dto.IsReviewPublic ?? false,
    createdAt: dto.createdAt ?? dto.CreatedAt,
    lastUpdatedAt: dto.lastUpdatedAt ?? dto.LastUpdatedAt,
  };
};

// PATCH "leggera" per home / card / libreria
export const loadQuickPatchUsergame = (userGameId, patch) => {
  return async (dispatch, getState) => {
    const state = getState();
    const authUser = state.auth.user;
    const effectiveUserId = authUser?.userId ?? null;

    if (!effectiveUserId) {
      console.warn("[loadQuickPatchUsergame] nessun effectiveUserId, esco");
      return;
    }

    const safePatch = {
      ...patch,
      status: mapStatusToEnumQuick(patch.status),
    };

    dispatch({ type: UPDATE_USER_GAME_QUICK_REQUEST });

    try {
      const res = await apiFetch(`/api/UserGames/UpdateUserGame/${userGameId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(safePatch),
      });

      if (!res.ok) {
        throw new Error("Impossibile aggiornare il gioco nella libreria.");
      }

      const raw = await safeJson(res);
      const updated = mapBackendUserGameDtoToClient(raw);

      if (!updated || !updated.userGameId) {
        console.error("[loadQuickPatchUsergame] DTO aggiornato senza userGameId", raw);
        throw new Error("Risposta non valida dal server (userGameId mancante).");
      }

      dispatch({
        type: UPDATE_USER_GAME_QUICK_SUCCESS,
        payload: updated,
      });
    } catch (error) {
      console.error("[loadQuickPatchUsergame] exception", error);
      dispatch({
        type: UPDATE_USER_GAME_QUICK_FAIL,
        payload: error?.message || "Errore imprevisto durante l'aggiornamento.",
      });
      throw error;
    }
  };
};

//metodo per la delete usergame
// actions / thunk
// actions / thunk
export const loadDeleteUsergame = (userGameId, { isMe, userId }) => {
  return async (dispatch) => {
    dispatch({ type: DELETE_USER_GAME_REQUEST });

    try {
      const res = await apiFetch(`/api/UserGames/DeleteUserGame/${userGameId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Impossibile eliminare il gioco nella libreria.");
      }

      // se l'API ritorna 204 No Content puoi anche NON fare safeJson
      try {
        await safeJson(res);
      } catch {
        // ignora se non c'è body
      }

      dispatch({ type: DELETE_USER_GAME_SUCCESS });

      // 🔁 ricarico il profilo giusto
      if (isMe) {
        // mio profilo (privato, completo)
        dispatch(loadMyProfile(userId));
      } else {
        // profilo pubblico di un altro utente
        dispatch(loadUserPublicProfile(userId));
      }
    } catch (error) {
      dispatch({
        type: DELETE_USER_GAME_FAIL,
        payload: error?.message || "Errore imprevisto durante il caricamento.",
      });
      throw error;
    }
  };
};

// ===============
// THUNK: LOAD DOMANDE
// ===============
export const loadQuestionnaire = () => {
  return async (dispatch) => {
    //resetto sempre lo stato del questionario prima di iniziare
    dispatch({ type: QUESTIONNAIRE_RESET });

    dispatch({ type: QUESTIONNAIRE_REQUEST });

    try {
      const res = await apiFetch("/api/Questionnaire");

      if (!res.ok) {
        throw new Error("Impossibile caricare il questionario.");
      }

      const data = await safeJson(res);
      // data deve essere un array di domande:
      // [
      //   {
      //     id,
      //     code,
      //     textIt,
      //     isMultipleChoice,
      //     options: [{ id, textIt }, ...]
      //   },
      // ]
      dispatch({
        type: QUESTIONNAIRE_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: QUESTIONNAIRE_ERROR,
        payload: error?.message || "Errore durante il caricamento del questionario.",
      });
    }
  };
};

// ===============
// THUNK: SUBMIT QUESTIONARIO
// ===============

// Nota per me futuro:
// - Qui leggo dal state tutte le risposte (answersByQuestionId),
//   faccio il flatten in un array di optionId,
//   e chiamo il backend su /api/Recommendation/questionnaire.

export const submitQuestionnaire = () => {
  return async (dispatch, getState) => {
    const state = getState();
    const questionnaire = state.questionnaire;

    // Flatten di tutti gli optionId
    const selectedOptionIds = Object.values(questionnaire.answersByQuestionId).flat();

    if (!selectedOptionIds || selectedOptionIds.length === 0) {
      dispatch({
        type: QUESTIONNAIRE_SET_SUBMIT_ERROR,
        payload: "Nessuna risposta selezionata.",
      });
      return;
    }

    dispatch({
      type: QUESTIONNAIRE_SET_SUBMITTING,
      payload: true,
    });

    try {
      const res = await apiFetch("/api/Questionnaire/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ selectedOptionIds }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || "Errore durante l'invio del questionario.");
      }

      // Non mi interessa davvero il corpo della risposta: mi basta sapere che è ok.
      dispatch({ type: QUESTIONNAIRE_SET_COMPLETED });
    } catch (error) {
      dispatch({
        type: QUESTIONNAIRE_SET_SUBMIT_ERROR,
        payload: error?.message || "Errore durante l'invio del questionario.",
      });
    }
  };
};

// ===============================
// GET /api/Questionnaire/status
// ===============================
export const loadQuestionnaireStatus = () => {
  return async (dispatch) => {
    dispatch({ type: QUESTIONNAIRE_STATUS_REQUEST });

    try {
      const res = await apiFetch("/api/Questionnaire/status");

      if (!res.ok) {
        throw new Error("Impossibile verificare lo stato del questionario.");
      }

      const data = await safeJson(res);

      dispatch({
        type: QUESTIONNAIRE_STATUS_SUCCESS,
        payload: data,
      });
    } catch (err) {
      dispatch({
        type: QUESTIONNAIRE_STATUS_ERROR,
        payload: err?.message || "Errore caricamento stato questionario",
      });
    }
  };
};

// Nota per me futuro:
// - Una sola chiamata al backend:
//   GET /api/Recommendation?take=50   (o 100, tanto mostra solo top score)
// - La paginazione è SOLO lato front (pageSize 6).

export const loadRecommendations = () => {
  return async (dispatch, getState) => {
    const { recommendations } = getState();

    // Se ho già items e non voglio forzare il reload, posso evitare la chiamata.
    if (recommendations.items && recommendations.items.length > 0) {
      return;
    }

    dispatch({ type: RECOMMENDATIONS_REQUEST });

    try {
      // prendo i top 50 dal backend (basta e avanza)
      const res = await apiFetch(`/api/Recommendation?take=30`);

      if (!res.ok) {
        throw new Error("Impossibile caricare i giochi consigliati.");
      }

      const data = await safeJson(res);
      // Mi aspetto un array di GameRecommendationDto.
      dispatch({
        type: RECOMMENDATIONS_SUCCESS,
        payload: data || [],
      });
    } catch (error) {
      dispatch({
        type: RECOMMENDATIONS_ERROR,
        payload: error?.message || "Errore durante il caricamento delle raccomandazioni.",
      });
    }
  };
};

/**
 * Nota per me futuro:
 * - Chiama GET /api/QuestionnaireAdmin/analytics/overview
 * - Usa Redux Thunk (funzione che ritorna async dispatch).
 * - Il componente admin dashboard si limiterà a dispatchare questa action
 *   e leggere loading / overview / error dal reducer questionnaireAnalytics.
 */
export const fetchQuestionnaireAnalyticsOverview = () => {
  // eslint-disable-next-line no-unused-vars
  return async (dispatch, getState) => {
    dispatch({ type: FETCH_QUESTIONNAIRE_ANALYTICS_REQUEST });

    try {
      const res = await apiFetch("/api/QuestionnaireAdmin/analytics/overview", {
        method: "GET",
      });

      if (!res.ok) {
        // cerco di leggere un messaggio dal backend, se c'è
        let message = "Errore nel caricamento delle analytics.";
        try {
          const data = await res.json();
          if (data?.message) message = data.message;
        } catch {
          // fallback al messaggio di default
        }

        dispatch({
          type: FETCH_QUESTIONNAIRE_ANALYTICS_FAILURE,
          payload: message,
        });
        return;
      }

      const data = await res.json(); // dovrebbe essere QuestionnaireAnalyticsOverviewDto

      dispatch({
        type: FETCH_QUESTIONNAIRE_ANALYTICS_SUCCESS,
        payload: data,
      });
    } catch (err) {
      dispatch({
        type: FETCH_QUESTIONNAIRE_ANALYTICS_FAILURE,
        payload: err?.message || "Errore imprevisto nel caricamento delle analytics.",
      });
    }
  };
};

// Nota per me futuro:
// - Carica overview generi (lista + stats) per pagina admin generi.
export const fetchAdminGenres = () => {
  return async (dispatch) => {
    dispatch({ type: ADMIN_TAXONOMY_GENRES_FETCH_REQUEST });
    try {
      const res = await apiFetch("/api/AdminTaxonomy/genres", { method: "GET" });
      if (!res.ok) {
        const msg = `Errore ${res.status} nel caricamento generi.`;
        dispatch({ type: ADMIN_TAXONOMY_GENRES_FETCH_FAILURE, payload: msg });
        return;
      }
      const data = await res.json();
      dispatch({ type: ADMIN_TAXONOMY_GENRES_FETCH_SUCCESS, payload: data });
    } catch (err) {
      dispatch({
        type: ADMIN_TAXONOMY_GENRES_FETCH_FAILURE,
        payload: err?.message || "Errore imprevisto nel caricamento generi.",
      });
    }
  };
};

// Crea genere
// prima: export const createAdminGenre = (name) => {
export const createAdminGenre = ({ name, keywordsIt }) => {
  return async (dispatch) => {
    try {
      const res = await apiFetch("/api/AdminTaxonomy/genres", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          keywordsIt: keywordsIt || null, // 👈 nuovo campo
        }),
      });

      if (!res.ok) {
        let message = "Errore nella creazione del genere.";
        try {
          const json = await res.json();
          if (json?.message) message = json.message;
        } catch (parseError) {
          console.warn("Impossibile leggere il JSON di errore dell'API", parseError);
        }
        return Promise.reject(new Error(message));
      }

      const data = await res.json();
      dispatch({ type: ADMIN_TAXONOMY_GENRE_CREATE_SUCCESS, payload: data });
      return data;
    } catch (err) {
      return Promise.reject(err);
    }
  };
};

// Update genere
export const updateAdminGenre = (id, payload) => {
  return async (dispatch) => {
    try {
      const res = await apiFetch(`/api/AdminTaxonomy/genres/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: payload.name,
          keywordsIt: payload.keywordsIt ?? null, // importante!
        }),
      });

      if (!res.ok) {
        let message = "Errore nell'aggiornamento del genere.";
        try {
          const json = await res.json();
          if (json?.message) message = json.message;
        } catch (parseError) {
          console.warn("Impossibile leggere il JSON di errore dell'API", parseError);
        }
        return Promise.reject(new Error(message));
      }

      const data = await res.json();
      dispatch({ type: ADMIN_TAXONOMY_GENRE_UPDATE_SUCCESS, payload: data });
      return data;
    } catch (err) {
      return Promise.reject(err);
    }
  };
};

// Delete genere
export const deleteAdminGenre = (id) => {
  return async (dispatch) => {
    try {
      const res = await apiFetch(`/api/AdminTaxonomy/genres/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        let message = "Errore nell'eliminazione del genere.";
        try {
          const json = await res.json();
          if (json?.message) message = json.message;
        } catch (parseError) {
          console.warn("Impossibile leggere il JSON di errore dell'API", parseError);
        }
        return Promise.reject(new Error(message));
      }

      dispatch({ type: ADMIN_TAXONOMY_GENRE_DELETE_SUCCESS, payload: id });
      return true;
    } catch (err) {
      return Promise.reject(err);
    }
  };
};

export const fetchAdminTags = () => {
  return async (dispatch) => {
    dispatch({ type: ADMIN_TAXONOMY_TAGS_FETCH_REQUEST });
    try {
      const res = await apiFetch("/api/AdminTaxonomy/tags", { method: "GET" });
      if (!res.ok) {
        const msg = `Errore ${res.status} nel caricamento tag.`;
        dispatch({ type: ADMIN_TAXONOMY_TAGS_FETCH_FAILURE, payload: msg });
        return;
      }
      const data = await res.json();
      dispatch({ type: ADMIN_TAXONOMY_TAGS_FETCH_SUCCESS, payload: data });
    } catch (err) {
      dispatch({
        type: ADMIN_TAXONOMY_TAGS_FETCH_FAILURE,
        payload: err?.message || "Errore imprevisto nel caricamento tag.",
      });
    }
  };
};

export const createAdminTag = (payload) => {
  // payload: { code, displayName, category, description, isActive, displayOrder }
  return async (dispatch) => {
    try {
      const res = await apiFetch("/api/AdminTaxonomy/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let message = "Errore nella creazione del tag.";
        try {
          const json = await res.json();
          if (json?.message) message = json.message;
        } catch (parseError) {
          console.warn("Impossibile leggere il JSON di errore dell'API", parseError);
        }
        return Promise.reject(new Error(message));
      }

      const data = await res.json();
      dispatch({ type: ADMIN_TAXONOMY_TAG_CREATE_SUCCESS, payload: data });
      return data;
    } catch (err) {
      return Promise.reject(err);
    }
  };
};

// updateAdminTag(id, { displayName, category, description, isActive, displayOrder })
export const updateAdminTag = (id, payload) => {
  return async (dispatch) => {
    try {
      const body = {
        code: payload.code, // se NON vuoi permettere update del code, togli questo
        displayName: payload.displayName,
        category: payload.category,
        description: payload.description || null,
        keywordsIt: payload.keywordsIt || null,
        isActive: payload.isActive,
        displayOrder: payload.displayOrder,
      };

      const res = await apiFetch(`/api/AdminTaxonomy/tags/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        let message = "Errore nell'aggiornamento del tag.";
        try {
          const json = await res.json();
          if (json?.message) message = json.message;
        } catch (parseError) {
          console.warn("Impossibile leggere il JSON di errore dell'API", parseError);
        }
        return Promise.reject(new Error(message));
      }

      const data = await res.json();
      dispatch({ type: ADMIN_TAXONOMY_TAG_UPDATE_SUCCESS, payload: data });
      return data;
    } catch (err) {
      return Promise.reject(err);
    }
  };
};

export const deleteAdminTag = (id) => {
  return async (dispatch) => {
    try {
      const res = await apiFetch(`/api/AdminTaxonomy/tags/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        let message = "Errore nell'eliminazione del tag.";
        try {
          const json = await res.json();
          if (json?.message) message = json.message;
        } catch (parseError) {
          console.warn("Impossibile leggere il JSON di errore dell'API", parseError);
        }
        return Promise.reject(new Error(message));
      }

      dispatch({ type: ADMIN_TAXONOMY_TAG_DELETE_SUCCESS, payload: id });
      return true;
    } catch (err) {
      return Promise.reject(err);
    }
  };
};

export const fetchAdminMetadata = () => {
  return async (dispatch) => {
    dispatch({ type: ADMIN_TAXONOMY_METADATA_FETCH_REQUEST });
    try {
      const res = await apiFetch("/api/AdminTaxonomy/metadata", { method: "GET" });

      if (!res.ok) {
        const msg = `Errore ${res.status} nel caricamento metadata.`;
        dispatch({ type: ADMIN_TAXONOMY_METADATA_FETCH_FAILURE, payload: msg });
        return;
      }

      const data = await res.json();
      dispatch({ type: ADMIN_TAXONOMY_METADATA_FETCH_SUCCESS, payload: data });
    } catch (err) {
      dispatch({
        type: ADMIN_TAXONOMY_METADATA_FETCH_FAILURE,
        payload: err?.message || "Errore imprevisto nel caricamento metadata.",
      });
    }
  };
};

// CREATE FOCUS
export const createAdminMetadataFocus = ({ code, name, description, keywordsIt }) => {
  return async (dispatch) => {
    try {
      const res = await apiFetch("/api/AdminTaxonomy/metadata/focus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          name,
          description: description || null,
          keywordsIt: keywordsIt || null, // 👈 nuovo campo
        }),
      });

      if (!res.ok) {
        let message = "Errore nella creazione del focus.";
        try {
          const json = await res.json();
          if (json?.message) message = json.message;
        } catch {
          // tengo il messaggio di default
        }
        return Promise.reject(new Error(message));
      }

      const data = await res.json(); // MetadataAdminListItemDto
      dispatch({
        type: ADMIN_TAXONOMY_METADATA_CREATE_SUCCESS,
        payload: data,
      });

      return data;
    } catch (err) {
      return Promise.reject(err instanceof Error ? err : new Error("Errore imprevisto nella creazione del focus."));
    }
  };
};

// UPDATE FOCUS
export const updateAdminMetadataFocus = (id, payload) => {
  return async (dispatch) => {
    try {
      const body = {
        name: payload.name,
        description: payload.description || null,
        keywordsIt: payload.keywordsIt || null,
      };

      const res = await apiFetch(`/api/AdminTaxonomy/metadata/focus/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        let message = "Errore nell'aggiornamento del focus.";
        try {
          const json = await res.json();
          if (json?.message) message = json.message;
        } catch (parseError) {
          console.warn("Impossibile leggere il JSON di errore dell'API", parseError);
        }
        return Promise.reject(new Error(message));
      }

      const data = await res.json(); // MetadataAdminListItemDto aggiornato

      dispatch({
        type: ADMIN_TAXONOMY_METADATA_UPDATE_SUCCESS,
        payload: data,
      });

      return data;
    } catch (err) {
      return Promise.reject(err instanceof Error ? err : new Error("Errore imprevisto nell'aggiornamento del focus."));
    }
  };
};

// DELETE FOCUS
export const deleteAdminMetadataFocus = (id) => {
  return async (dispatch) => {
    try {
      const res = await apiFetch(`/api/AdminTaxonomy/metadata/focus/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        let message = "Errore nell'eliminazione del focus.";
        try {
          const json = await res.json();
          if (json?.message) message = json.message;
        } catch (parseError) {
          console.warn("Impossibile leggere il JSON di errore dell'API", parseError);
        }
        return Promise.reject(new Error(message));
      }

      dispatch({
        type: ADMIN_TAXONOMY_METADATA_DELETE_SUCCESS,
        payload: id,
      });

      return true;
    } catch (err) {
      return Promise.reject(err instanceof Error ? err : new Error("Errore imprevisto nell'eliminazione del focus."));
    }
  };
};

// CREATE MOOD
export const createAdminMetadataMood = ({ code, name, description, keywordsIt }) => {
  return async (dispatch) => {
    try {
      const res = await apiFetch("/api/AdminTaxonomy/metadata/mood", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          name,
          description: description || null,
          keywordsIt: keywordsIt || null, // 👈 nuovo campo
        }),
      });

      if (!res.ok) {
        let message = "Errore nella creazione del mood.";
        try {
          const json = await res.json();
          if (json?.message) message = json.message;
        } catch (parseError) {
          console.warn("Impossibile leggere il JSON di errore dell'API", parseError);
        }
        return Promise.reject(new Error(message));
      }

      const data = await res.json(); // MetadataAdminListItemDto
      dispatch({
        type: ADMIN_TAXONOMY_METADATA_CREATE_SUCCESS,
        payload: data,
      });

      return data;
    } catch (err) {
      return Promise.reject(err instanceof Error ? err : new Error("Errore imprevisto nella creazione del mood."));
    }
  };
};

// UPDATE MOOD
export const updateAdminMetadataMood = (id, payload) => {
  return async (dispatch) => {
    try {
      const body = {
        name: payload.name,
        description: payload.description || null,
        keywordsIt: payload.keywordsIt || null,
      };

      const res = await apiFetch(`/api/AdminTaxonomy/metadata/mood/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        let message = "Errore nell'aggiornamento del mood.";
        try {
          const json = await res.json();
          if (json?.message) message = json.message;
        } catch (parseError) {
          console.warn("Impossibile leggere il JSON di errore dell'API", parseError);
        }
        return Promise.reject(new Error(message));
      }

      const data = await res.json();

      dispatch({
        type: ADMIN_TAXONOMY_METADATA_UPDATE_SUCCESS,
        payload: data,
      });

      return data;
    } catch (err) {
      return Promise.reject(err instanceof Error ? err : new Error("Errore imprevisto nell'aggiornamento del mood."));
    }
  };
};

// DELETE MOOD
export const deleteAdminMetadataMood = (id) => {
  return async (dispatch) => {
    try {
      const res = await apiFetch(`/api/AdminTaxonomy/metadata/mood/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        let message = "Errore nell'eliminazione del mood.";
        try {
          const json = await res.json();
          if (json?.message) message = json.message;
        } catch (parseError) {
          console.warn("Impossibile leggere il JSON di errore dell'API", parseError);
        }
        return Promise.reject(new Error(message));
      }

      dispatch({
        type: ADMIN_TAXONOMY_METADATA_DELETE_SUCCESS,
        payload: id,
      });

      return true;
    } catch (err) {
      return Promise.reject(err instanceof Error ? err : new Error("Errore imprevisto nell'eliminazione del mood."));
    }
  };
};

// CREATE DIFFICULTY
export const createAdminMetadataDifficulty = ({ code, name, description, keywordsIt }) => {
  return async (dispatch) => {
    try {
      const res = await apiFetch("/api/AdminTaxonomy/metadata/difficulty", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          name,
          description: description || null,
          keywordsIt: keywordsIt || null, // 👈 nuovo campo
        }),
      });

      if (!res.ok) {
        let message = "Errore nella creazione della difficoltà.";
        try {
          const json = await res.json();
          if (json?.message) message = json.message;
        } catch (parseError) {
          console.warn("Impossibile leggere il JSON di errore dell'API", parseError);
        }
        return Promise.reject(new Error(message));
      }

      const data = await res.json();

      dispatch({
        type: ADMIN_TAXONOMY_METADATA_CREATE_SUCCESS,
        payload: data,
      });

      return data;
    } catch (err) {
      return Promise.reject(err instanceof Error ? err : new Error("Errore imprevisto nella creazione della difficoltà."));
    }
  };
};

// UPDATE DIFFICULTY
export const updateAdminMetadataDifficulty = (id, payload) => {
  return async (dispatch) => {
    try {
      const body = {
        name: payload.name,
        description: payload.description || null,
        keywordsIt: payload.keywordsIt || null,
      };

      const res = await apiFetch(`/api/AdminTaxonomy/metadata/difficulty/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        let message = "Errore nell'aggiornamento della difficoltà.";
        try {
          const json = await res.json();
          if (json?.message) message = json.message;
        } catch (parseError) {
          console.warn("Impossibile leggere il JSON di errore dell'API", parseError);
        }
        return Promise.reject(new Error(message));
      }

      const data = await res.json();

      dispatch({
        type: ADMIN_TAXONOMY_METADATA_UPDATE_SUCCESS,
        payload: data,
      });

      return data;
    } catch (err) {
      return Promise.reject(err instanceof Error ? err : new Error("Errore imprevisto nell'aggiornamento della difficoltà."));
    }
  };
};

// DELETE DIFFICULTY
export const deleteAdminMetadataDifficulty = (id) => {
  return async (dispatch) => {
    try {
      const res = await apiFetch(`/api/AdminTaxonomy/metadata/difficulty/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        let message = "Errore nell'eliminazione della difficoltà.";
        try {
          const json = await res.json();
          if (json?.message) message = json.message;
        } catch (parseError) {
          console.warn("Impossibile leggere il JSON di errore dell'API", parseError);
        }
        return Promise.reject(new Error(message));
      }

      dispatch({
        type: ADMIN_TAXONOMY_METADATA_DELETE_SUCCESS,
        payload: id,
      });

      return true;
    } catch (err) {
      return Promise.reject(err instanceof Error ? err : new Error("Errore imprevisto nell'eliminazione della difficoltà."));
    }
  };
};

// Carica overview domande attive
export const fetchQuestionnaireActiveOverview = () => {
  return async (dispatch) => {
    dispatch({ type: QUESTIONNAIRE_ACTIVE_FETCH_REQUEST });

    try {
      const res = await apiFetch("/api/QuestionnaireAdmin/questions/active-overview", {
        method: "GET",
      });

      if (!res.ok) {
        let message = "Errore nel caricamento delle domande attive.";
        try {
          const json = await res.json();
          if (json?.message) message = json.message;
        } catch (parseError) {
          console.warn("Impossibile leggere il JSON di errore dell'API", parseError);
        }
        dispatch({ type: QUESTIONNAIRE_ACTIVE_FETCH_FAILURE, payload: message });
        return;
      }

      const data = await res.json();
      dispatch({ type: QUESTIONNAIRE_ACTIVE_FETCH_SUCCESS, payload: data });
    } catch (err) {
      dispatch({
        type: QUESTIONNAIRE_ACTIVE_FETCH_FAILURE,
        payload: err?.message || "Errore imprevisto nel caricamento domande attive.",
      });
    }
  };
};

// Toggle attivo / non attivo su una domanda
export const setQuestionActive = (questionId, isActive) => {
  return async (dispatch) => {
    dispatch({ type: QUESTIONNAIRE_ACTIVE_TOGGLE_REQUEST, payload: questionId });

    try {
      const res = await apiFetch(`/api/QuestionnaireAdmin/questions/${questionId}/active`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive }),
      });

      if (!res.ok) {
        let message = "Errore nel cambio stato della domanda.";
        try {
          const json = await res.json();
          if (json?.message) message = json.message;
        } catch (parseError) {
          console.warn("Impossibile leggere il JSON di errore dell'API", parseError);
        }
        dispatch({
          type: QUESTIONNAIRE_ACTIVE_TOGGLE_FAILURE,
          payload: { questionId, message },
        });
        return;
      }

      dispatch({
        type: QUESTIONNAIRE_ACTIVE_TOGGLE_SUCCESS,
        payload: { questionId, isActive },
      });
    } catch (err) {
      dispatch({
        type: QUESTIONNAIRE_ACTIVE_TOGGLE_FAILURE,
        payload: { questionId, message: err?.message },
      });
    }
  };
};

/**
 * Carica tutti gli effetti (Genre/Tag/Metadata) per UNA singola option.
 *
 * Nota per me futuro:
 * - backend: GET /api/QuestionnaireAdmin/options/{optionId}/effects
 * - response: QuestionnaireOptionEffectAdminDto[]
 */
export const fetchOptionEffects = (optionId) => {
  return async (dispatch) => {
    dispatch({
      type: QUESTIONNAIRE_EFFECTS_FETCH_REQUEST,
      payload: { optionId },
    });

    try {
      const res = await apiFetch(`/api/QuestionnaireAdmin/options/${optionId}/effects`, {
        method: "GET",
      });

      if (!res.ok) {
        let message = "Errore nel caricamento degli effetti dell'opzione.";
        try {
          const json = await res.json();
          if (json?.message) message = json.message;
        } catch {
          // tengo il messaggio di default
        }

        dispatch({
          type: QUESTIONNAIRE_EFFECTS_FETCH_FAILURE,
          payload: { optionId, message },
        });
        return;
      }

      const data = await res.json(); // array di QuestionnaireOptionEffectAdminDto

      dispatch({
        type: QUESTIONNAIRE_EFFECTS_FETCH_SUCCESS,
        payload: { optionId, effects: Array.isArray(data) ? data : [] },
      });
    } catch (err) {
      dispatch({
        type: QUESTIONNAIRE_EFFECTS_FETCH_FAILURE,
        payload: {
          optionId,
          message: err?.message || "Errore imprevisto nel caricamento degli effetti.",
        },
      });
    }
  };
};

/**
 * Crea un nuovo effetto per una option.
 *
 * payload:
 * {
 *   effectType: "Genre" | "Tag" | "Metadata",
 *   genreId?: number,
 *   tagId?: number,
 *   metadataCode?: string,
 *   deltaWeight: number
 * }
 */
export const createOptionEffect = (optionId, dto) => {
  // dto deve già essere del tipo:
  // { optionId, effectType (int), genreId, tagId, metadataCode, deltaWeight }
  return async (dispatch) => {
    dispatch({
      type: QUESTIONNAIRE_EFFECTS_CREATE_REQUEST,
      payload: { optionId },
    });

    try {
      const res = await apiFetch(`/api/QuestionnaireAdmin/effects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dto),
      });

      if (!res.ok) {
        let message = "Errore nella creazione dell'effetto.";
        try {
          const json = await res.json();
          if (json?.message) message = json.message;
        } catch {
          // tengo il default
        }

        dispatch({
          type: QUESTIONNAIRE_EFFECTS_CREATE_FAILURE,
          payload: { optionId, message },
        });

        return Promise.reject(new Error(message));
      }

      const data = await res.json(); // QuestionnaireOptionEffectDto

      dispatch({
        type: QUESTIONNAIRE_EFFECTS_CREATE_SUCCESS,
        payload: { optionId, effect: data },
      });

      return data;
    } catch (err) {
      const message = err?.message || "Errore imprevisto nella creazione dell'effetto.";
      dispatch({
        type: QUESTIONNAIRE_EFFECTS_CREATE_FAILURE,
        payload: { optionId, message },
      });
      return Promise.reject(new Error(message));
    }
  };
};

/**
 * Aggiorna un effetto esistente (per ora solo deltaWeight).
 *
 * payload: { deltaWeight: number }
 */
export const updateOptionEffect = (optionId, effectId, dto) => {
  // dto: { effectType (int), genreId, tagId, metadataCode, deltaWeight }
  return async (dispatch) => {
    dispatch({
      type: QUESTIONNAIRE_EFFECTS_UPDATE_REQUEST,
      payload: { optionId, effectId },
    });

    try {
      const res = await apiFetch(`/api/QuestionnaireAdmin/effects/${effectId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: effectId,
          ...dto,
        }),
      });

      if (!res.ok) {
        let message = "Errore nell'aggiornamento dell'effetto.";
        try {
          const json = await res.json();
          if (json?.message) message = json.message;
        } catch {
          // default
        }

        dispatch({
          type: QUESTIONNAIRE_EFFECTS_UPDATE_FAILURE,
          payload: { optionId, effectId, message },
        });

        return Promise.reject(new Error(message));
      }

      const data = await res.json(); // QuestionnaireOptionEffectDto aggiornato

      dispatch({
        type: QUESTIONNAIRE_EFFECTS_UPDATE_SUCCESS,
        payload: { optionId, effect: data },
      });

      return data;
    } catch (err) {
      const message = err?.message || "Errore imprevisto nell'aggiornamento dell'effetto.";
      dispatch({
        type: QUESTIONNAIRE_EFFECTS_UPDATE_FAILURE,
        payload: { optionId, effectId, message },
      });
      return Promise.reject(new Error(message));
    }
  };
};

/**
 * Elimina un effetto da una option.
 */
export const deleteOptionEffect = (optionId, effectId) => {
  return async (dispatch) => {
    dispatch({
      type: QUESTIONNAIRE_EFFECTS_DELETE_REQUEST,
      payload: { optionId, effectId },
    });

    try {
      const res = await apiFetch(`/api/QuestionnaireAdmin/effects/${effectId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        let message = "Errore nell'eliminazione dell'effetto.";
        try {
          const json = await res.json();
          if (json?.message) message = json.message;
        } catch {
          // default
        }

        dispatch({
          type: QUESTIONNAIRE_EFFECTS_DELETE_FAILURE,
          payload: { optionId, effectId, message },
        });

        return Promise.reject(new Error(message));
      }

      dispatch({
        type: QUESTIONNAIRE_EFFECTS_DELETE_SUCCESS,
        payload: { optionId, effectId },
      });

      return true;
    } catch (err) {
      const message = err?.message || "Errore imprevisto nell'eliminazione dell'effetto.";
      dispatch({
        type: QUESTIONNAIRE_EFFECTS_DELETE_FAILURE,
        payload: { optionId, effectId, message },
      });
      return Promise.reject(new Error(message));
    }
  };
};

/**
 * Richiede al backend i suggerimenti di link per un'entità
 * (es: "Tag #Singleplayer", "Metadata FOCUS:STORY", ecc.)
 *
 * request:
 * {
 *   entityType: "Genre" | "Tag" | "Metadata",
 *   entityId?: number,        // Genre / Tag
 *   metadataCode?: string,    // Metadata
 *   questionId?: number,
 *   defaultDelta?: number,
 *   maxSuggestions?: number
 * }
 */
export const fetchEntityLinkSuggestions = (request) => {
  return async (dispatch) => {
    dispatch({
      type: QUESTIONNAIRE_EFFECTS_SUGGESTIONS_REQUEST,
      payload: { request },
    });

    try {
      const res = await apiFetch("/api/QuestionnaireAdmin/entities/link-suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      });

      if (!res.ok) {
        let message = "Errore nel caricamento dei suggerimenti.";
        try {
          const json = await res.json();
          if (json?.message) message = json.message;
        } catch {
          // default
        }

        dispatch({
          type: QUESTIONNAIRE_EFFECTS_SUGGESTIONS_FAILURE,
          payload: { message },
        });

        return Promise.reject(new Error(message));
      }

      const data = await res.json(); // EntityLinkSuggestionResponseDto

      dispatch({
        type: QUESTIONNAIRE_EFFECTS_SUGGESTIONS_SUCCESS,
        payload: { data },
      });

      return data;
    } catch (err) {
      const message = err?.message || "Errore imprevisto nel caricamento dei suggerimenti.";
      dispatch({
        type: QUESTIONNAIRE_EFFECTS_SUGGESTIONS_FAILURE,
        payload: { message },
      });
      return Promise.reject(new Error(message));
    }
  };
};

/**
 * Pulisce i suggerimenti correnti (es. quando chiudo il modal).
 */
export const clearEntityLinkSuggestions = () => ({
  type: QUESTIONNAIRE_EFFECTS_SUGGESTIONS_CLEAR,
});

/**
 * Crea una nuova domanda.
 *
 * DTO di input (QuestionnaireQuestionCreateDto) – esempio:
 * {
 *   code: "PRIMARY_MOTIVATION",
 *   textIt: "Testo in italiano",
 *   isMultipleChoice: false,
 *   order: 10
 * }
 */
export const createQuestionnaireQuestion = (questionDto) => {
  return async (dispatch) => {
    dispatch({ type: QUESTIONNAIRE_ADMIN_CREATE_QUESTION_REQUEST });

    try {
      const res = await apiFetch("/api/QuestionnaireAdmin/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(questionDto),
      });

      if (!res.ok) {
        let message = "Errore nella creazione della domanda.";
        try {
          const json = await res.json();
          if (json?.message) message = json.message;
        } catch {
          // ignore
        }
        dispatch({
          type: QUESTIONNAIRE_ADMIN_CREATE_QUESTION_FAILURE,
          payload: message,
        });
        return;
      }

      const created = await res.json();

      dispatch({
        type: QUESTIONNAIRE_ADMIN_CREATE_QUESTION_SUCCESS,
        payload: created,
      });

      // Ricarico la lista intera per avere struttura aggiornata
      dispatch(fetchQuestionnaireActiveOverview());
    } catch (err) {
      dispatch({
        type: QUESTIONNAIRE_ADMIN_CREATE_QUESTION_FAILURE,
        payload: err?.message || "Errore imprevisto nella creazione della domanda.",
      });
    }
  };
};

// =========================
// Domande – UPDATE
// =========================

/**
 * Aggiorna una domanda esistente.
 *
 * DTO di input (QuestionnaireQuestionUpdateDto) – esempio:
 * {
 *   textIt: "Nuovo testo",
 *   isMultipleChoice: true,
 *   order: 20,
 *   // eventuali altri campi aggiornabili
 * }
 */
export const updateQuestionnaireQuestion = (questionId, updateDto) => {
  return async (dispatch) => {
    dispatch({
      type: QUESTIONNAIRE_ADMIN_UPDATE_QUESTION_REQUEST,
      payload: questionId,
    });

    try {
      const res = await apiFetch(`/api/QuestionnaireAdmin/questions/${questionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateDto),
      });

      if (!res.ok) {
        let message = "Errore nell'aggiornamento della domanda.";
        try {
          const json = await res.json();
          if (json?.message) message = json.message;
        } catch {
          // ignore
        }
        dispatch({
          type: QUESTIONNAIRE_ADMIN_UPDATE_QUESTION_FAILURE,
          payload: { questionId, message },
        });
        return;
      }

      const updated = await res.json();

      dispatch({
        type: QUESTIONNAIRE_ADMIN_UPDATE_QUESTION_SUCCESS,
        payload: updated,
      });

      // Ricarico struttura
      dispatch(fetchQuestionnaireActiveOverview());
    } catch (err) {
      dispatch({
        type: QUESTIONNAIRE_ADMIN_UPDATE_QUESTION_FAILURE,
        payload: { questionId, message: err?.message },
      });
    }
  };
};

// =========================
// Opzioni – CREATE
// =========================

/**
 * Crea una nuova opzione per una domanda.
 *
 * DTO di input (QuestionnaireOptionCreateDto) – esempio:
 * {
 *   questionId: 1,
 *   textIt: "Testo opzione",
 *   baseWeight: 12
 * }
 */
export const createQuestionnaireOption = (optionDto) => {
  return async (dispatch) => {
    dispatch({ type: QUESTIONNAIRE_ADMIN_CREATE_OPTION_REQUEST });

    try {
      const res = await apiFetch("/api/QuestionnaireAdmin/options", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(optionDto),
      });

      if (!res.ok) {
        let message = "Errore nella creazione dell'opzione.";
        try {
          const json = await res.json();
          if (json?.message) message = json.message;
        } catch {
          // ignore
        }
        dispatch({
          type: QUESTIONNAIRE_ADMIN_CREATE_OPTION_FAILURE,
          payload: message,
        });
        return;
      }

      const created = await res.json();

      dispatch({
        type: QUESTIONNAIRE_ADMIN_CREATE_OPTION_SUCCESS,
        payload: created,
      });

      // Ricarico struttura
      dispatch(fetchQuestionnaireActiveOverview());
    } catch (err) {
      dispatch({
        type: QUESTIONNAIRE_ADMIN_CREATE_OPTION_FAILURE,
        payload: err?.message || "Errore imprevisto nella creazione dell'opzione.",
      });
    }
  };
};

// =========================
// Opzioni – UPDATE
// =========================

/**
 * Aggiorna una opzione esistente.
 *
 * DTO di input (QuestionnaireOptionUpdateDto) – esempio:
 * {
 *   textIt: "Nuovo testo opzione",
 *   baseWeight: 10
 * }
 */
export const updateQuestionnaireOption = (optionId, updateDto) => {
  return async (dispatch) => {
    dispatch({
      type: QUESTIONNAIRE_ADMIN_UPDATE_OPTION_REQUEST,
      payload: optionId,
    });

    try {
      const res = await apiFetch(`/api/QuestionnaireAdmin/options/${optionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateDto),
      });

      if (!res.ok) {
        let message = "Errore nell'aggiornamento dell'opzione.";
        try {
          const json = await res.json();
          if (json?.message) message = json.message;
        } catch {
          // ignore
        }
        dispatch({
          type: QUESTIONNAIRE_ADMIN_UPDATE_OPTION_FAILURE,
          payload: { optionId, message },
        });
        return;
      }

      const updated = await res.json();

      dispatch({
        type: QUESTIONNAIRE_ADMIN_UPDATE_OPTION_SUCCESS,
        payload: updated,
      });

      // Ricarico struttura
      dispatch(fetchQuestionnaireActiveOverview());
    } catch (err) {
      dispatch({
        type: QUESTIONNAIRE_ADMIN_UPDATE_OPTION_FAILURE,
        payload: { optionId, message: err?.message },
      });
    }
  };
};

// =========================
// Opzioni – DELETE
// =========================

/**
 * Elimina una opzione.
 */
export const deleteQuestionnaireOption = (optionId) => {
  return async (dispatch) => {
    dispatch({
      type: QUESTIONNAIRE_ADMIN_DELETE_OPTION_REQUEST,
      payload: optionId,
    });

    try {
      const res = await apiFetch(`/api/QuestionnaireAdmin/options/${optionId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        let message = "Errore nell'eliminazione dell'opzione.";
        try {
          const json = await res.json();
          if (json?.message) message = json.message;
        } catch {
          // ignore
        }
        dispatch({
          type: QUESTIONNAIRE_ADMIN_DELETE_OPTION_FAILURE,
          payload: { optionId, message },
        });
        return;
      }

      dispatch({
        type: QUESTIONNAIRE_ADMIN_DELETE_OPTION_SUCCESS,
        payload: optionId,
      });

      // Ricarico struttura
      dispatch(fetchQuestionnaireActiveOverview());
    } catch (err) {
      dispatch({
        type: QUESTIONNAIRE_ADMIN_DELETE_OPTION_FAILURE,
        payload: { optionId, message: err?.message },
      });
    }
  };
};

/**
 * Registra che l'utente ha visualizzato la pagina di un gioco (Viewed).
 * Usa getState per:
 * - NON chiamare l'API se l'utente non è loggato
 * - evitare spam se abbiamo appena registrato lo stesso gioco.
 */
export const markGameViewed = (gameId) => {
  return async (dispatch, getState) => {
    if (!gameId) return;

    const state = getState();
    const authUser = state.auth?.user;

    // se non sono loggato non ha senso chiamare l'endpoint
    if (!authUser?.userId) return;

    const viewedState = state.gameInteractions?.viewed || {};
    const { lastViewedGameId, lastViewedAt, loading } = viewedState;

    // se stiamo già inviando una richiesta, non spammare
    if (loading) return;

    const now = Date.now();

    // se è lo stesso gioco appena registrato (es. entro 30s), saltiamo
    if (lastViewedGameId === gameId && lastViewedAt && now - lastViewedAt < 30 * 1000) {
      return;
    }

    dispatch({
      type: MARK_GAME_VIEWED_REQUEST,
      meta: { gameId },
    });

    try {
      const res = await apiFetch(`/api/GameInteraction/${gameId}/viewed`, {
        method: "POST",
      });

      // se per qualche motivo l'utente è diventato 401 nel frattempo
      if (res.status === 401) {
        dispatch({
          type: MARK_GAME_VIEWED_FAIL,
          payload: "Utente non autenticato.",
          error: true,
          meta: { gameId },
        });
        return;
      }

      if (!res.ok) {
        throw new Error("Impossibile registrare la visualizzazione del gioco.");
      }

      await safeJson(res);

      dispatch({
        type: MARK_GAME_VIEWED_SUCCESS,
        payload: {
          gameId,
          timestamp: now,
        },
        meta: { gameId },
      });
    } catch (error) {
      console.error("[markGameViewed] exception", error);

      dispatch({
        type: MARK_GAME_VIEWED_FAIL,
        payload: error?.message || "Errore imprevisto durante la registrazione della visualizzazione.",
        error: true,
        meta: { gameId },
      });
    }
  };
};
