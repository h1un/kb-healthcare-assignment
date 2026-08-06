import { useQuery } from "@tanstack/react-query";
import { LogOutIcon, UserRoundIcon } from "lucide-react";
import { getUser } from "@/entities/user/api";
import { useAuth } from "@/features/auth/AuthProvider";
import { Button } from "@/shared/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/shared/ui/empty";
import { Skeleton } from "@/shared/ui/skeleton";

export default function MemberPage() {
  const { logout } = useAuth();
  const { data, isLoading, isLoadingError, refetch } = useQuery({
    queryKey: ["user"],
    queryFn: getUser,
  });

  if (isLoading) {
    return (
      <section className="grid grid-cols-[auto_1fr] items-center gap-6 rounded-card bg-card p-7 shadow-card" aria-busy="true">
        <p className="sr-only" role="status">
          회원정보를 불러오는 중입니다.
        </p>
        <Skeleton className="size-24 rounded-card" />
        <div>
          <Skeleton className="h-5 w-20 rounded-xl" />
          <Skeleton className="mt-3 h-8 w-36 rounded-2xl" />
          <Skeleton className="mt-3 h-5 w-full rounded-xl" />
        </div>
      </section>
    );
  }

  if (isLoadingError || !data) {
    return (
      <Empty className="min-h-110 rounded-card bg-card" role="alert">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <UserRoundIcon aria-hidden="true" />
          </EmptyMedia>
          <EmptyTitle>회원정보를 불러오지 못했어요</EmptyTitle>
          <EmptyDescription>잠시 후 다시 시도해주세요.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button onClick={() => void refetch()}>다시 불러오기</Button>
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <section className="rounded-card bg-card p-7 shadow-card">
      <div className="grid grid-cols-[auto_1fr] items-center gap-6">
        <div className="grid size-24 place-items-center rounded-card bg-kb-yellow text-kb-ink">
          <UserRoundIcon className="size-11" aria-hidden="true" />
        </div>
        <div>
          <p className="text-sm font-black text-muted-foreground">Member</p>
          <h2 className="mt-3 text-2xl font-black text-kb-ink">{data.name}</h2>
          <p className="mt-3 text-sm font-bold leading-relaxed text-muted-foreground">{data.memo}</p>
        </div>
      </div>
      <Button className="mt-7 h-12 w-full rounded-2xl text-base font-black" type="button" variant="outline" onClick={logout}>
        <LogOutIcon data-icon="inline-start" aria-hidden="true" />
        로그아웃
      </Button>
    </section>
  );
}
