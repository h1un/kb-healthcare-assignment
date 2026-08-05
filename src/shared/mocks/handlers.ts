import { delay, http, HttpResponse } from "msw";
import { getDashboardData, tasks, user } from "./data";
import type { SignInRequest } from "@/shared/api/types";

const TEST_EMAIL = "care@kbhealth.com";
const TEST_PASSWORD = "Password1";
const deletedTaskIds = new Set<string>();
const issuedRefreshTokens = new Set<string>();

export const handlers = [
  http.post("/api/sign-in", async ({ request }) => {
    await delay(250);
    const body = (await request.json()) as SignInRequest;

    if (body.email !== TEST_EMAIL || body.password !== TEST_PASSWORD) {
      return HttpResponse.json({ errorMessage: "이메일 또는 비밀번호가 올바르지 않습니다." }, { status: 400 });
    }

    resetMockState();
    const tokens = issueTokens();

    return HttpResponse.json(tokens, {
      headers: {
        "Set-Cookie": `token=${tokens.refreshToken}; Path=/; SameSite=Lax`,
      },
    });
  }),

  http.post("/api/refresh", async ({ request }) => {
    await delay(120);

    const refreshToken = getRefreshTokenFromCookie(request);

    if (refreshToken && !issuedRefreshTokens.has(refreshToken)) {
      return unauthorized();
    }

    return HttpResponse.json(issueTokens());
  }),

  http.get("/api/user", async ({ request }) => {
    await delay(150);

    if (!isAuthorized(request)) {
      return unauthorized();
    }

    return HttpResponse.json(user);
  }),

  http.get("/api/dashboard", async ({ request }) => {
    await delay(150);

    if (!isAuthorized(request)) {
      return unauthorized();
    }

    return HttpResponse.json(getDashboardData(getActiveTasks()));
  }),

  http.get("/api/task", async ({ request }) => {
    await delay(200);

    if (!isAuthorized(request)) {
      return unauthorized();
    }

    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") ?? "1");
    const pageSize = 12;
    const activeTasks = getActiveTasks();
    const start = (page - 1) * pageSize;
    const data = activeTasks.slice(start, start + pageSize);

    return HttpResponse.json({
      data,
      hasNext: start + pageSize < activeTasks.length,
    });
  }),

  http.get("/api/task/:id", async ({ params, request }) => {
    await delay(150);

    if (!isAuthorized(request)) {
      return unauthorized();
    }

    const id = String(params.id);
    const task = getActiveTasks().find((item) => item.id === id);

    if (!task) {
      return HttpResponse.json({ errorMessage: "할 일을 찾을 수 없습니다." }, { status: 404 });
    }

    return HttpResponse.json({
      title: task.title,
      memo: task.memo,
      registerDatetime: "2026-08-05T09:00:00.000Z",
    });
  }),

  http.delete("/api/task/:id", async ({ params, request }) => {
    await delay(150);

    if (!isAuthorized(request)) {
      return unauthorized();
    }

    const id = String(params.id);
    const task = getActiveTasks().find((item) => item.id === id);

    if (!task) {
      return HttpResponse.json({ errorMessage: "할 일을 찾을 수 없습니다." }, { status: 404 });
    }

    deletedTaskIds.add(id);
    return HttpResponse.json({ success: true });
  }),
];

export function resetMockState() {
  deletedTaskIds.clear();
  issuedRefreshTokens.clear();
}

function getActiveTasks() {
  return tasks.filter((task) => !deletedTaskIds.has(task.id));
}

function isAuthorized(request: Request) {
  return request.headers.get("authorization")?.startsWith("Bearer access-") ?? false;
}

function unauthorized() {
  return HttpResponse.json({ errorMessage: "인증 정보가 유효하지 않습니다." }, { status: 401 });
}

function getRefreshTokenFromCookie(request: Request) {
  const cookie = request.headers.get("cookie") ?? "";
  const tokenCookie = cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith("token="));

  return tokenCookie?.slice("token=".length);
}

function issueTokens() {
  const nonce = crypto.randomUUID();
  const refreshToken = `refresh-${nonce}`;

  issuedRefreshTokens.add(refreshToken);

  return {
    accessToken: `access-${nonce}`,
    refreshToken,
  };
}
