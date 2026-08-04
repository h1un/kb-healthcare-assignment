# KB Healthcare Frontend Assignment

KB헬스케어 프론트엔드 과제 제출을 위한 React SPA입니다.  
제공된 `requirement.md`와 `openapi.yaml`을 기준으로 대시보드, 로그인, 할 일 목록, 할 일 상세, 회원정보 화면을 구현합니다.

## JD 반영 방향

KB헬스케어 프론트엔드 JD의 우대사항 중 과제 범위에서 검증 가능한 항목을 중심으로 반영합니다.

- TanStack Router + TypeScript 기반 라우팅 구성
- Tailwind CSS 기반 스타일링과 색상 토큰 관리
- React Hook Form 기반 로그인 폼 상태 관리
- WCAG를 고려한 label, button, dialog, navigation 구성
- FSD(Feature-Sliced Design) 구조를 과제 규모에 맞게 단순화 적용
- MSW 기반 API mocking 및 테스트 가능한 개발 환경 구성
- 모바일/WebView 환경을 고려한 반응형 레이아웃
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

## 구현 예정 범위

| 영역 | 구현 내용 |
| --- | --- |
| 공통 레이아웃 | GNB/LNB, 로그인/회원정보 진입점, 반응형 내비게이션 |
| 로그인 | 이메일/비밀번호 검증, 로그인 요청, 실패 모달 |
| 인증 | access token 관리, refresh token 기반 세션 복구, 보호 라우트 |
| 대시보드 | 전체 할 일, 해야 할 일, 완료한 일 통계 표시 |
| 할 일 목록 | 카드 목록, 가상 스크롤, 무한 스크롤, 상세 이동 |
| 할 일 상세 | 상세 조회, 404 empty state, 삭제 확인 모달 |
| 회원정보 | `/api/user` 응답 기반 사용자 정보 표시 |
| Mock API | OpenAPI 명세를 기준으로 MSW handler 구성 |
| 테스트 | 폼 검증, 삭제 모달, 주요 사용자 흐름 검증 |
| 문서 | README, AI_USAGE 작성 |

## 프로젝트 구조

```text
src/
  app/
    providers/
    routes/
    styles/
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
    config/
    lib/
    mocks/
    ui/
```

본 프로젝트는 FSD를 과제 규모에 맞게 단순화해 적용합니다.

- `app`: 앱 초기화, 라우터, provider, 전역 스타일
- `pages`: 라우트 단위 화면
- `widgets`: 화면을 구성하는 큰 UI 블록
- `features`: 로그인, 삭제 확인, 세션 만료 처리처럼 사용자 행동 단위 기능
- `entities`: task, user, dashboard, auth 등 도메인 API와 타입
- `shared`: 공통 UI, API client, 유틸, 설정, mock

## API 기준

API 연동은 `openapi.yaml`을 우선 기준으로 합니다.

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

개발 서버 기본 주소:

```text
http://localhost:5173
```

## 검증 방법

```bash
npm run lint
npm run test
npm run test:e2e
npm run build
```

## AI 활용

Agent AI를 활용한 범위는 `AI_USAGE.md`에 별도로 정리합니다.
