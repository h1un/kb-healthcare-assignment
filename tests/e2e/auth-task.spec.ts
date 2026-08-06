import { expect, test, type Page } from "@playwright/test";

const TEST_EMAIL = "care@kbhealth.com";
const TEST_PASSWORD = "Password1";

async function signIn(page: Page) {
  await page.goto("/sign-in");
  await page.getByLabel("이메일").fill(TEST_EMAIL);
  await page.getByLabel("비밀번호").fill(TEST_PASSWORD);
  await page.getByRole("button", { name: "로그인" }).click();
  await expect(page.getByText("29 / 87 완료")).toBeVisible();
}

test("로그인 후 대시보드와 할 일 상세를 확인한다", async ({ page }) => {
  await signIn(page);
  await page.getByRole("link", { name: "할 일 목록으로 이동" }).click();

  await expect(page.getByText(/불러온 \d+개의 할 일/)).toBeVisible();
  await page.getByRole("link", { name: "TASK-001 아침 스트레칭 10분 상세 보기" }).click();

  await expect(page.getByText("TASK-001")).toBeVisible();
  await expect(page.getByRole("heading", { name: "아침 스트레칭 10분" })).toBeVisible();
  await expect(page.getByText(/등록$/)).toBeVisible();
});

test("할 일 목록은 끝까지 불러오면서 화면 주변 카드만 렌더링한다", async ({ page }) => {
  await signIn(page);
  await page.getByRole("link", { name: "할 일", exact: true }).click();
  await expect(page.getByText("불러온 12개의 할 일")).toBeVisible();

  for (const count of [24, 36, 48, 60, 72, 84, 87]) {
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await expect(page.getByText(`불러온 ${count}개의 할 일`)).toBeVisible();
  }

  const renderedCards = page.locator('a[aria-label$="상세 보기"]');
  await expect(renderedCards).not.toHaveCount(0);
  expect(await renderedCards.count()).toBeLessThan(20);
});

test("mock API는 발급되지 않은 인증 토큰을 거부한다", async ({ page }) => {
  await page.goto("/sign-in");
  await expect(page.getByRole("heading", { name: "케어 태스크를 시작해요" })).toBeVisible();

  const statuses = await page.evaluate(async () => {
    const [refreshResponse, userResponse] = await Promise.all([
      fetch("/api/refresh", { method: "POST", credentials: "include" }),
      fetch("/api/user", { headers: { Authorization: "Bearer access-not-issued" } }),
    ]);

    return [refreshResponse.status, userResponse.status];
  });

  expect(statuses).toEqual([401, 401]);
});

test("320px 화면에서 대시보드 통계 카드가 읽기 가능한 한 열로 배치된다", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await signIn(page);

  const statCards = page.locator('[data-slot="card"]').filter({ has: page.getByText(/^(일|해야할 일|한 일)$/) });
  await expect(statCards).toHaveCount(3);

  const widths = await statCards.evaluateAll((cards) => cards.map((card) => card.getBoundingClientRect().width));
  expect(widths.every((width) => width > 240)).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(320);
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
  await signIn(page);

  await page.getByRole("link", { name: "할 일 목록으로 이동" }).click();
  await page.getByRole("link", { name: "TASK-002 물 2L 마시기 상세 보기" }).click();
  await page.getByRole("button", { name: "삭제하기" }).click();

  const deleteButton = page.getByRole("button", { name: "제출", exact: true });
  await expect(deleteButton).toBeDisabled();

  await page.getByLabel("할 일 ID").fill("TASK-002");
  await expect(deleteButton).toBeEnabled();
  await page.keyboard.press("Enter");

  await expect(page).toHaveURL(/\/task$/);
});

test("비로그인 사용자는 보호 라우트에서 로그인 화면으로 이동한다", async ({ page }) => {
  await page.goto("/task");

  await expect(page).toHaveURL(/\/sign-in$/);
  await expect(page.getByRole("link", { name: "로그인" })).toBeVisible();
  await expect(page.getByRole("navigation")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "케어 태스크를 시작해요" })).toBeVisible();
});

test("존재하지 않는 할 일 상세는 목록 복귀 동선을 제공한다", async ({ page }) => {
  await signIn(page);
  await page.goto("/task/UNKNOWN-TASK");

  await expect(page.getByRole("heading", { name: "할 일을 찾을 수 없어요" })).toBeVisible();
  await page.getByRole("link", { name: "목록으로 이동" }).click();
  await expect(page).toHaveURL(/\/task$/);
});

test("회원정보 화면은 사용자 이름과 메모를 표시한다", async ({ page }) => {
  await signIn(page);
  await page.getByRole("link", { name: "회원정보" }).click();

  await expect(page).toHaveURL(/\/member$/);
  await expect(page.getByText("케어 매니저")).toBeVisible();
  await expect(page.getByText("KB헬스케어 케어 태스크 운영 담당자")).toBeVisible();
  await page.getByRole("button", { name: "로그아웃" }).click();

  await expect(page).toHaveURL(/\/sign-in$/);
  await expect(page.getByRole("link", { name: "로그인" })).toBeVisible();
  await expect(page.getByRole("navigation")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "케어 태스크를 시작해요" })).toBeVisible();
});
