import { apiRequest } from "@/shared/api/http-client";
import { clearSessionTokens, setSessionTokens } from "@/shared/api/token-store";
import type { AuthTokenResponse, SignInRequest } from "@/shared/api/types";
import { authTokenResponseSchema } from "@/shared/api/validators";

export async function signIn(payload: SignInRequest) {
  const tokens = await apiRequest<AuthTokenResponse>("/api/sign-in", {
    method: "POST",
    body: JSON.stringify(payload),
    responseSchema: authTokenResponseSchema,
    skipAuthRefresh: true,
  });

  setSessionTokens(tokens);
  return tokens;
}

export async function refreshSession() {
  const tokens = await apiRequest<AuthTokenResponse>("/api/refresh", {
    method: "POST",
    responseSchema: authTokenResponseSchema,
    skipAuthRefresh: true,
  });

  setSessionTokens(tokens);
  return tokens;
}

export function signOut() {
  clearSessionTokens();
}
