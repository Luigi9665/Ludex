import { jwtDecode } from "jwt-decode";
import { LOGIN_SUCCESS, logoutAction } from "../redux/action";
import { store } from "../redux/store/store";
import { safeJson } from "./safeJson,js";

export const apiFetch = async (URL, option = {}) => {
  const state = store.getState();
  const accessToken = state.auth.accessToken;
  const refreshToken = state.auth.refreshToken;

  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const doFetch = (token) =>
    fetch(`${baseUrl}${URL}`, {
      ...option,
      headers: {
        ...(option.header || {}),
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    });

  // 1) prima chiamata con accessToken attuale
  let res = await doFetch(accessToken);

  if (res.status !== 401) return res;

  // 2) se 401 e non ho refreshToken → sessione veramente morta
  if (!refreshToken) {
    store.dispatch(logoutAction());
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
    store.dispatch(logoutAction());
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
