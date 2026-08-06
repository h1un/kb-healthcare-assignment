import { AxeBuilder } from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const TEST_EMAIL = "care@kbhealth.com";
const TEST_PASSWORD = "Password1";
const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

async function signIn(page: Page) {
  await page.goto("/sign-in");
  await page.getByLabel("이메일").fill(TEST_EMAIL);
  await page.getByLabel("비밀번호").fill(TEST_PASSWORD);
  await page.getByRole("button", { name: "로그인" }).click();
  await expect(page.getByText("29 / 87 완료")).toBeVisible();
}

async function expectNoAccessibilityViolations(page: Page) {
  const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
  const summary = results.violations
    .map((violation) => {
      const targets = violation.nodes.flatMap((node) => node.target).join(", ");
      return `${violation.id}: ${violation.help}\n${targets}`;
    })
    .join("\n\n");

  expect(results.violations, summary).toEqual([]);
}

async function expectNoHorizontalOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));

  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
}

test("로그인 화면은 WCAG 2.2 AA 자동 검사를 통과한다", async ({ page }) => {
  await page.goto("/sign-in");
  await expect(page.getByRole("heading", { name: "케어 태스크를 시작해요" })).toBeVisible();
  await expect
    .poll(() => page.evaluate(async () => {
      await document.fonts.ready;
      return document.fonts.check('16px "Pretendard Variable"');
    }))
    .toBe(true);

  await expectNoAccessibilityViolations(page);

  await page.getByRole("button", { name: "로그인" }).click();
  await expect(page.locator("#email-error")).toBeVisible();
  await expectNoAccessibilityViolations(page);
});

test("인증 후 주요 화면은 WCAG 2.2 AA 자동 검사를 통과한다", async ({ page }) => {
  await signIn(page);
  await expectNoAccessibilityViolations(page);

  await page.getByRole("link", { name: "할 일", exact: true }).click();
  await expect(page.getByText("불러온 12개의 할 일")).toBeVisible();
  await expectNoAccessibilityViolations(page);

  await page.getByRole("link", { name: /TASK-001 아침 스트레칭 10분/ }).click();
  await expect(page.getByRole("heading", { name: "아침 스트레칭 10분" })).toBeVisible();
  await expectNoAccessibilityViolations(page);

  await page.goto("/task/UNKNOWN-TASK");
  await expect(page.getByRole("heading", { name: "할 일을 찾을 수 없어요" })).toBeVisible();
  await expectNoAccessibilityViolations(page);

  await page.getByRole("link", { name: "회원정보" }).click();
  await expect(page.getByText("케어 매니저")).toBeVisible();
  await expectNoAccessibilityViolations(page);
});

test("오류와 삭제 모달은 WCAG 2.2 AA 자동 검사를 통과한다", async ({ page }) => {
  await page.goto("/sign-in");
  await page.getByLabel("이메일").fill(TEST_EMAIL);
  await page.getByLabel("비밀번호").fill("Password2");
  await page.getByRole("button", { name: "로그인" }).click();
  await expect(page.getByRole("alertdialog")).toBeVisible();
  await expectNoAccessibilityViolations(page);
  await page.getByRole("button", { name: "확인" }).click();

  await signIn(page);
  await page.goto("/task/TASK-002");
  await page.getByRole("button", { name: "삭제하기" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expectNoAccessibilityViolations(page);
});

test("320px 화면에서 주요 화면이 가로 스크롤 없이 리플로우된다", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto("/sign-in");
  await expect(page.getByRole("heading", { name: "케어 태스크를 시작해요" })).toBeVisible();
  await expectNoHorizontalOverflow(page);

  await page.getByLabel("이메일").fill(TEST_EMAIL);
  await page.getByLabel("비밀번호").fill(TEST_PASSWORD);
  await page.getByRole("button", { name: "로그인" }).click();
  await expect(page.getByText("29 / 87 완료")).toBeVisible();
  await expectNoHorizontalOverflow(page);

  await page.getByRole("link", { name: "할 일", exact: true }).click();
  await expect(page.getByText(/불러온 \d+개의 할 일/)).toBeVisible();
  await expectNoHorizontalOverflow(page);

  await page.getByRole("link", { name: /TASK-001 아침 스트레칭 10분/ }).click();
  await expect(page.getByRole("heading", { name: "아침 스트레칭 10분" })).toBeVisible();
  await expectNoHorizontalOverflow(page);

  await page.getByRole("link", { name: "회원정보" }).click();
  await expect(page.getByText("케어 매니저")).toBeVisible();
  await expectNoHorizontalOverflow(page);
});

test("200% 글자 확대에서도 콘텐츠와 기능이 손실되지 않는다", async ({ page }) => {
  await page.setViewportSize({ width: 720, height: 900 });
  await page.goto("/sign-in");
  await expect(page.getByRole("heading", { name: "케어 태스크를 시작해요" })).toBeVisible();
  await page.evaluate(() => {
    document.documentElement.style.fontSize = "200%";
  });
  await expectNoHorizontalOverflow(page);
  await expect(page.getByRole("button", { name: "로그인" })).toBeVisible();

  await page.getByLabel("이메일").fill(TEST_EMAIL);
  await page.getByLabel("비밀번호").fill(TEST_PASSWORD);
  await page.getByRole("button", { name: "로그인" }).click();
  await expect(page.getByText("29 / 87 완료")).toBeVisible();
  await expectNoHorizontalOverflow(page);

  await page.getByRole("link", { name: "할 일", exact: true }).click();
  await expect(page.getByText(/불러온 \d+개의 할 일/)).toBeVisible();
  await expectNoHorizontalOverflow(page);
  await expect(page.getByRole("link", { name: /TASK-001 아침 스트레칭 10분/ })).toBeVisible();
});

test("존재하지 않는 경로는 접근 가능한 404 화면을 제공한다", async ({ page }) => {
  await page.goto("/does-not-exist");
  await expect(page.getByRole("heading", { name: "페이지를 찾을 수 없습니다" })).toBeVisible();
  await expect(page.getByRole("link", { name: "대시보드로 이동" })).toBeVisible();
  await expectNoAccessibilityViolations(page);
});

test("세션 만료 알림은 보조 기술에 전달되고 로그인으로 복귀한다", async ({ page }) => {
  await signIn(page);
  await page.evaluate(() => window.dispatchEvent(new CustomEvent("auth:expired")));

  const dialog = page.getByRole("alertdialog");
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText("로그인이 만료됐어요.");
  await expectNoAccessibilityViolations(page);
  await page.getByRole("button", { name: "로그인하기" }).click();

  await expect(page).toHaveURL(/\/sign-in$/);
  await expect(page.getByRole("heading", { name: "케어 태스크를 시작해요" })).toBeVisible();
});

test("키보드로 본문 이동, 폼 오류 확인, 모달 닫기가 가능하다", async ({ page }) => {
  await page.goto("/sign-in");
  await expect(page.getByRole("heading", { name: "케어 태스크를 시작해요" })).toBeVisible();

  await page.keyboard.press("Tab");
  const skipLink = page.getByRole("link", { name: "본문으로 건너뛰기" });
  await expect(skipLink).toBeFocused();
  const skipLinkBox = await skipLink.boundingBox();
  expect(skipLinkBox?.width).toBeGreaterThan(100);
  expect(skipLinkBox?.height).toBeGreaterThan(24);
  expect(await skipLink.evaluate((element) => getComputedStyle(element).boxShadow)).not.toBe("none");
  await page.keyboard.press("Enter");
  await expect(page.locator("#main-content")).toBeFocused();

  await page.getByRole("button", { name: "로그인" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByLabel("이메일")).toBeFocused();
  await expect(page.locator("#email-error")).toHaveAttribute("role", "alert");

  await page.getByLabel("이메일").fill(TEST_EMAIL);
  await page.getByLabel("비밀번호").fill(TEST_PASSWORD);
  await page.getByRole("button", { name: "로그인" }).click();
  await expect(page.locator("#main-content")).toBeFocused();
  await expect(page.getByRole("navigation", { name: "주요 메뉴" }).getByRole("link", { name: "대시보드" })).toHaveAttribute(
    "aria-current",
    "page",
  );

  await page.goto("/task/TASK-002");
  const deleteTrigger = page.getByRole("button", { name: "삭제하기" });
  await deleteTrigger.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByLabel("할 일 ID")).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(deleteTrigger).toBeFocused();
});
