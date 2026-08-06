import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ArrowRightIcon, CheckIcon, CircleIcon, ClipboardListIcon } from "lucide-react";
import { getDashboard } from "@/entities/dashboard/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { cn } from "@/shared/lib/utils";
import { Skeleton } from "@/shared/ui/skeleton";

export default function DashboardPage() {
  const { data, isError, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboard,
  });

  const total = data?.numOfTask ?? 0;
  const done = data?.numOfDoneTask ?? 0;
  const rest = data?.numOfRestTask ?? 0;
  const progress = total > 0 ? Math.round((done / total) * 100) : 0;
  const stats = [
    { label: "일", value: total, description: "전체 할 일", icon: ClipboardListIcon, iconClassName: "bg-muted text-kb-ink" },
    { label: "해야할 일", value: rest, description: "아직 남았어요", icon: CircleIcon, iconClassName: "bg-kb-pink text-destructive" },
    { label: "한 일", value: done, description: "완료했어요", icon: CheckIcon, iconClassName: "bg-kb-blue/15 text-kb-blue" },
  ];

  return (
    <section className="flex flex-col gap-6">
      <Link
        to="/task"
        aria-label="할 일 목록으로 이동"
        className="group min-h-75 rounded-card bg-kb-yellow-soft bg-[url('/dashboard-hero-bg.png')] bg-[length:min(15rem,44%)_auto] bg-[right_1.5rem_bottom_2.625rem] bg-no-repeat p-8 text-kb-ink shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-kb-yellow/60"
      >
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm font-black">오늘의 리듬</p>
          <span className="grid size-10 place-items-center rounded-full bg-card/75 transition group-hover:bg-card">
            <ArrowRightIcon aria-hidden="true" />
          </span>
        </div>
        <h2 className="mt-3 max-w-90 text-3xl font-black leading-tight">꾸준함이 건강을 만들어요</h2>
        <div className="mt-10">
          {isLoading ? <Skeleton className="h-18 w-32 rounded-2xl" /> : <strong className="text-6xl font-black leading-none">{progress}</strong>}
          <span className="ml-2 text-2xl font-black">%</span>
          <p className="mt-3 text-base font-black">{isError ? "대시보드를 불러오지 못했어요" : `${done} / ${total} 완료`}</p>
        </div>
        <div className="mt-8 h-3 rounded-full bg-kb-yellow/50">
          <div className="h-full rounded-full bg-kb-ink/75 transition-[width]" style={{ width: `${progress}%` }} />
        </div>
      </Link>

      <div className="grid grid-cols-1 gap-3 xs:grid-cols-3 xs:gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Card
              key={stat.label}
              className="rounded-tile border-0 px-1 py-5 shadow-card"
            >
              <CardHeader className="px-5">
                <div className={cn("grid size-11 place-items-center rounded-full", stat.iconClassName)}>
                  <Icon className="size-5" aria-hidden="true" />
                </div>
              </CardHeader>
              <CardContent className="px-5">
                {isLoading ? <Skeleton className="h-10 w-16 rounded-xl" /> : <p className="text-3xl font-black text-kb-ink">{stat.value}</p>}
                <CardTitle className="mt-2 break-keep text-base font-black">{stat.label}</CardTitle>
                <CardDescription className="mt-1 break-keep text-sm font-bold">{stat.description}</CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="rounded-card border-0 bg-kb-pink p-3 shadow-none">
        <CardContent>
          <h2 className="text-xl font-black text-kb-ink">루틴은 몸에 잘 맞나요?</h2>
          <p className="mt-3 text-base font-bold text-muted-foreground">작은 습관이 쌓이면 큰 변화가 됩니다.</p>
        </CardContent>
      </Card>
    </section>
  );
}
