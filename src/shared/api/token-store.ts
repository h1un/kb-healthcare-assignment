import type { AuthTokenResponse } from "./types";

const REFRESH_COOKIE_NAME = "token";

let accessToken: string | null = null;

export function getAccessToken() {
  return accessToken;
}

export function setSessionTokens(tokens: AuthTokenResponse) {
  accessToken = tokens.accessToken;
  setRefreshTokenCookie(tokens.refreshToken);
}

export function clearSessionTokens() {
  accessToken = null;
  expireRefreshTokenCookie();
}

export function hasRefreshTokenCookie() {
  if (typeof document === "undefined") {
    return false;
  }

  return document.cookie.split("; ").some((cookie) => cookie.startsWith(`${REFRESH_COOKIE_NAME}=`));
}

function setRefreshTokenCookie(refreshToken: string) {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${REFRESH_COOKIE_NAME}=${refreshToken}; Path=/; SameSite=Lax; Max-Age=604800`;
}

function expireRefreshTokenCookie() {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${REFRESH_COOKIE_NAME}=; Path=/; SameSite=Lax; Max-Age=0`;
}
