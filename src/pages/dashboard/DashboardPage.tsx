import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ArrowRightIcon, CheckIcon, CircleIcon, ClipboardListIcon } from "lucide-react";
import { dashboardQueryOptions } from "@/entities/dashboard/queries";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { cn } from "@/shared/lib/utils";
import { Skeleton } from "@/shared/ui/skeleton";

export default function DashboardPage() {
  const { data, isLoading, isLoadingError } = useQuery(dashboardQueryOptions);

  const total = data?.numOfTask ?? 0;
  const done = data?.numOfDoneTask ?? 0;
  const rest = data?.numOfRestTask ?? 0;
  const progress = total > 0 ? Math.round((done / total) * 100) : 0;
  const stats = [
    {
      label: "일",
      value: total,
      description: "전체 할 일",
      icon: ClipboardListIcon,
      iconClassName: "bg-muted text-kb-ink",
    },
    {
      label: "해야할 일",
      value: rest,
      description: "아직 남았어요",
      icon: CircleIcon,
      iconClassName: "bg-kb-pink text-destructive",
    },
    {
      label: "한 일",
      value: done,
      description: "완료했어요",
      icon: CheckIcon,
      iconClassName: "bg-kb-blue/15 text-kb-blue",
    },
  ];

  return (
    <section className="flex flex-col gap-6" aria-busy={isLoading}>
      <Link
        to="/task"
        aria-label="할 일 목록으로 이동"
        className={cn(
          "group min-h-75 rounded-card bg-kb-yellow-soft p-8 text-kb-ink shadow-card",
          "bg-[url('/dashboard-hero-bg.png')] bg-[length:min(15rem,44%)_auto] bg-[right_1.5rem_bottom_2.625rem] bg-no-repeat",
          "transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring motion-reduce:transform-none",
        )}
      >
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm font-black">오늘의 리듬</p>
          <span className="grid size-10 place-items-center rounded-full bg-card/75 transition-colors group-hover:bg-card">
            <ArrowRightIcon aria-hidden="true" />
          </span>
        </div>
        <h2 className="mt-3 max-w-90 text-3xl font-black leading-tight">꾸준함이 건강을 만들어요</h2>
        <div className="mt-10">
          {isLoading ? (
            <Skeleton className="h-18 w-32 rounded-2xl" />
          ) : (
            <strong className="text-6xl font-black leading-none tabular-nums">{progress}</strong>
          )}
          <span className="ml-2 text-2xl font-black">%</span>
          <p className="mt-3 text-base font-black tabular-nums" role={isLoadingError ? "alert" : undefined}>
            {isLoadingError ? "대시보드를 불러오지 못했어요" : `${done} / ${total} 완료`}
          </p>
        </div>
        <div
          role="progressbar"
          aria-label="오늘의 할 일 완료율"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={isLoading ? undefined : progress}
          aria-valuetext={isLoading ? "완료율을 불러오는 중" : `${done}개 완료, 전체 ${total}개`}
          className="mt-8 h-3 overflow-hidden rounded-full bg-kb-yellow/50"
        >
          <div
            className="h-full origin-left rounded-full bg-kb-ink/75 transition-transform motion-reduce:transition-none"
            style={{ transform: `scaleX(${progress / 100})` }}
          />
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
                {isLoading ? (
                  <Skeleton className="h-10 w-16 rounded-xl" />
                ) : (
                  <p className="text-3xl font-black text-kb-ink tabular-nums">{stat.value}</p>
                )}
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
