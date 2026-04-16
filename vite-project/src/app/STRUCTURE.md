# App Structure Guide

## 목적
이 문서는 프로젝트의 폴더 구조와 네이밍 규칙을 빠르게 파악하기 위한 내부 가이드입니다.

## 원칙
1. 라우트 엔트리는 `pages/` 아래에 둡니다.
2. URL에 직접 매핑되는 파일은 `...Page.tsx` 형식을 사용합니다.
3. 여러 페이지에서 재사용되는 UI는 `components/common`, `components/catalog`, `components/showcase`에 둡니다.
4. 전역 UI 상태는 `context/`에 둡니다.
5. 실제 경로 조립은 `routes.tsx`, 경로 메타데이터는 `config/navigation.tsx`에서 관리합니다.

6. 반복되는 리스트형 페이지는 `data/` + `components/catalog/` + `hooks/` 조합으로 구성합니다.
7. 화면에 표시할 목록 데이터는 가능하면 페이지 파일 안에 하드코딩하지 않고 `data/`로 분리합니다.
8. 페이지 컴포넌트는 가능한 한 "데이터 주입 + 조립" 역할만 맡도록 유지합니다.


## Latest cleanup

- Removed the unused `components/ui` subtree that was no longer referenced by the routed application.
- Kept `components/common`, `components/catalog`, and `components/showcase` as the active shared UI layers.
- Pruned orphaned helper components left over from earlier generator output.


- `config/navigation.tsx`: central route metadata used by the router, header, sidebar, and search modal
- `types/navigation.ts`: shared types for navigation and searchable route items


## Data layout

- `data/catalog/`: top-level catalog metadata split by domain (`components`, `tools`, `libraries`, `full-apps`, `mcp`)
- `data/showcase/`: page-level demo data split by domain (`form-builder`, `tools`, `libraries`, `full-apps`)
- `data/component-showcases/`: component demo presets split into smaller themed modules with a shared barrel export

- `src/app/pages/HomePage.tsx`: 홈 랜딩 페이지와 인라인 검색, 빠른 이동 카드 구성
