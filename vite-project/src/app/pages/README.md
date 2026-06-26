# Pages Folder Guide

`pages`는 URL에 직접 연결되는 route component를 관리합니다. 각 page는 라우트 진입점 역할을 하고, 복잡한 상태나 세부 UI는 `features/`, `components/`, `data/`에서 가져옵니다.

## 루트 페이지

| 파일 | 역할 |
| --- | --- |
| `HomePage.tsx` | 홈 화면입니다. 전체 섹션, 검색, 빠른 이동을 보여줍니다. |
| `ComponentsPage.tsx` | 컴포넌트 카탈로그 랜딩 화면입니다. |
| `FullAppsPage.tsx` | 완성형 앱 카탈로그 랜딩 화면입니다. |
| `LibrariesPage.tsx` | 라이브러리 카탈로그 랜딩 화면입니다. |
| `ToolsPage.tsx` | 도구 카탈로그 랜딩 화면입니다. |
| `McpPage.tsx` | MCP 소개와 import 흐름 화면입니다. |

## 하위 폴더

| 경로 | 역할 |
| --- | --- |
| `components/` | 개별 UI 컴포넌트 쇼케이스 라우트입니다. |
| `fullapps/` | 앱형 화면 라우트입니다. |
| `libraries/` | 라이브러리 화면 라우트입니다. |
| `tools/` | 도구 화면 라우트입니다. |

## 작업 기준

- 새 page 파일 이름은 `PascalCasePage.tsx` 형태를 우선합니다.
- page는 라우트 단위 조립에 집중하고, 긴 상태 로직은 feature controller로 분리합니다.
- 새 라우트는 `config/navigationSections.tsx`에 먼저 추가합니다.
- 카탈로그 항목과 검색 대상도 라우트와 함께 맞춰 갱신합니다.
- page 전용 문구가 길어지면 feature `copy.ts` 또는 `i18n.ts`로 분리합니다.
