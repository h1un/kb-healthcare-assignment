import { createRootRoute, createRoute, createRouter, Navigate, Outlet } from "@tanstack/react-router";
import { lazy, Suspense, type ComponentType } from "react";
import { useAuth } from "@/features/auth/AuthProvider";
import { SessionExpiredDialog } from "@/features/session-expired/SessionExpiredDialog";
import { NotFoundPage } from "@/pages/not-found/NotFoundPage";
import { AppLayout } from "@/widgets/app-layout/AppLayout";

const DashboardPage = lazy(() => import("@/pages/dashboard/DashboardPage"));
const MemberPage = lazy(() => import("@/pages/member/MemberPage"));
const SignInPage = lazy(() => import("@/pages/sign-in/SignInPage"));
const TaskDetailPage = lazy(() => import("@/pages/task-detail/TaskDetailPage"));
const TaskListPage = lazy(() => import("@/pages/task-list/TaskListPage"));

function RouteFallback() {
  return (
    <div className="flex min-h-80 items-center justify-center px-6 text-center text-sm font-bold text-muted-foreground">
      화면을 불러오고 있어요.
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
    return (
      <div className="flex min-h-svh items-center justify-center bg-background px-6 text-center text-sm font-bold text-muted-foreground">
        로그인 상태를 확인하고 있어요.
      </div>
    );
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
  component: withSuspense(DashboardPage),
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
  component: withSuspense(SignInPage),
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
