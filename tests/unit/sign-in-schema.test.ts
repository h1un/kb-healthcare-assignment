import { describe, expect, it } from "vitest";
import { signInSchema } from "@/features/auth/sign-in-schema";

describe("signInSchema", () => {
  it("accepts an email and an 8-24 character alphanumeric password", () => {
    const result = signInSchema.safeParse({
      email: "care@kbhealth.com",
      password: "Password1",
    });

    expect(result.success).toBe(true);
  });

  it("rejects invalid email and password formats", () => {
    const result = signInSchema.safeParse({
      email: "care",
      password: "pass!word",
    });

    expect(result.success).toBe(false);
  });
});
