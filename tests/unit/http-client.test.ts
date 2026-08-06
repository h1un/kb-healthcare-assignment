import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { apiRequest } from "@/shared/api/http-client";
import { clearSessionTokens, getAccessToken, setSessionTokens } from "@/shared/api/token-store";
import { userResponseSchema } from "@/shared/api/validators";

describe("apiRequest", () => {
  beforeEach(() => {
    clearSessionTokens();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    clearSessionTokens();
  });

  it("deduplicates refresh requests and retries original requests after 401 responses", async () => {
    let refreshCount = 0;
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const path = String(input);
      const headers = new Headers(init?.headers);

      if (path === "/api/user") {
        if (headers.get("Authorization") === "Bearer access-old") {
          return Response.json({ errorMessage: "인증 정보가 유효하지 않습니다." }, { status: 401 });
        }

        return Response.json({ name: "케어 매니저", memo: "운영 담당자" });
      }

      if (path === "/api/refresh") {
        refreshCount += 1;
        return Response.json({
          accessToken: "access-new",
          refreshToken: "refresh-new",
        });
      }

      throw new Error(`Unexpected request: ${path}`);
    });

    vi.stubGlobal("fetch", fetchMock);
    setSessionTokens({ accessToken: "access-old", refreshToken: "refresh-old" });

    await expect(Promise.all([apiRequest("/api/user"), apiRequest("/api/user")])).resolves.toEqual([
      { name: "케어 매니저", memo: "운영 담당자" },
      { name: "케어 매니저", memo: "운영 담당자" },
    ]);
    expect(refreshCount).toBe(1);
  });

  it("normalizes network failures", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("Failed to fetch")));

    await expect(apiRequest("/api/user")).rejects.toMatchObject({
      name: "ApiError",
      status: 0,
      errorMessage: "네트워크 연결을 확인해주세요.",
    });
  });

  it("expires the session when the retried request still returns 401", async () => {
    const expiredListener = vi.fn();
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const path = String(input);

      if (path === "/api/refresh") {
        return Response.json({
          accessToken: "access-new",
          refreshToken: "refresh-new",
        });
      }

      return Response.json({ errorMessage: "인증 정보가 유효하지 않습니다." }, { status: 401 });
    });

    vi.stubGlobal("fetch", fetchMock);
    setSessionTokens({ accessToken: "access-old", refreshToken: "refresh-old" });
    window.addEventListener("auth:expired", expiredListener);

    await expect(apiRequest("/api/user")).rejects.toMatchObject({
      name: "ApiError",
      status: 401,
    });

    window.removeEventListener("auth:expired", expiredListener);
    expect(expiredListener).toHaveBeenCalledTimes(1);
    expect(getAccessToken()).toBeNull();
  });

  it("normalizes invalid JSON responses", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("not-json")));

    await expect(apiRequest("/api/user")).rejects.toMatchObject({
      name: "ApiError",
      status: 200,
      errorMessage: "응답 형식이 올바르지 않습니다.",
    });
  });

  it("normalizes runtime schema mismatches", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json({ name: "케어 매니저" })));

    await expect(apiRequest("/api/user", { responseSchema: userResponseSchema })).rejects.toMatchObject({
      name: "ApiError",
      status: 200,
      errorMessage: "응답 형식이 올바르지 않습니다.",
    });
  });

  it("ignores non-string error messages", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json({ errorMessage: 400 }, { status: 400 })));

    await expect(apiRequest("/api/sign-in", { skipAuthRefresh: true })).rejects.toMatchObject({
      name: "ApiError",
      status: 400,
      errorMessage: "요청을 처리하지 못했습니다.",
    });
  });
});
