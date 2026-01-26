import { jwtDecode } from "jwt-decode";
import { store } from "../redux/store/store";
import { safeJson } from "./safeJson.js";
import { LOGIN_SUCCESS, LOGOUT, USER_DATA_CLEAR } from "../redux/authTypes";

export const apiFetch = async (URL, options = {}) => {
  const state = store.getState();
  const accessToken = state.auth.accessToken;
  const refreshToken = state.auth.refreshToken;

  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  // nuovo flag per skip auth/refresh
  const { skipAuth, ...fetchOptions } = options;

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

  // 🔹 chiamata completamente pubblica: niente token, niente refresh
  if (skipAuth) {
    return doFetch(null);
  }

  // 🔹 se non ho proprio nessun token → faccio UNA chiamata senza Authorization e basta
  if (!accessToken && !refreshToken) {
    const res = await doFetch(null);
    return res;
  }

  // 1) prima chiamata con accessToken attuale
  let res = await doFetch(accessToken);

  if (res.status !== 401) return res;

  // 2) se 401 e non ho refreshToken → sessione finita
  if (!refreshToken) {
    store.dispatch({ type: LOGOUT });
    store.dispatch({ type: USER_DATA_CLEAR });
    return res;
  }

  // 3) provo il refresh
  const refreshRes = await fetch(`${baseUrl}/api/Auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!refreshRes.ok) {
    // refresh fallito → logout e ritorno la vecchia 401
    store.dispatch({ type: LOGOUT });
    store.dispatch({ type: USER_DATA_CLEAR });
    return res;
  }

  const newTokens = await safeJson(refreshRes);

  // ricostruisco user come nel login
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

  // 4) rifaccio la chiamata con il nuovo accessToken
  res = await doFetch(newTokens.accessToken);
  return res;
};
