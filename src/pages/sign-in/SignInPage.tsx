import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/features/auth/AuthProvider";
import { signInSchema, type SignInFormValues } from "@/features/auth/sign-in-schema";
import { ApiError } from "@/shared/api/http-client";
import { Button } from "@/shared/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/ui/alert-dialog";

export function SignInPage() {
  const navigate = useNavigate();
  const { status, login } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (status === "authenticated") {
      void navigate({ to: "/", replace: true });
    }
  }, [navigate, status]);

  const onSubmit = handleSubmit(async (values) => {
    try {
      await login(values);
      await navigate({ to: "/", replace: true });
    } catch (error) {
      setErrorMessage(error instanceof ApiError ? error.errorMessage : "로그인 요청을 처리하지 못했습니다.");
    }
  });
  const closeErrorDialog = () => setErrorMessage(null);

  return (
    <section className="flex min-h-[calc(100svh-12rem)] items-center justify-center py-2">
      <section className="w-full max-w-[420px] rounded-[2rem] bg-card p-8 shadow-[0_24px_60px_rgba(35,40,50,0.08)]">
        <img src="/logo_text.svg" alt="KB O'CARE" className="h-8 w-auto" />
        <h1 className="mt-9 text-3xl font-black leading-tight text-kb-ink">케어 태스크를 시작해요</h1>
        <p className="mt-3 text-sm font-bold text-muted-foreground">테스트 계정으로 로그인할 수 있습니다.</p>

        <form className="mt-8" onSubmit={onSubmit} noValidate>
          <FieldGroup>
            <Field data-invalid={Boolean(errors.email) || undefined}>
              <FieldLabel htmlFor="email">이메일</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="care@kbhealth.com"
                autoComplete="email"
                aria-invalid={Boolean(errors.email)}
                {...register("email")}
              />
              <FieldDescription>{errors.email?.message ?? "이메일 형식으로 입력해주세요."}</FieldDescription>
            </Field>
            <Field data-invalid={Boolean(errors.password) || undefined}>
              <FieldLabel htmlFor="password">비밀번호</FieldLabel>
              <Input
                id="password"
                type="password"
                placeholder="Password1"
                autoComplete="current-password"
                aria-invalid={Boolean(errors.password)}
                {...register("password")}
              />
              <FieldDescription>
                {errors.password?.message ?? "영문과 숫자로 구성된 8자 이상 24자 이하 문자열입니다."}
              </FieldDescription>
            </Field>
            <Button className="mt-2 h-12 w-full rounded-2xl text-base font-black" type="submit" disabled={!isValid || isSubmitting}>
              {isSubmitting ? "로그인 중..." : "로그인"}
            </Button>
          </FieldGroup>
        </form>
      </section>

      <AlertDialog open={Boolean(errorMessage)} onOpenChange={(open) => !open && closeErrorDialog()}>
        <AlertDialogContent
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              closeErrorDialog();
            }
          }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle>로그인할 수 없어요.</AlertDialogTitle>
            <AlertDialogDescription>{errorMessage ?? "입력한 정보를 다시 확인해주세요."}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="grid-cols-1">
            <AlertDialogAction autoFocus onClick={closeErrorDialog}>
              확인
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
