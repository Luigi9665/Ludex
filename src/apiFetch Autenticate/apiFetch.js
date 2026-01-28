import { jwtDecode } from "jwt-decode";
import { store } from "../redux/store/store";
import { safeJson } from "./safeJson.js";
import { LOGIN_SUCCESS, LOGOUT, USER_DATA_CLEAR } from "../redux/authTypes";

/**
 * Wrapper generale per tutte le chiamate HTTP dell'app.
 *
 * Nota per il me-del-futuro:
 * - Qui gestisco:
 *   - aggiunta automatica del Bearer token
 *   - tentativo di refresh quando il backend risponde 401
 *   - logout forzato + messaggio in localStorage quando il refresh fallisce
 * - Se voglio una chiamata *completamente pubblica* (senza token e senza refresh)
 *   passo { skipAuth: true } come opzione.
 */
export const apiFetch = async (URL, options = {}) => {
  const state = store.getState();
  const accessToken = state.auth.accessToken;
  const refreshToken = state.auth.refreshToken;

  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  // estraggo il flag custom "skipAuth" (non fa parte delle opzioni native di fetch)
  const { skipAuth, ...fetchOptions } = options;

  /**
   * Funzione interna che esegue davvero la fetch.
   * Se gli passo un token, aggiunge l'header Authorization.
   */
  const doFetch = (token) => {
    const headers = {
      ...(fetchOptions.headers || {}),
      ...(token && !skipAuth ? { Authorization: `Bearer ${token}` } : {}),
    };

    return fetch(`${baseUrl}${URL}`, {
      ...fetchOptions,
      headers,
    });
  };

  // 1) Chiamata completamente pubblica: niente token, niente refresh.
  if (skipAuth) {
    return doFetch(null);
  }

  // 2) Non ho né accessToken né refreshToken → provo una sola chiamata senza Authorization.
  if (!accessToken && !refreshToken) {
    const res = await doFetch(null);
    return res;
  }

  // 3) Ho almeno un token → prima provo con l'accessToken corrente.
  let res = await doFetch(accessToken);

  // Se NON è 401, tutto ok, ritorno la response così com'è.
  if (res.status !== 401) return res;

  // 4) Se è 401 ma sto chiamando uno degli endpoint di auth,
  // non provo a fare un refresh per evitare loop strani.
  const urlStr = `${baseUrl}${URL}`;
  const isAuthEndpoint =
    urlStr.includes("/api/Auth/login") ||
    urlStr.includes("/api/Auth/refresh") ||
    urlStr.includes("/api/Auth/register") ||
    urlStr.includes("/api/Auth/forgot-password") ||
    urlStr.includes("/api/Auth/reset-password");

  if (isAuthEndpoint) {
    return res;
  }

  // 5) Se è 401 e NON ho un refreshToken → la sessione è andata.
  if (!refreshToken) {
    store.dispatch({ type: LOGOUT });
    store.dispatch({ type: USER_DATA_CLEAR });

    // Salvo un messaggio di "motivo logout" da leggere poi nella navbar
    try {
      localStorage.setItem("lx_logout_reason", "La tua sessione è scaduta. Effettua di nuovo il login.");
    } catch {
      // Se localStorage non è disponibile, amen.
    }

    // Ritorno comunque la response originale 401 (così il chiamante può decidere cosa fare).
    return res;
  }

  // 6) Provo il refresh con il refreshToken salvato nel Redux.
  const refreshRes = await fetch(`${baseUrl}/api/Auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  // Se il refresh NON va a buon fine → logout totale + motivo in localStorage.
  // Questo è il caso tipico dopo reset password o revoca manuale token.
  if (!refreshRes.ok) {
    store.dispatch({ type: LOGOUT });
    store.dispatch({ type: USER_DATA_CLEAR });

    try {
      localStorage.setItem("lx_logout_reason", "Sei stato disconnesso perché il tuo accesso non è più valido (sessione scaduta o password reimpostata).");
    } catch {
      // ignore
    }

    // Ritorno la vecchia 401 che aveva fatto scattare il refresh.
    return res;
  }

  // 7) Refresh OK → aggiorno i token in Redux, ricostruendo l'utente dai claims.
  const newTokens = await safeJson(refreshRes);

  const claims = jwtDecode(newTokens.accessToken);
  const user = {
    userId: claims.sub || claims["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"],
    email: claims.email || claims["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"],
    username: claims.username || claims["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
    role: claims.role || claims["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
  };

  store.dispatch({
    type: LOGIN_SUCCESS,
    payload: {
      ...newTokens,
      user,
    },
  });

  // 8) Rifaccio la chiamata originale con il nuovo accessToken.
  res = await doFetch(newTokens.accessToken);
  return res;
};
