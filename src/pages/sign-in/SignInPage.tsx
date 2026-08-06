import { zodResolver } from "@hookform/resolvers/zod";
import { useState, type KeyboardEvent } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/features/auth/AuthProvider";
import { signInSchema, type SignInFormValues } from "@/features/auth/sign-in-schema";
import { ApiError } from "@/shared/api/http-client";
import { Button } from "@/shared/ui/button";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/shared/ui/field";
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

export default function SignInPage() {
  const { login } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await login(values);
    } catch (error) {
      setErrorMessage(error instanceof ApiError ? error.errorMessage : "로그인 요청을 처리하지 못했습니다.");
    }
  });
  const closeErrorDialog = () => setErrorMessage(null);
  const handleErrorDialogOpenChange = (open: boolean) => {
    if (!open) {
      closeErrorDialog();
    }
  };
  const handleErrorDialogKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      closeErrorDialog();
    }
  };

  return (
    <>
      <div className="flex min-h-[calc(100svh-15rem)] items-center justify-center py-6">
        <section aria-labelledby="sign-in-title" className="w-full max-w-105 rounded-card bg-card p-8 shadow-panel">
          <img src="/logo_text.svg" alt="KB O'CARE" width="594" height="140" className="h-8 w-auto" />
          <h2 id="sign-in-title" className="mt-9 text-3xl font-black leading-tight text-kb-ink text-balance">
            케어 태스크를 시작해요
          </h2>
          <p className="mt-3 text-sm font-bold text-muted-foreground">테스트 계정으로 로그인할 수 있습니다.</p>

          <form className="mt-8" onSubmit={onSubmit} noValidate aria-busy={isSubmitting}>
            <FieldGroup>
              <Field data-invalid={Boolean(errors.email) || undefined}>
                <FieldLabel htmlFor="email">이메일</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="care@kbhealth.com"
                  autoComplete="email"
                  spellCheck={false}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? "email-error" : "email-description"}
                  aria-errormessage={errors.email ? "email-error" : undefined}
                  {...register("email")}
                />
                {errors.email ? (
                  <FieldError id="email-error" errors={[errors.email]} />
                ) : (
                  <FieldDescription id="email-description">이메일 형식으로 입력해주세요.</FieldDescription>
                )}
              </Field>
              <Field data-invalid={Boolean(errors.password) || undefined}>
                <FieldLabel htmlFor="password">비밀번호</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  placeholder="Password1"
                  autoComplete="current-password"
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={errors.password ? "password-error" : "password-description"}
                  aria-errormessage={errors.password ? "password-error" : undefined}
                  {...register("password")}
                />
                {errors.password ? (
                  <FieldError id="password-error" errors={[errors.password]} />
                ) : (
                  <FieldDescription id="password-description">
                    영문과 숫자로 구성된 8자 이상 24자 이하 문자열입니다.
                  </FieldDescription>
                )}
              </Field>
              <Button
                className="mt-2 h-12 w-full rounded-2xl text-base font-black"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "로그인 중…" : "로그인"}
              </Button>
            </FieldGroup>
          </form>
        </section>
      </div>

      <AlertDialog open={Boolean(errorMessage)} onOpenChange={handleErrorDialogOpenChange}>
        <AlertDialogContent onKeyDown={handleErrorDialogKeyDown}>
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
    </>
  );
}
