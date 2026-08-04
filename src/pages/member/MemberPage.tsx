import { UserRoundIcon } from "lucide-react";

export function MemberPage() {
  return (
    <section className="grid grid-cols-[auto_1fr] items-center gap-6 rounded-[2rem] bg-card p-7 shadow-[0_16px_40px_rgba(35,40,50,0.06)]">
      <div className="grid size-24 place-items-center rounded-[2rem] bg-kb-yellow text-kb-ink">
        <UserRoundIcon className="size-11" aria-hidden="true" />
      </div>
      <div>
        <p className="text-sm font-black text-muted-foreground">Member</p>
        <h2 className="mt-3 text-2xl font-black text-kb-ink">케어 매니저</h2>
        <p className="mt-3 text-sm font-bold leading-relaxed text-muted-foreground">KB헬스케어 케어 태스크 운영 담당자</p>
      </div>
    </section>
  );
}
