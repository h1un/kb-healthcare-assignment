import { createRootRoute, createRoute, createRouter, Navigate, Outlet, useRouterState } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useRef, type ComponentType } from "react";
import { useAuth } from "@/features/auth/AuthProvider";
import { SessionExpiredDialog } from "@/features/auth/SessionExpiredDialog";
import DashboardPage from "@/pages/dashboard/DashboardPage";
import { NotFoundPage } from "@/pages/not-found/NotFoundPage";
import SignInPage from "@/pages/sign-in/SignInPage";
import { Skeleton } from "@/shared/ui/skeleton";
import { AppLayout } from "@/widgets/app-layout/AppLayout";

const MemberPage = lazy(() => import("@/pages/member/MemberPage"));
const TaskDetailPage = lazy(() => import("@/pages/task-detail/TaskDetailPage"));
const TaskListPage = lazy(() => import("@/pages/task-list/TaskListPage"));

function RouteFallback() {
  return (
    <section className="flex flex-col gap-5" aria-busy="true">
      <p className="sr-only" role="status">
        화면을 불러오는 중입니다.
      </p>
      <Skeleton className="h-5 w-32 rounded-xl" />
      <Skeleton className="h-29 rounded-card" />
      <Skeleton className="h-29 rounded-card" />
      <Skeleton className="h-29 rounded-card" />
    </section>
  );
}

function AuthCheckingFallback() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-svh items-center justify-center bg-background px-6 text-center text-sm font-bold text-muted-foreground"
    >
      로그인 상태를 확인하고 있어요.
    </div>
  );
}

function withSuspense(Component: ComponentType) {
  return function SuspenseRoute() {
    return (
      <Suspense fallback={<RouteFallback />}>
        <Component />
      </Suspense>
    );
  };
}

function RootShell() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const previousPathnameRef = useRef(pathname);

  useEffect(() => {
    if (previousPathnameRef.current === pathname) {
      return;
    }

    previousPathnameRef.current = pathname;
    const frameId = window.requestAnimationFrame(() => {
      document.getElementById("main-content")?.focus({ preventScroll: true });
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [pathname]);

  return (
    <>
      <Outlet />
      <SessionExpiredDialog />
    </>
  );
}

function AppShell() {
  const { status, isAuthenticated } = useAuth();

  if (status === "checking") {
    return <AuthCheckingFallback />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" replace />;
  }

  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}

function PublicShell() {
  const { status, isAuthenticated } = useAuth();

  if (status === "checking") {
    return <AuthCheckingFallback />;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}

const rootRoute = createRootRoute({
  component: RootShell,
  notFoundComponent: NotFoundPage,
});

const appRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "app",
  component: AppShell,
});

const publicRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "public",
  component: PublicShell,
});

const dashboardRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/",
  component: DashboardPage,
});

const taskListRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/task",
  component: withSuspense(TaskListPage),
});

const taskDetailRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/task/$taskId",
  component: withSuspense(TaskDetailPage),
});

const memberRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/member",
  component: withSuspense(MemberPage),
});

const signInRoute = createRoute({
  getParentRoute: () => publicRoute,
  path: "/sign-in",
  component: SignInPage,
});

const routeTree = rootRoute.addChildren([
  publicRoute.addChildren([signInRoute]),
  appRoute.addChildren([dashboardRoute, taskListRoute, taskDetailRoute, memberRoute]),
]);

export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
