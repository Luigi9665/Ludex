import { jwtDecode } from "jwt-decode";
import { apiFetch } from "../../apiFetch Autenticate/apiFetch";
import {
  GENRES_ERROR,
  GENRES_REQUEST,
  GENRES_SUCCESS,
  LATESTREVIEWS_ERROR,
  LATESTREVIEWS_REQUEST,
  LATESTREVIEWS_SUCCESS,
  LOGIN_ERROR,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT,
  PLATFORMS_ERROR,
  PLATFORMS_REQUEST,
  PLATFORMS_SUCCESS,
  TOPREVIEWERS_ERROR,
  TOPREVIEWERS_REQUEST,
  TOPREVIEWERS_SUCCESS,
  TRENDING_ERROR,
  TRENDING_REQUEST,
  TRENDING_SUCCESS,
  USER_DATA_CLEAR,
  USER_DATA_ERROR,
  USER_DATA_REQUEST,
  USER_DATA_SUCCESS,
} from "../authTypes";

const safeJson = async (res) => {
  try {
    return await res.json();
  } catch {
    return null;
  }
};

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
export const loadUserDetails = (userId) => {
  return async (dispatch) => {
    dispatch({ type: USER_DATA_REQUEST });

    try {
      const response = await apiFetch(`/api/Users/GetUtenteById?id=${userId}`, { method: "GET" });

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
