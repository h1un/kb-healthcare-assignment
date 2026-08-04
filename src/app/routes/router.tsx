import { createRootRoute, createRoute, createRouter, Outlet } from "@tanstack/react-router";
import { DashboardPage } from "@/pages/dashboard/DashboardPage";
import { MemberPage } from "@/pages/member/MemberPage";
import { NotFoundPage } from "@/pages/not-found/NotFoundPage";
import { SignInPage } from "@/pages/sign-in/SignInPage";
import { TaskDetailPage } from "@/pages/task-detail/TaskDetailPage";
import { TaskListPage } from "@/pages/task-list/TaskListPage";
import { AppLayout } from "@/widgets/app-layout/AppLayout";

function AppShell() {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}

const rootRoute = createRootRoute({
  component: Outlet,
  notFoundComponent: NotFoundPage,
});

const appRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "app",
  component: AppShell,
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
  getParentRoute: () => rootRoute,
  path: "/sign-in",
  component: SignInPage,
});

const routeTree = rootRoute.addChildren([
  signInRoute,
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
