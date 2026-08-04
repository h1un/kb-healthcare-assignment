import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email("이메일 형식으로 입력해주세요."),
  password: z
    .string()
    .min(8, "비밀번호는 8자 이상이어야 합니다.")
    .max(24, "비밀번호는 24자 이하여야 합니다.")
    .regex(/^[A-Za-z0-9]+$/, "비밀번호는 영문과 숫자만 사용할 수 있습니다."),
});

export type SignInFormValues = z.infer<typeof signInSchema>;
