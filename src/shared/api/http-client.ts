import { clearSessionTokens, getAccessToken, setSessionTokens } from "./token-store";
import type { AuthTokenResponse, ErrorResponse } from "./types";

type ApiRequestOptions = RequestInit & {
  skipAuthRefresh?: boolean;
};

export class ApiError extends Error {
  status: number;
  errorMessage: string;

  constructor(status: number, errorMessage: string) {
    super(errorMessage);
    this.name = "ApiError";
    this.status = status;
    this.errorMessage = errorMessage;
  }
}

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const response = await fetchWithAuth(path, options);

  if (response.status === 401 && !options.skipAuthRefresh) {
    const refreshed = await refreshAccessToken();

    if (refreshed) {
      return parseResponse<T>(await fetchWithAuth(path, options));
    }

    clearSessionTokens();
    dispatchAuthExpired();
  }

  return parseResponse<T>(response);
}

async function fetchWithAuth(path: string, options: ApiRequestOptions) {
  const headers = new Headers(options.headers);
  const token = getAccessToken();

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return fetch(path, {
    ...options,
    headers,
    credentials: "include",
  });
}

async function refreshAccessToken() {
  try {
    const tokens = await apiRequest<AuthTokenResponse>("/api/refresh", {
      method: "POST",
      skipAuthRefresh: true,
    });
    setSessionTokens(tokens);
    return true;
  } catch {
    return false;
  }
}

async function parseResponse<T>(response: Response): Promise<T> {
  const text = await response.text();
  const data = text ? JSON.parse(text) : undefined;

  if (!response.ok) {
    const error = data as Partial<ErrorResponse> | undefined;
    throw new ApiError(response.status, error?.errorMessage ?? "요청을 처리하지 못했습니다.");
  }

  return data as T;
}

function dispatchAuthExpired() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new CustomEvent("auth:expired"));
}
