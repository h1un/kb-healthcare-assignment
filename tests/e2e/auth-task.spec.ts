import { expect, test } from "@playwright/test";

test("로그인 후 대시보드와 할 일 상세를 확인한다", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "케어 태스크를 시작해요" })).toBeVisible();
  await page.getByLabel("이메일").fill("care@kbhealth.com");
  await page.getByLabel("비밀번호").fill("Password1");
  await page.getByRole("button", { name: "로그인" }).click();

  await expect(page.getByText("29 / 87 완료")).toBeVisible();
  await page.getByRole("link", { name: "할 일 목록으로 이동" }).click();

  await expect(page.getByText(/불러온 \d+개의 할 일/)).toBeVisible();
  await page.getByRole("link", { name: /아침 스트레칭 10분/ }).first().click();

  await expect(page.getByText("TASK-001")).toBeVisible();
  await expect(page.getByRole("heading", { name: "아침 스트레칭 10분" })).toBeVisible();
  await expect(page.getByText(/등록$/)).toBeVisible();
});

test("로그인 실패 모달은 Enter로 닫힌다", async ({ page }) => {
  await page.goto("/sign-in");
  await page.getByLabel("이메일").fill("care@kbhealth.com");
  await page.getByLabel("비밀번호").fill("Password2");
  await page.getByRole("button", { name: "로그인" }).click();

  await expect(page.getByRole("heading", { name: "로그인할 수 없어요." })).toBeVisible();
  await expect(page.getByRole("button", { name: "취소" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "확인" })).toBeVisible();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("heading", { name: "로그인할 수 없어요." })).toBeHidden();
});

test("삭제 확인 입력값이 할 일 ID와 같을 때만 삭제할 수 있다", async ({ page }) => {
  await page.goto("/sign-in");
  await page.getByLabel("이메일").fill("care@kbhealth.com");
  await page.getByLabel("비밀번호").fill("Password1");
  await page.getByRole("button", { name: "로그인" }).click();
  await expect(page.getByText("29 / 87 완료")).toBeVisible();

  await page.getByRole("link", { name: /할 일 목록 보러가기/ }).click();
  await page.getByRole("link", { name: /물 2L 마시기/ }).click();
  await page.getByRole("button", { name: "삭제하기" }).click();

  const deleteButton = page.getByRole("button", { name: "삭제", exact: true });
  await expect(deleteButton).toBeDisabled();

  await page.getByLabel("할 일 ID").fill("TASK-002");
  await expect(deleteButton).toBeEnabled();
  await page.keyboard.press("Enter");

  await expect(page).toHaveURL(/\/task$/);
});
