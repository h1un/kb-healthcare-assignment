# KB Healthcare Frontend Assignment

KB헬스케어 프론트엔드 과제 제출용 React SPA입니다.  
제공된 [requirement.md](./docs/requirement.md)와 [openapi.yaml](./docs/openapi.yaml)을 기준으로 로그인, 대시보드, 할 일 목록/상세, 회원정보 화면을 구현했습니다.

## 테스트 계정

```text
care@kbhealth.com / Password1
```

## 요구사항 반영

| 영역 | 반영 내용 | 주요 구현 |
| --- | --- | --- |
| 공통 | React 19·TypeScript, 색상 토큰, Pretendard, 화면별 고유 아이콘 | [`package.json`](./package.json), [`index.css`](./src/index.css) |
| 내비게이션 | 대시보드·할 일 라우트와 로그인 상태별 로그인·회원정보 진입점 | [`AppLayout.tsx`](./src/widgets/app-layout/AppLayout.tsx), [`router.tsx`](./src/app/routes/router.tsx) |
| 로그인 | 이메일·비밀번호 검증, 제출 활성화 조건, 로그인 요청과 실패 모달 | [`SignInPage.tsx`](./src/pages/sign-in/SignInPage.tsx), [`sign-in-schema.ts`](./src/features/auth/sign-in-schema.ts) |
| 인증 | access token 관리, refresh 요청, 보호 라우트, 세션 만료 안내 | [`AuthProvider.tsx`](./src/features/auth/AuthProvider.tsx), [`http-client.ts`](./src/shared/api/http-client.ts) |
| 대시보드 | 일·해야할 일·한 일 통계 표시 | [`DashboardPage.tsx`](./src/pages/dashboard/DashboardPage.tsx) |
| 할 일 목록 | title·memo 카드, 가상 스크롤, 무한 스크롤, 상세 이동 | [`TaskListPage.tsx`](./src/pages/task-list/TaskListPage.tsx) |
| 할 일 상세 | 상세 조회, 404 화면, ID 입력 기반 삭제 확인과 목록 이동 | [`TaskDetailPage.tsx`](./src/pages/task-detail/TaskDetailPage.tsx), [`DeleteTaskDialog.tsx`](./src/features/delete-task/DeleteTaskDialog.tsx) |
| 회원정보 | `/api/user` 응답의 `name`, `memo` 표시 | [`MemberPage.tsx`](./src/pages/member/MemberPage.tsx) |
| API·제출 문서 | OpenAPI 타입 생성, MSW 모킹, AI 활용 범위 기록 | [`schema.ts`](./src/shared/api/schema.ts), [`handlers.ts`](./src/shared/mocks/handlers.ts), [`AI_USAGE.md`](./AI_USAGE.md) |

핵심 사용자 흐름은 [`auth-task.spec.ts`](./tests/e2e/auth-task.spec.ts), 접근성은 [`accessibility.spec.ts`](./tests/e2e/accessibility.spec.ts), 인증과 API 예외 처리는 [`tests/unit`](./tests/unit)에서 검증합니다.

### JD 반영 방향

과제 범위에서 검증 가능한 JD 우대사항을 중심으로 반영했습니다.

- TypeScript와 TanStack Router 기반 화면·라우팅 구조
- Tailwind CSS 기반 스타일링과 색상 토큰 관리
- React Hook Form 기반 로그인 폼 상태 관리
- WCAG 2.2 AA 기준을 반영한 폼, 다이얼로그, 내비게이션 구성
- FSD(Feature-Sliced Design) 구조를 과제 규모에 맞게 단순화 적용
- MSW 기반 API mocking 및 테스트 가능한 개발 환경 구성
- 모바일/WebView 환경을 고려한 단일 컬럼 반응형 레이아웃
- Reflow/Repaint 비용을 고려한 목록 렌더링 최적화

## 기술 스택

| 영역 | 기술 |
| --- | --- |
| Core | React 19, TypeScript, Vite |
| Routing | TanStack Router |
| Server State | TanStack Query |
| List Rendering | TanStack Virtual |
| Form | React Hook Form, Zod |
| Styling | Tailwind CSS, shadcn/ui, Pretendard Variable 동적 서브셋 |
| Mock API | MSW |
| API Type | openapi-typescript |
| Test | Vitest, Testing Library, Playwright, axe-core |
| Icon | Lucide React |

## 프로젝트 구조

```text
src/
  app/
    providers/
    routes/
  pages/
    dashboard/
    sign-in/
    task-list/
    task-detail/
    member/
    not-found/
  widgets/
    app-layout/
  features/
    auth/
    delete-task/
    session-expired/
  entities/
    auth/
    dashboard/
    task/
    user/
  shared/
    api/
    lib/
    mocks/
    ui/
```

- `app`: 앱 초기화, 라우터, provider
- `pages`: 라우트 단위 화면
- `widgets`: 화면을 구성하는 큰 UI 블록
- `features`: 로그인, 삭제 확인, 세션 만료 처리처럼 사용자 행동 단위 기능
- `entities`: task, user, dashboard, auth 등 도메인 API
- `shared`: 공통 UI, API client, 유틸, mock

## OpenAPI와 API 범위

OpenAPI 명세는 `openapi-typescript`로 TypeScript schema를 생성했습니다.

```bash
npm run generate:api
```

생성된 타입은 `src/shared/api/schema.ts`에 위치합니다.  
API client는 생성 도구에 맡기지 않고, 과제 요구 흐름에 맞춰 `fetch` 기반으로 직접 작성했습니다.

| API | 용도 |
| --- | --- |
| `POST /api/sign-in` | 로그인 |
| `POST /api/refresh` | access token 재발급 |
| `GET /api/user` | 회원정보 조회 |
| `GET /api/dashboard` | 대시보드 통계 조회 |
| `GET /api/task?page=N` | 할 일 목록 조회 |
| `GET /api/task/{id}` | 할 일 상세 조회 |
| `DELETE /api/task/{id}` | 할 일 삭제 |

## 실행 방법

```bash
npm install
npm run dev
```

개발 서버 기본 주소는 `http://localhost:5173`입니다.

빌드 결과를 mock API와 함께 확인하려면 다음 명령을 사용합니다.

```bash
npm run preview:mock
```

## 검증과 CI

```bash
npm run lint
npm run test
npm run test:e2e
npm run build
```

`test:e2e`는 기존 개발 서버와 충돌하지 않도록 `5174` 포트를 사용합니다.
Playwright E2E에는 axe 기반 WCAG 2.2 AA 검사, 키보드 탐색, 320px 리플로우, 200% 글자 확대 검증이 포함됩니다.

GitHub Actions는 push와 pull request마다 Node.js 22 환경에서 다음 검증을 수행합니다.

1. 의존성 재현 설치
2. 정적 검사와 단위 테스트
3. 프로덕션 빌드
4. Chromium 기반 Playwright E2E

워크플로는 [ci.yml](./.github/workflows/ci.yml)에서 확인할 수 있습니다.

## 추후 개선사항

- 할 일 생성: OpenAPI에 `POST /api/task`가 제공되면 할 일 추가 폼과 생성 후 목록 갱신 흐름을 확장할 수 있습니다.
- 상태 변경: 완료/미완료 변경 API가 추가되면 카드 상태 토글과 대시보드 카운트 갱신을 연결할 수 있습니다.
- 서버 로그아웃: 현재는 브라우저에 저장된 토큰을 삭제하는 클라이언트 로그아웃으로 처리했으며, 로그아웃 API가 제공되면 refresh token 무효화까지 확장할 수 있습니다.
- 상태별 서버 필터: `/api/task`에 상태 필터 파라미터가 추가되면 `전체/해야할 일/한 일` 필터를 서버 페이지네이션과 함께 처리할 수 있습니다.
