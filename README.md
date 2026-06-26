# Solucioneomos Web Workspace

React, TypeScript, Vite로 만든 화면 작업용 웹 워크스페이스입니다. 컴포넌트 카탈로그, 완성형 앱 예시, 재사용 라이브러리, 제작 도구, MCP 패키지 미리보기를 한 프로젝트 안에서 다룹니다.

## 실행 방법

```bash
cd vite-project
npm install
npm run dev
```

개발 서버는 기본적으로 `http://127.0.0.1:5173` 또는 Vite가 안내하는 로컬 주소에서 확인합니다.

## 확인 명령

```bash
cd vite-project
npm run typecheck
npm run build
npm run preview
```

- `npm run typecheck`: 앱 코드와 Vite 설정의 타입 오류를 확인합니다.
- `npm run build`: 프로덕션 번들을 만듭니다.
- `npm run preview`: 빌드 결과를 로컬에서 확인합니다.
- `npm run docs`: TypeDoc 문서를 `docs/` 폴더로 출력합니다.

## 주요 화면

- `/`: 전체 섹션, 검색, 빠른 이동을 제공하는 홈 화면입니다.
- `/components`: 버튼, 카드, 모달, 탭, 캘린더 같은 UI 패턴을 모아둔 카탈로그입니다.
- `/full-apps`: 피드백 관리, 프로젝트 관리, 크롬 확장, 청소 확인 같은 앱형 화면입니다.
- `/libraries`: YAML 템플릿과 SVG 아이콘 자산을 관리하는 라이브러리 화면입니다.
- `/tools`: 로고, 폼, SVG, 코드 변환 작업을 돕는 도구 화면입니다.
- `/mcp`: 컴포넌트 지식과 패키지 구성을 MCP 흐름으로 확인하는 화면입니다.

## 폴더 안내

| 경로 | 설명 |
| --- | --- |
| `.git/` | Git 이력과 브랜치 정보가 저장되는 내부 폴더입니다. 직접 수정하지 않습니다. |
| `.gitignore` | Git에 포함하지 않을 빌드 결과, 의존성, 로컬 설정 파일을 정의합니다. |
| `README.md` | 저장소 전체 구조와 실행 방법을 설명하는 문서입니다. |
| `vite-project/` | 실제 React 앱이 들어 있는 Vite 프로젝트입니다. 대부분의 개발 작업은 이 폴더에서 진행합니다. |

## `vite-project/` 폴더

| 경로 | 설명 |
| --- | --- |
| `dist/` | `npm run build` 결과물입니다. 배포용 정적 파일이 만들어지는 위치입니다. |
| `docs/` | `npm run docs`로 만든 TypeDoc 출력 폴더입니다. |
| `guidelines/` | 화면 제작 기준이나 디자인 규칙을 기록하는 보조 문서 폴더입니다. |
| `node_modules/` | npm 의존성이 설치되는 폴더입니다. 저장소에는 포함하지 않습니다. |
| `src/` | 앱 소스 코드가 들어 있는 핵심 폴더입니다. |
| `index.html` | Vite가 사용하는 HTML 진입 파일입니다. |
| `package.json` | 스크립트, 의존성, Node/npm 버전 조건을 관리합니다. |
| `package-lock.json` | npm 의존성 잠금 파일입니다. 설치 결과를 일정하게 유지합니다. |
| `postcss.config.mjs` | Tailwind CSS와 PostCSS 처리 설정입니다. |
| `tpyedoc.json` | TypeDoc 문서 출력 설정 파일입니다. |
| `tsconfig*.json` | TypeScript 컴파일 범위와 옵션을 나눠 관리합니다. |
| `vite.config.ts` | Vite, React, Tailwind, 경로 alias, 개발 서버, 빌드 청크 설정을 관리합니다. |

## `vite-project/src/` 폴더

| 경로 | 설명 |
| --- | --- |
| `main.tsx` | React 앱을 DOM에 연결하는 진입점입니다. |
| `vite-env.d.ts` | Vite 타입 선언 파일입니다. |
| `app/` | 라우팅, 전역 상태, 페이지, 기능 모듈, 데이터, 유틸을 담는 앱 본문입니다. |
| `styles/` | 전역 CSS, 테마, 폰트, Tailwind 엔트리를 관리합니다. |

## `vite-project/src/app/` 폴더

| 경로 | 설명 |
| --- | --- |
| `App.tsx` | 언어, 다크 모드, 사이드바 Provider와 라우터를 연결하는 루트 컴포넌트입니다. |
| `routes.tsx` | 중앙 라우트 메타데이터를 React Router 경로로 변환합니다. |
| `i18n.ts` | 공통 화면 문구와 라우트 문구를 언어별로 제공합니다. |
| `STRUCTURE.md` | 앱 내부 구조와 작업 기준을 간단히 적어둔 보조 문서입니다. |
| `components/` | 여러 화면에서 함께 쓰는 레이아웃, 검색, 카탈로그, 쇼케이스 UI입니다. |
| `config/` | 라우트, 헤더, 사이드바, 검색이 함께 쓰는 내비게이션 메타데이터입니다. |
| `context/` | 언어, 다크 모드, 사이드바 상태 같은 전역 UI 상태를 관리합니다. |
| `data/` | 카탈로그와 쇼케이스에 들어가는 정적 데이터를 관리합니다. |
| `features/` | 실제 화면 기능을 도메인별로 묶어둔 폴더입니다. |
| `hooks/` | 여러 화면에서 재사용하는 React hook을 둡니다. |
| `pages/` | URL에 직접 연결되는 페이지 컴포넌트를 둡니다. |
| `types/` | 카탈로그, 쇼케이스, 내비게이션 등 공통 타입을 정의합니다. |
| `utils/` | 클립보드, 검색, 로컬 저장소, ZIP 처리 같은 공통 함수를 둡니다. |

## `components/` 세부 구조

| 경로 | 설명 |
| --- | --- |
| `components/common/` | Button, Card, FormField, Section처럼 가장 기본이 되는 UI 조각입니다. |
| `components/catalog/` | 카탈로그 목록, 카드, 검색 UI를 구성합니다. |
| `components/header/` | 로고, 헤더 버튼, 드롭다운, 상단 내비게이션 링크를 나눠 관리합니다. |
| `components/search/` | 검색 모달의 입력, 결과 목록, 빈 상태, 최근 검색 저장 로직을 담당합니다. |
| `components/showcase/` | 프리뷰 카드, 지표, 리소스 목록, 보드, 피드 같은 쇼케이스 공통 UI입니다. |
| `Header.tsx` | 상단 헤더를 조립합니다. |
| `Layout.tsx` | 전체 앱 레이아웃과 `Outlet` 영역을 잡습니다. |
| `SearchModal.tsx` | 전역 검색 모달을 구성합니다. |
| `Sidebar.tsx` | 사이드바 내비게이션을 구성합니다. |

## `data/` 세부 구조

| 경로 | 설명 |
| --- | --- |
| `data/catalog/` | 컴포넌트, 앱, 라이브러리, 도구, MCP 항목을 섹션별로 나눠 관리합니다. |
| `data/component-showcases/` | 컴포넌트 쇼케이스 설정과 프리뷰 컴포넌트를 주제별로 나눕니다. |
| `data/showcase/` | 도구, 라이브러리, 폼 빌더, 앱 쇼케이스에 쓰는 페이지별 데이터를 둡니다. |
| `catalog.ts` | 기존 import 경로를 유지하는 카탈로그 데이터 진입점입니다. |
| `componentShowcases.tsx` | 컴포넌트 쇼케이스 데이터 진입점입니다. |
| `showcase.ts` | 쇼케이스 데이터 진입점입니다. |

## `features/` 세부 구조

| 경로 | 설명 |
| --- | --- |
| `features/calendars/` | 날짜 선택, 주간 일정, 일정 저장, 캘린더 프리뷰를 담당합니다. |
| `features/chrome-extensions/` | 확장 프로그램 템플릿, manifest, 파일 목록, 팝업 미리보기, ZIP 묶음을 다룹니다. |
| `features/cleaning-confirmation/` | 방문 일정, 현재 세션, 완료 메모, 확인 요약 내보내기를 다룹니다. |
| `features/custom-svg-library/` | SVG 아이콘 자산, 색상/크기 조정, 임시 저장, 내보내기 흐름을 관리합니다. |
| `features/feedback-app/` | 피드백 수집, 받은 의견 목록, 응답 작성, 내보내기를 담당합니다. |
| `features/form-builder/` | 폼 필드 구성, 캔버스, 설정, 코드와 스키마 내보내기를 다룹니다. |
| `features/full-apps/` | 완성형 앱 카탈로그의 검색, 저장, 표시 방식 전환을 관리합니다. |
| `features/home/` | 홈 화면의 검색, 빠른 이동, 프로젝트 맵, 작업 원칙 섹션을 구성합니다. |
| `features/logo-generator/` | 로고 옵션, 미리보기, 저장된 로고, SVG 자산 출력을 담당합니다. |
| `features/mcp/` | MCP 플랫폼 선택, import URL, manifest 미리보기, 기록 저장, 패키지 내보내기를 다룹니다. |
| `features/power-ts-toolkit/` | 코드 정리, 변환, Power Fx 처리, 결과 기록과 내보내기를 담당합니다. |
| `features/project-management/` | 프로젝트 선택, 작업 큐, 워크스페이스 상태, 로컬 저장을 관리합니다. |
| `features/svg-editor/` | SVG 캔버스, 도형, 레이어, 속성, 선택 영역, 내보내기를 담당합니다. |
| `features/yaml-library/` | YAML 템플릿, 업로드 파일, 변환, 내보내기, 상태 메시지를 관리합니다. |

## `pages/` 세부 구조

| 경로 | 설명 |
| --- | --- |
| `pages/HomePage.tsx` | 홈 화면 라우트입니다. |
| `pages/ComponentsPage.tsx` | 컴포넌트 카탈로그 랜딩 라우트입니다. |
| `pages/FullAppsPage.tsx` | 완성형 앱 카탈로그 랜딩 라우트입니다. |
| `pages/LibrariesPage.tsx` | 라이브러리 카탈로그 랜딩 라우트입니다. |
| `pages/ToolsPage.tsx` | 도구 카탈로그 랜딩 라우트입니다. |
| `pages/McpPage.tsx` | MCP 소개와 import 흐름 라우트입니다. |
| `pages/components/` | 개별 컴포넌트 쇼케이스 라우트입니다. |
| `pages/fullapps/` | 앱형 화면 라우트입니다. |
| `pages/libraries/` | 라이브러리 화면 라우트입니다. |
| `pages/tools/` | 도구 화면 라우트입니다. |

## 작업 기준

- 새 페이지를 추가할 때는 먼저 `src/app/config/navigationSections.tsx`에 라우트 메타데이터를 등록합니다.
- URL에 직접 연결되는 파일은 `pages/`에 두고, 화면 내부 로직은 `features/<domain>/`으로 분리합니다.
- 여러 화면에서 반복되는 UI는 `components/common`, `components/catalog`, `components/showcase` 중 성격에 맞는 위치에 둡니다.
- 화면 문구는 공통 문구라면 `i18n.ts`, 기능 전용 문구라면 각 feature의 `copy.ts`에서 관리합니다.
- 로컬 저장소 key는 `web5:*` 형태로 버전을 붙여 관리합니다.
- 작업 단위가 끝나면 `npm run typecheck`와 `npm run build`로 기본 상태를 확인합니다.
