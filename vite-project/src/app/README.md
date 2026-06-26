# App Folder Guide

`src/app`은 화면 라우팅, 전역 상태, 페이지, 기능 모듈, 정적 데이터, 공통 유틸을 모아두는 앱의 중심 폴더입니다.

## 실행 흐름

1. `src/main.tsx`에서 `App.tsx`를 렌더링합니다.
2. `App.tsx`에서 언어, 다크 모드, 사이드바 Provider를 연결합니다.
3. `routes.tsx`가 `config/navigationSections.tsx`의 메타데이터를 React Router 경로로 변환합니다.
4. `Layout.tsx`가 헤더, 사이드바, 검색 모달, 페이지 영역을 조립합니다.
5. 각 route page는 필요한 feature, data, shared component를 가져와 화면을 구성합니다.

## 폴더 역할

| 경로 | 역할 |
| --- | --- |
| `components/` | 여러 화면에서 함께 쓰는 레이아웃, 검색, 카탈로그, 쇼케이스 UI입니다. |
| `config/` | 라우트, 헤더, 사이드바, 검색이 공유하는 내비게이션 메타데이터입니다. |
| `context/` | 언어, 다크 모드, 사이드바 같은 전역 UI 상태를 관리합니다. |
| `data/` | 카탈로그와 쇼케이스 화면에 들어가는 정적 데이터를 관리합니다. |
| `features/` | 실제 사용자 기능을 도메인별로 묶어둔 폴더입니다. |
| `hooks/` | 여러 화면에서 재사용하는 React hook을 둡니다. |
| `pages/` | URL에 직접 연결되는 route component를 둡니다. |
| `types/` | 여러 폴더에서 공유하는 TypeScript 타입을 둡니다. |
| `utils/` | 저장소, 검색, 클립보드, 파일 묶음 처리 같은 공통 함수를 둡니다. |

## 파일 역할

| 파일 | 역할 |
| --- | --- |
| `App.tsx` | 전역 Provider와 Router를 연결하는 루트 컴포넌트입니다. |
| `routes.tsx` | 중앙 라우트 메타데이터를 실제 라우터 설정으로 변환합니다. |
| `i18n.ts` | 공통 문구와 라우트 문구의 언어별 값을 제공합니다. |
| `STRUCTURE.md` | 앱 구조 메모와 정리 기준을 기록한 보조 문서입니다. |

## 작업 기준

- 새 화면을 추가할 때는 `config/navigationSections.tsx`에 먼저 라우트 정보를 등록합니다.
- URL에 직접 연결되는 얇은 컴포넌트는 `pages/`에 둡니다.
- 화면 내부 상태, 저장, 내보내기, 세부 패널은 `features/<domain>/`에 둡니다.
- 여러 화면에서 반복되는 UI는 `components/`로 올립니다.
- 공통 문구는 `i18n.ts`, 기능 전용 문구는 feature 내부 `copy.ts`에 둡니다.
