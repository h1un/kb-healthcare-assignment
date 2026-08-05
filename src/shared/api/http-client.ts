import { clearSessionTokens, getAccessToken, setSessionTokens } from "./token-store";
import type { AuthTokenResponse, ErrorResponse } from "./types";

type ApiRequestOptions = RequestInit & {
  skipAuthRefresh?: boolean;
};

let refreshPromise: Promise<boolean> | null = null;

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
  const response = await requestWithNetworkError(path, options);

  if (response.status === 401 && !options.skipAuthRefresh) {
    const refreshed = await refreshAccessToken();

    if (refreshed) {
      return parseResponse<T>(await requestWithNetworkError(path, options));
    }

    clearSessionTokens();
    dispatchAuthExpired();
  }

  return parseResponse<T>(response);
}

async function fetchWithAuth(path: string, options: ApiRequestOptions) {
  const { skipAuthRefresh: _skipAuthRefresh, ...fetchOptions } = options;
  const headers = new Headers(options.headers);
  const token = getAccessToken();

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return fetch(path, {
    ...fetchOptions,
    headers,
    credentials: "include",
  });
}

async function refreshAccessToken() {
  refreshPromise ??= requestRefreshAccessToken().finally(() => {
    refreshPromise = null;
  });

  return refreshPromise;
}

async function requestRefreshAccessToken() {
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

async function requestWithNetworkError(path: string, options: ApiRequestOptions) {
  try {
    return await fetchWithAuth(path, options);
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw error;
    }

    throw new ApiError(0, "네트워크 연결을 확인해주세요.");
  }
}

async function parseResponse<T>(response: Response): Promise<T> {
  const text = await response.text();
  let data: unknown;

  try {
    data = text ? JSON.parse(text) : undefined;
  } catch {
    throw new ApiError(response.status, response.ok ? "응답 형식이 올바르지 않습니다." : "요청을 처리하지 못했습니다.");
  }

  if (!response.ok) {
    const error = isErrorResponse(data) ? data : undefined;
    throw new ApiError(response.status, error?.errorMessage ?? "요청을 처리하지 못했습니다.");
  }

  return data as T;
}

function isErrorResponse(value: unknown): value is Partial<ErrorResponse> {
  return typeof value === "object" && value !== null && "errorMessage" in value;
}

function dispatchAuthExpired() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new CustomEvent("auth:expired"));
}
