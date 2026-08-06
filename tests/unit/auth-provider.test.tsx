import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { refreshSession, signIn, signOut } from "@/entities/auth/api";
import { AuthProvider, useAuth } from "@/features/auth/AuthProvider";

vi.mock("@/entities/auth/api", () => ({
  refreshSession: vi.fn(),
  signIn: vi.fn(),
  signOut: vi.fn(),
}));

function AuthProbe() {
  const auth = useAuth();

  return (
    <div>
      <span data-testid="status">{auth.status}</span>
      <span data-testid="authenticated">{String(auth.isAuthenticated)}</span>
      <span data-testid="expired">{String(auth.sessionExpired)}</span>
      <button type="button" onClick={auth.logout}>
        로그아웃
      </button>
    </div>
  );
}

function renderAuthProvider() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  const result = render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AuthProbe />
      </AuthProvider>
    </QueryClientProvider>,
  );

  return { ...result, queryClient };
}

describe("AuthProvider", () => {
  beforeEach(() => {
    document.cookie = "token=; Path=/; Max-Age=0";
    vi.mocked(refreshSession).mockReset();
    vi.mocked(signIn).mockReset();
    vi.mocked(signOut).mockReset();
  });

  afterEach(() => {
    cleanup();
    document.cookie = "token=; Path=/; Max-Age=0";
  });

  it("skips refresh and marks anonymous users when there is no refresh cookie", async () => {
    renderAuthProvider();

    await waitFor(() => expect(screen.getByTestId("status")).toHaveTextContent("anonymous"));
    expect(refreshSession).not.toHaveBeenCalled();
    expect(screen.getByTestId("authenticated")).toHaveTextContent("false");
  });

  it("refreshes an existing session on bootstrap", async () => {
    document.cookie = "token=refresh-existing; Path=/";
    vi.mocked(refreshSession).mockResolvedValue({
      accessToken: "access-new",
      refreshToken: "refresh-new",
    });

    renderAuthProvider();

    await waitFor(() => expect(screen.getByTestId("status")).toHaveTextContent("authenticated"));
    expect(refreshSession).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId("authenticated")).toHaveTextContent("true");
  });

  it("marks the session expired when the global auth event is dispatched", async () => {
    document.cookie = "token=refresh-existing; Path=/";
    vi.mocked(refreshSession).mockResolvedValue({
      accessToken: "access-new",
      refreshToken: "refresh-new",
    });

    const { queryClient } = renderAuthProvider();
    await waitFor(() => expect(screen.getByTestId("status")).toHaveTextContent("authenticated"));
    queryClient.setQueryData(["user"], { name: "이전 사용자" });

    window.dispatchEvent(new CustomEvent("auth:expired"));

    await waitFor(() => expect(screen.getByTestId("status")).toHaveTextContent("anonymous"));
    expect(screen.getByTestId("expired")).toHaveTextContent("true");
    expect(signOut).toHaveBeenCalledTimes(1);
    expect(queryClient.getQueryData(["user"])).toBeUndefined();
  });

  it("clears cached server state on logout", async () => {
    document.cookie = "token=refresh-existing; Path=/";
    vi.mocked(refreshSession).mockResolvedValue({
      accessToken: "access-new",
      refreshToken: "refresh-new",
    });

    const { queryClient } = renderAuthProvider();
    await waitFor(() => expect(screen.getByTestId("status")).toHaveTextContent("authenticated"));
    queryClient.setQueryData(["user"], { name: "이전 사용자" });

    screen.getByRole("button", { name: "로그아웃" }).click();

    await waitFor(() => expect(screen.getByTestId("status")).toHaveTextContent("anonymous"));
    expect(queryClient.getQueryData(["user"])).toBeUndefined();
    expect(signOut).toHaveBeenCalledTimes(1);
  });
});
