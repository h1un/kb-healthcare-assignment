import { Link } from "@tanstack/react-router";
import { ArrowRightIcon, CheckCircle2Icon, CircleIcon, ClipboardListIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";

const stats = [
  { label: "일", value: 87, description: "전체 할 일", icon: ClipboardListIcon },
  { label: "해야 할 일", value: 58, description: "아직 남았어요", icon: CircleIcon },
  { label: "한 일", value: 29, description: "잘 하고 있어요", icon: CheckCircle2Icon },
];

export function DashboardPage() {
  return (
    <section className="flex flex-col gap-6">
      <div className="min-h-[300px] rounded-[2rem] bg-kb-yellow-soft bg-[url('/dashboard-hero-bg.png')] bg-[length:min(240px,44%)_auto] bg-[right_24px_bottom_42px] bg-no-repeat p-8 text-kb-ink">
        <p className="text-sm font-black">오늘의 리듬</p>
        <h2 className="mt-3 max-w-[360px] text-3xl font-black leading-tight">꾸준함이 건강을 만들어요</h2>
        <div className="mt-10">
          <strong className="text-6xl font-black leading-none">33</strong>
          <span className="ml-2 text-2xl font-black">%</span>
          <p className="mt-3 text-base font-black">29 / 87 완료</p>
        </div>
        <div className="mt-8 h-3 rounded-full bg-kb-yellow/50">
          <div className="h-full w-1/3 rounded-full bg-kb-ink/75" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Card key={stat.label} className="rounded-[1.75rem] border-0 px-1 py-5 shadow-[0_16px_40px_rgba(35,40,50,0.06)]">
              <CardHeader className="px-5">
                <div className="grid size-11 place-items-center rounded-full bg-muted">
                  <Icon className="size-5 text-kb-ink" aria-hidden="true" />
                </div>
              </CardHeader>
              <CardContent className="px-5">
                <p className="text-3xl font-black text-kb-ink">{stat.value}</p>
                <CardTitle className="mt-2 text-base font-black">{stat.label}</CardTitle>
                <CardDescription className="mt-1 text-sm font-bold">{stat.description}</CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Link
        to="/task"
        className="flex items-center justify-between rounded-[2rem] bg-card p-7 shadow-[0_16px_40px_rgba(35,40,50,0.06)]"
      >
        <div>
          <h2 className="text-xl font-black text-kb-ink">할 일 목록 보러가기</h2>
          <p className="mt-3 text-base font-bold text-muted-foreground">오늘 해야 할 일을 확인해요</p>
        </div>
        <span className="grid size-14 place-items-center rounded-full bg-kb-yellow text-kb-ink">
          <ArrowRightIcon aria-hidden="true" />
        </span>
      </Link>

      <Card className="rounded-[2rem] border-0 bg-kb-pink p-3 shadow-none">
        <CardContent>
          <h2 className="text-xl font-black text-kb-ink">루틴은 몸에 잘 맞나요?</h2>
          <p className="mt-3 text-base font-bold text-muted-foreground">작은 습관이 쌓이면 큰 변화가 됩니다.</p>
        </CardContent>
      </Card>
    </section>
  );
}
