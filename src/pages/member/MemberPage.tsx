export function MemberPage() {
  return (
    <section className="rounded-[2rem] bg-card p-7 shadow-[0_16px_40px_rgba(35,40,50,0.06)]">
      <p className="text-sm font-black text-muted-foreground">Member</p>
      <h2 className="mt-3 text-2xl font-black text-kb-ink">회원정보</h2>
      <p className="mt-3 text-sm font-bold text-muted-foreground">회원정보는 `/api/user` 응답값만 표시합니다.</p>
    </section>
  );
}
