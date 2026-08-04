import { Link, useRouterState } from "@tanstack/react-router";
import { BellIcon, LayoutDashboardIcon, ListChecksIcon, LogInIcon, UserRoundIcon } from "lucide-react";
import type { ReactNode } from "react";
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
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const pageTitle = pathname.startsWith("/task") ? "할 일" : pathname.startsWith("/member") ? "회원정보" : "대시보드";

  return (
    <div className="min-h-svh bg-background text-foreground">
      <div className="mx-auto flex min-h-svh w-full max-w-[720px] flex-col bg-background shadow-[0_0_0_1px_var(--border)]">
        <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-border bg-card/95 px-7 backdrop-blur">
          <div className="w-20" />
          <h1 className="text-xl font-black tracking-normal text-kb-ink">{pageTitle}</h1>
          <div className="flex w-20 justify-end gap-1">
            <Button variant="ghost" size="icon-lg" aria-label="로그인" asChild>
              <Link to="/sign-in">
                <LogInIcon data-icon="inline-start" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon-lg" aria-label="알림">
              <BellIcon data-icon="inline-start" />
            </Button>
          </div>
        </header>

        <main className="flex-1 px-7 py-7 pb-28">{children}</main>

        <nav className="fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-[720px] border-t border-border bg-card/95 px-8 py-3 backdrop-blur">
          <div className="grid grid-cols-3 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1 rounded-2xl px-3 py-2 text-sm font-extrabold text-muted-foreground transition",
                    isActive && "text-kb-ink",
                  )}
                >
                  <Icon className={cn("size-6", isActive && "fill-kb-yellow text-kb-yellow")} aria-hidden="true" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <Link
              to="/member"
              className={cn(
                "flex flex-col items-center justify-center gap-1 rounded-2xl px-3 py-2 text-sm font-extrabold text-muted-foreground transition",
                pathname.startsWith("/member") && "text-kb-ink",
              )}
            >
              <UserRoundIcon className="size-6" aria-hidden="true" />
              <span>회원정보</span>
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
}
