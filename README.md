# KB Healthcare Frontend Assignment

KB헬스케어 프론트엔드 과제 제출용 React SPA입니다.  
제공된 [requirement.md](./docs/requirement.md)와 [openapi.yaml](./docs/openapi.yaml)을 기준으로 로그인, 대시보드, 할 일 목록/상세, 회원정보 화면을 구현했습니다.

## JD 반영 방향

과제 범위에서 검증 가능한 JD 우대사항을 중심으로 반영했습니다.

- TypeScript 기반 화면/라우팅 구조
- Tailwind CSS 기반 스타일링과 색상 토큰 관리
- React Hook Form 기반 로그인 폼 상태 관리
- WCAG를 고려한 label, button, dialog, navigation 구성
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
| Styling | Tailwind CSS, shadcn/ui, Pretendard |
| Mock API | MSW |
| API Type | openapi-typescript |
| Test | Vitest, Testing Library, Playwright |
| Icon | Lucide React |

## 구현 범위

| 영역 | 구현 내용 |
| --- | --- |
| 공통 레이아웃 | 상단 헤더, 하단 내비게이션, 로그인/회원정보 진입점 |
| 로그인 | 이메일/비밀번호 검증, 로그인 요청, 실패 모달 |
| 인증 | access token 관리, refresh 요청, 보호 라우트, 세션 만료 안내 |
| 대시보드 | 일, 해야할 일, 한 일 통계 표시 |
| 할 일 목록 | 카드 목록, 무한 스크롤, 가상 스크롤, 상세 이동 |
| 할 일 상세 | 상세 조회, 404 empty state, ID 입력 기반 삭제 확인 |
| 회원정보 | `/api/user` 응답의 `name`, `memo` 표시 |
| Mock API | OpenAPI 명세 기준 MSW handler 구성 |
| 테스트 | 폼 검증 단위 테스트, 로그인/상세/삭제 E2E 테스트 |

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

## OpenAPI 사용

OpenAPI 명세는 `openapi-typescript`로 TypeScript schema를 생성했습니다.

```bash
npm run generate:api
```

생성된 타입은 `src/shared/api/schema.ts`에 위치합니다.  
API client는 생성 도구에 맡기지 않고, 과제 요구 흐름에 맞춰 `fetch` 기반으로 직접 작성했습니다.

## API 기준

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

테스트 계정:

```text
care@kbhealth.com / Password1
```

## 검증 방법

```bash
npm run lint
npm run test
npm run test:e2e
npm run build
```

`test:e2e`는 기존 개발 서버와 충돌하지 않도록 `5174` 포트를 사용합니다.

## 추후 개선사항

- 상태 변경: OpenAPI에 상태 변경 API가 없어 읽기 전용으로 처리했습니다.
- 서버 로그아웃: OpenAPI에 로그아웃 API가 없어 서버 세션 폐기는 구현하지 않았습니다.
- 로깅/모니터링: 실제 운영 도구 연동은 과제 범위 밖으로 보고 문서상 개선사항으로 남겼습니다.

## AI 활용

AI 활용 범위는 [AI_USAGE.md](./AI_USAGE.md)에 정리했습니다.
