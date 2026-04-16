# PowerLibs Component Library

React + TypeScript + Vite 기반의 컴포넌트 쇼케이스 프로젝트입니다.  
구조를 정리하면서 자동 생성물 느낌이 강한 네이밍과 중복 흔적을 줄이고, 라우트/페이지/공통 컴포넌트 역할이 더 잘 드러나도록 다듬었습니다.

## 핵심 정리 내용
- `...Page` 접미사로 라우트 페이지 네이밍 통일
- Figma 전용 흔적 및 중복 파일 제거
- 레이아웃, 라우트, 컨텍스트, 탐색 컴포넌트에 JSDoc 스타일 주석 추가
- 공통 UI와 페이지 레벨 코드를 분리해 읽기 쉬운 구조 유지

## 폴더 구조
```bash
src/
  app/
    components/
      common/              # 프로젝트 공용 프리미티브와 래퍼
      ui/                  # shadcn/Radix 기반 UI 컴포넌트
      Header.tsx
      Layout.tsx
      SearchModal.tsx
      Sidebar.tsx
    context/               # 전역 UI 상태 (다크 모드, 사이드바)
    pages/
      components/          # 컴포넌트 쇼케이스 상세 페이지
      fullapps/            # 완성형 앱 예시 페이지
      libraries/           # 라이브러리 소개 페이지
      tools/               # 도구형 페이지
      ComponentsPage.tsx
      FullAppsPage.tsx
      LibrariesPage.tsx
      McpPage.tsx
      ToolsPage.tsx
    routes.tsx             # 전체 라우팅 정의
  styles/                  # 전역 스타일, 테마, Tailwind 엔트리
```

## 네이밍 규칙
- **라우트 페이지**: `PascalCase + Page`
  - 예: `FeedbackAppPage.tsx`, `SvgEditorPage.tsx`
- **공용 컴포넌트**: UI 역할이 드러나는 명사형
  - 예: `SearchModal`, `Header`, `Sidebar`
- **컨텍스트 파일**: 상태 도메인 기준
  - 예: `DarkModeContext`, `SidebarContext`

## 실행 방법
```bash
npm install
npm run dev
npm run build
npm run preview
```

## 다음에 더 손볼 만한 부분
- 페이지별 데이터를 `config/` 또는 `data/` 폴더로 분리
- 검색 대상 목록을 중앙 설정 파일로 통합
- 공용 타입을 `types/` 폴더로 분리해 재사용성 강화
- 스타일 클래스가 긴 컴포넌트는 섹션 단위로 더 쪼개기


## Dependency and build notes

This project has been cleaned so that the package manifest matches the imports that are actually used in `src/`.

### Verified cleanup
- Removed unused dependencies that were not imported anywhere in the app
- Added `typescript` to `devDependencies` for local type-checking
- Enabled the official Tailwind CSS Vite plugin in `vite.config.ts`
- Added `@` → `src` alias in Vite so the TypeScript path alias is matched at build time
- Added a `typecheck` script

### Recommended local setup
```bash
npm install
npm run typecheck
npm run dev
```


## Recent Refactor Notes
- Split catalog data into `src/app/data/catalog/` so components, tools, libraries, full apps, and MCP metadata are maintained separately.
- Split page showcase data into `src/app/data/showcase/` so tools, libraries, forms, and full-app demos are organized by domain.
- Split component showcase presets into `src/app/data/component-showcases/` with a small compatibility barrel for existing imports.
- Kept shared types in `src/app/types/` and shared search logic in `src/app/hooks/useCatalogSearch.ts`.
- Kept shared rendering layers in `src/app/components/catalog/` and `src/app/components/showcase/`.

## Cleanup in the latest pass

- Removed the unused `src/app/components/ui/` legacy shadcn-style directory.
- Removed orphaned `ComponentSearchBar.tsx` and `ImageWithFallback.tsx`.
- Pruned `package.json` to only the dependencies used by the current application shell and pages.

## Route configuration

The router, header navigation, sidebar links, and command palette now share one metadata source: `src/app/config/navigation.tsx`.
When adding or renaming a page, update that file first so path definitions stay synchronized across the app.


## Recent update

- Added a dedicated `HomePage` at `/` and moved the component catalog landing back to `/components`.
- Synced the header active-state logic with nested routes.
