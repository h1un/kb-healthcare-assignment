import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboardIcon, ListChecksIcon, LogInIcon, UserRoundIcon } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { useAuth } from "@/features/auth/AuthProvider";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";

type AppLayoutProps = {
  children: ReactNode;
};

const navItems = [
  { to: "/", label: "대시보드", icon: LayoutDashboardIcon },
  { to: "/task", label: "할 일", icon: ListChecksIcon },
] as const;

export function AppLayout({ children }: AppLayoutProps) {
  const { isAuthenticated } = useAuth();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const pageTitle = getPageTitle(pathname);
  const shouldShowRouteNav = isAuthenticated;
  const authLink = isAuthenticated ? "/member" : "/sign-in";
  const AuthIcon = isAuthenticated ? UserRoundIcon : LogInIcon;
  const isAuthLinkActive = isAuthenticated ? pathname.startsWith("/member") : pathname.startsWith("/sign-in");

  useEffect(() => {
    document.title = `${pageTitle} | KB O'CARE`;
  }, [pageTitle]);

  return (
    <div className="min-h-svh bg-background text-foreground">
      <a
        href="#main-content"
        className="fixed left-4 top-4 z-50 -translate-y-[calc(100%+2rem)] rounded-lg bg-kb-ink px-4 py-3 font-bold text-card focus:translate-y-0 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring"
      >
        본문으로 건너뛰기
      </a>
      <div className="mx-auto flex min-h-svh w-full max-w-180 flex-col bg-background shadow-frame">
        <header className="sticky top-0 z-20 flex h-[calc(5rem+env(safe-area-inset-top))] items-center justify-between border-b border-border bg-card/95 px-7 pt-[env(safe-area-inset-top)] backdrop-blur">
          <Link
            to="/"
            aria-label="대시보드"
            className="flex min-h-11 w-20 items-center rounded-lg focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring"
          >
            <img src="/logo_text.svg" alt="" width="594" height="140" className="h-6 w-auto" />
          </Link>
          <h1 id="page-title" className="text-xl font-black tracking-normal text-kb-ink">
            {pageTitle}
          </h1>
          <div className="flex w-20 justify-end gap-1">
            <Button variant="ghost" size="icon-lg" aria-label={isAuthenticated ? "회원정보" : "로그인"} asChild>
              <Link to={authLink} aria-current={isAuthLinkActive ? "page" : undefined}>
                <AuthIcon data-icon="inline-start" />
              </Link>
            </Button>
          </div>
        </header>

        <main
          id="main-content"
          tabIndex={-1}
          aria-labelledby="page-title"
          className={cn(
            "flex-1 px-7 py-7 focus:outline-none",
            shouldShowRouteNav ? "pb-[calc(7rem+env(safe-area-inset-bottom))]" : "pb-7",
          )}
        >
          {children}
        </main>

        {shouldShowRouteNav ? (
          <nav
            aria-label="주요 메뉴"
            className="fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-180 border-t border-border bg-card/95 px-8 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur"
          >
            <div className="grid grid-cols-2 gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);

                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "flex min-h-12 flex-col items-center justify-center gap-1 rounded-2xl px-3 py-2 text-sm font-extrabold text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring",
                      isActive && "text-kb-ink",
                    )}
                  >
                    <Icon className={cn("size-6", isActive && "fill-kb-yellow text-kb-yellow")} aria-hidden="true" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>
        ) : null}
      </div>
    </div>
  );
}

function getPageTitle(pathname: string) {
  if (pathname.startsWith("/task")) {
    return "할 일";
  }

  if (pathname.startsWith("/member")) {
    return "회원정보";
  }

  if (pathname.startsWith("/sign-in")) {
    return "로그인";
  }

  return "대시보드";
}
