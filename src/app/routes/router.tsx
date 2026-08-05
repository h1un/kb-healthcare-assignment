import { createRootRoute, createRoute, createRouter, Navigate, Outlet } from "@tanstack/react-router";
import { useAuth } from "@/features/auth/AuthProvider";
import { SessionExpiredDialog } from "@/features/session-expired/SessionExpiredDialog";
import { DashboardPage } from "@/pages/dashboard/DashboardPage";
import { MemberPage } from "@/pages/member/MemberPage";
import { NotFoundPage } from "@/pages/not-found/NotFoundPage";
import { SignInPage } from "@/pages/sign-in/SignInPage";
import { TaskDetailPage } from "@/pages/task-detail/TaskDetailPage";
import { TaskListPage } from "@/pages/task-list/TaskListPage";
import { AppLayout } from "@/widgets/app-layout/AppLayout";

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
  component: DashboardPage,
});

const taskListRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/task",
  component: TaskListPage,
});

const taskDetailRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/task/$taskId",
  component: TaskDetailPage,
});

const memberRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/member",
  component: MemberPage,
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
