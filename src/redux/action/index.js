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
  USER_DATA_CLEAR,
  USER_DATA_ERROR,
  USER_DATA_REQUEST,
  USER_DATA_SUCCESS,
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
} from "../authTypes";
import { STATUS_TO_ENUM } from "../../utils/statusMapper";

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

//azione per prelevare dal db i dettagli di un giocatore
export const loadUserDetails = (userId, { publicProfile = false } = {}) => {
  return async (dispatch) => {
    dispatch({ type: USER_DATA_REQUEST });

    try {
      const url = publicProfile
        ? `/api/Users/GetUtenteById?id=${userId}` // profilo di un altro (solo dati pubblici)
        : `/api/Users/MyProfile?id=${userId}`; // mio profilo (include review private, progress ecc.)

      const response = await apiFetch(url, { method: "GET" });

      if (response.status === 401) {
        return;
      }

      if (!response.ok) {
        throw new Error("Impossibile caricare i dati");
      }

      const data = await safeJson(response);

      dispatch({
        type: USER_DATA_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: USER_DATA_ERROR,
        payload: error?.message || "Errore durante il caricamento, riprova più tardi",
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

    dispatch({ type: UPDATE_USER_GAME_REQUEST });

    try {
      const statusEnum = mapStatusToEnum(patch.status);

      const payload = {
        status: statusEnum,
        progress: patch.progress,
        rating: patch.rating,
        review: patch.review,
        isReviewPublic: patch.isReviewPublic,
      };

      const res = await apiFetch(`/api/UserGames/UpdateUserGame/${userGameId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await safeJson(res);

      if (!res.ok) {
        console.error("[loadPatchUsergame] API error", data);

        let apiMsg;

        if (typeof data === "string") {
          apiMsg = data;
        } else {
          apiMsg = data?.errors?.request?.[0] || data?.errors?.status?.[0] || data?.title || "Impossibile modificare i dettagli del gioco.";
        }

        throw new Error(apiMsg);
      }

      dispatch({ type: UPDATE_USER_GAME_SUCCESS });

      if (effectiveUserId) {
        dispatch(
          loadUserDetails(effectiveUserId, {
            publicProfile: !isMe,
          }),
        );
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

//metodo per la delete usergame
export const loadDeleteUsergame = (userGameId, isMe) => {
  return async (dispatch, getState) => {
    const state = getState();
    const authUser = state.auth.user;
    const effectiveUserId = state.userData.userDetails?.userId ?? authUser?.userId ?? null;

    dispatch({ type: DELETE_USER_GAME_REQUEST });
    try {
      const res = await apiFetch(`/api/UserGames/DeleteUserGame/${userGameId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Impossibile eliminare il gioco nella libreria.");
      }

      await safeJson(res);

      dispatch({ type: DELETE_USER_GAME_SUCCESS });

      if (effectiveUserId) {
        dispatch(
          loadUserDetails(effectiveUserId, {
            publicProfile: !isMe,
          }),
        );
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
      const res = await apiFetch(`/api/Recommendation?take=50`);

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
