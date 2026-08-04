export function DashboardPage() {
  return (
    <section className="flex flex-col gap-6">
      <div className="rounded-[2rem] bg-kb-yellow-soft p-8 text-kb-ink">
        <p className="text-sm font-black">오늘의 리듬</p>
        <h2 className="mt-3 text-3xl font-black leading-tight">꾸준함이 건강을 만들어요</h2>
        <p className="mt-5 text-base font-bold text-kb-gray">대시보드 통계는 API 연동 단계에서 연결합니다.</p>
      </div>
    </section>
  );
}
