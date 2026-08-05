# AI 활용 내역

본 문서는 KB헬스케어 프론트엔드 과제 수행 과정에서 AI를 활용한 범위와 사람이 최종 검증한 내용을 정리한 문서입니다.

## 사용한 도구와 모델

- OpenAI Codex: 요구사항 분석, 구현 방향 정리, 코드 작성 보조, 테스트 시나리오 작성 보조, 문서 초안 정리에 활용
- Codex `frontend-skill`: 모바일 앱 UI의 정보 구조, 화면 밀도, 색상/타이포그래피 톤 점검에 활용
- Codex `webapp-testing`: Playwright 기반 사용자 흐름 검증 방식 점검에 활용

## 디자인 참고 자료

- KB O'CARE 공식 사이트: https://www.kbollacare.com/
- NETIVE KB헬스케어 포트폴리오: https://www.netive.co.kr/portfolio/b002
- 사용자가 제공한 O'CARE 모바일 화면 캡처

위 자료는 브랜드 톤, 화면 밀도, 버튼/카드 스타일, 모바일 내비게이션 방향을 정하는 참고 자료로 활용했습니다.

## 활용 범위

- `requirement.md`와 `openapi.yaml`을 기준으로 구현 범위 정리
- 로그인, 대시보드, 할 일 목록, 할 일 상세, 회원정보 화면의 UI 구조 설계 보조
- KB O'CARE 앱 톤을 참고한 모바일/WebView 중심 레이아웃 방향 정리
- React, TypeScript, TanStack Router, TanStack Query, TanStack Virtual, Tailwind CSS 기반 구현 보조
- MSW handler와 mock data 구성 보조
- Vitest, Playwright 기반 테스트 케이스 작성 보조
- README 문서 구조와 추후 개선사항 정리 보조

## 핵심 프롬프트 요약

- `requirement.md`와 `openapi.yaml` 기준의 필수 화면, API 연동 범위, 예외 케이스 분석
- KB헬스케어/O'CARE 서비스 톤과 모바일 화면 캡처를 참고한 WebView 중심 UI 방향 설계
- 로그인 실패, 보호 라우트, 삭제 확인, 404 상세 화면, 로그아웃 후 재진입 흐름에 대한 테스트 시나리오 구성

## 사람이 최종 검증한 내용

- 명세: 실제 기능 흐름이 OpenAPI에 정의된 endpoint와 response schema를 벗어나지 않는지 점검
- 코드: 라우팅, 인증 상태, 토큰 저장/삭제, API client, MSW handler, TanStack Query cache invalidation 흐름 점검
- 데이터: `/api/task`를 `status` 필드가 포함된 전체 목록으로 해석하고, 필터 파라미터가 없는 점을 기준으로 화면 표시 범위 결정
- UI/문구: 로그인 실패 모달, 보호 라우트, 회원정보 진입점, 404 상세 화면, 삭제 확인 입력, 버튼 레이블 검토
- 테스트: 아래 명령으로 정적 검사, 단위 테스트, E2E, 프로덕션 빌드 확인

```bash
npm run lint
npm run test
npm run test:e2e
npm run build
```

## 보안

- 실제 개인정보, 운영 API 키, 회사 내부 정보는 사용하지 않았습니다.
- 로그인 계정과 API 응답은 제출용 MSW mock data로만 구성했습니다.
