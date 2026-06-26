# Vite Project Guide

이 폴더는 Solucioneomos 웹 워크스페이스의 실제 앱 코드가 들어 있는 React + TypeScript + Vite 프로젝트입니다.

## 실행

```bash
npm install
npm run dev
```

## 자주 쓰는 명령

```bash
npm run typecheck
npm run build
npm run preview
npm run docs
```

- `typecheck`: TypeScript 타입 검사를 실행합니다.
- `build`: 배포 가능한 정적 파일을 `dist/`에 만듭니다.
- `preview`: 빌드 결과를 로컬 서버로 확인합니다.
- `docs`: TypeDoc 문서를 `docs/`에 출력합니다.

## 최상위 폴더와 파일

| 경로 | 설명 |
| --- | --- |
| `src/` | 앱 소스 코드입니다. |
| `dist/` | 빌드 결과물입니다. |
| `docs/` | TypeDoc 출력 폴더입니다. |
| `guidelines/` | 화면 제작 기준을 적어두는 보조 문서 폴더입니다. |
| `node_modules/` | npm 의존성 설치 위치입니다. |
| `index.html` | Vite HTML 진입 파일입니다. |
| `package.json` | 스크립트와 의존성 정보를 관리합니다. |
| `package-lock.json` | npm 설치 버전을 고정합니다. |
| `postcss.config.mjs` | CSS 처리 설정입니다. |
| `tpyedoc.json` | TypeDoc 설정입니다. |
| `tsconfig.app.json` | 앱 코드 타입 검사 설정입니다. |
| `tsconfig.node.json` | Vite 설정처럼 Node 환경에서 도는 파일의 타입 검사 설정입니다. |
| `vite.config.ts` | React, Tailwind, alias, 개발 서버, 빌드 설정입니다. |

## `src/` 구조

| 경로 | 설명 |
| --- | --- |
| `src/main.tsx` | React 앱을 DOM에 렌더링합니다. |
| `src/vite-env.d.ts` | Vite 타입 선언입니다. |
| `src/styles/` | 전역 스타일, 테마, 폰트, Tailwind 엔트리를 관리합니다. |
| `src/app/` | 앱의 라우팅, 상태, 화면, 기능, 데이터, 유틸을 관리합니다. |

## `src/app/` 구조

| 경로 | 설명 |
| --- | --- |
| `App.tsx` | 전역 Provider와 Router를 연결합니다. |
| `routes.tsx` | 라우트 메타데이터를 React Router 설정으로 바꿉니다. |
| `i18n.ts` | 공통 문구와 라우트 문구의 언어별 값을 제공합니다. |
| `STRUCTURE.md` | 앱 내부 구조 메모입니다. |
| `components/` | 여러 화면에서 쓰는 공용 UI입니다. |
| `config/` | 라우트와 내비게이션 메타데이터입니다. |
| `context/` | 언어, 다크 모드, 사이드바 상태를 관리합니다. |
| `data/` | 카탈로그와 쇼케이스용 정적 데이터입니다. |
| `features/` | 도메인별 화면 기능입니다. |
| `hooks/` | 재사용 hook입니다. |
| `pages/` | URL에 매핑되는 페이지 컴포넌트입니다. |
| `types/` | 공통 TypeScript 타입입니다. |
| `utils/` | 저장소, 검색, 클립보드, 파일 묶음 처리 같은 공통 함수입니다. |

## 기능 폴더

| 경로 | 설명 |
| --- | --- |
| `features/calendars/` | 날짜 선택과 일정 확인 기능입니다. |
| `features/chrome-extensions/` | 크롬 확장 구성과 팝업 미리보기 기능입니다. |
| `features/cleaning-confirmation/` | 방문 청소 확인 흐름입니다. |
| `features/custom-svg-library/` | SVG 아이콘 라이브러리입니다. |
| `features/feedback-app/` | 피드백 수집과 응답 관리 앱입니다. |
| `features/form-builder/` | 폼 구성과 코드/스키마 출력 도구입니다. |
| `features/full-apps/` | 앱 카탈로그 목록과 필터링 기능입니다. |
| `features/home/` | 홈 화면과 빠른 이동 기능입니다. |
| `features/logo-generator/` | 로고 시안 작성과 저장 기능입니다. |
| `features/mcp/` | MCP 패키지 미리보기와 import 흐름입니다. |
| `features/power-ts-toolkit/` | 코드 정리와 변환 도구입니다. |
| `features/project-management/` | 프로젝트와 작업 큐 관리 화면입니다. |
| `features/svg-editor/` | SVG 캔버스 편집 도구입니다. |
| `features/yaml-library/` | YAML 템플릿 저장, 업로드, 변환 기능입니다. |

## 개발 규칙

- 라우트 추가와 이름 변경은 `src/app/config/navigationSections.tsx`에서 시작합니다.
- `pages/`는 라우트 연결을 담당하고, 복잡한 상태와 화면 조각은 `features/`에 둡니다.
- 여러 페이지에서 쓰는 UI는 `components/` 아래 목적에 맞게 분리합니다.
- 기능별 문구는 가능하면 해당 feature의 `copy.ts`에 둡니다.
- 공통 문구와 내비게이션 문구는 `i18n.ts`에서 관리합니다.
- 저장되는 브라우저 데이터는 `web5:*` key와 버전을 사용합니다.
