import { Link } from "@tanstack/react-router";
import { Button } from "@/shared/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";

export function SignInPage() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-background px-6 py-10">
      <section className="w-full max-w-[420px] rounded-[2rem] bg-card p-8 shadow-[0_24px_60px_rgba(35,40,50,0.08)]">
        <img src="/logo_text.svg" alt="KB O'CARE" className="h-8 w-auto" />
        <h1 className="mt-9 text-3xl font-black leading-tight text-kb-ink">케어 태스크를 시작해요</h1>
        <p className="mt-3 text-sm font-bold text-muted-foreground">테스트 계정으로 로그인할 수 있습니다.</p>

        <form className="mt-8">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">이메일</FieldLabel>
              <Input id="email" type="email" placeholder="care@kbhealth.com" />
              <FieldDescription>이메일 형식으로 입력해주세요.</FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="password">비밀번호</FieldLabel>
              <Input id="password" type="password" placeholder="Password1" />
              <FieldDescription>영문과 숫자로 구성된 8자 이상 24자 이하 문자열입니다.</FieldDescription>
            </Field>
            <Button className="mt-2 h-12 w-full rounded-2xl text-base font-black" type="button">
              로그인
            </Button>
          </FieldGroup>
        </form>

        <Button className="mt-4 w-full" variant="ghost" asChild>
          <Link to="/">대시보드로 돌아가기</Link>
        </Button>
      </section>
    </main>
  );
}
