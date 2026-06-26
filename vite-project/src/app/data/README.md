# Data Folder Guide

`data`는 화면에 표시할 정적 목록, 카탈로그 항목, 쇼케이스 설정을 관리합니다. 라우트 컴포넌트가 길어지지 않도록 반복 데이터는 이 폴더로 분리합니다.

## 폴더 역할

| 경로 | 역할 |
| --- | --- |
| `catalog/` | Components, Full Apps, Libraries, Tools, MCP 섹션의 카탈로그 항목을 나눠 관리합니다. |
| `component-showcases/` | 컴포넌트 쇼케이스 설정과 프리뷰 컴포넌트를 주제별로 나눕니다. |
| `showcase/` | 도구, 라이브러리, 폼 빌더, 앱 화면에서 쓰는 쇼케이스 데이터를 둡니다. |

## 루트 파일

| 파일 | 역할 |
| --- | --- |
| `catalog.ts` | 카탈로그 데이터의 기존 import 경로를 유지하는 진입점입니다. |
| `componentShowcases.tsx` | 컴포넌트 쇼케이스 데이터 진입점입니다. |
| `showcase.ts` | 쇼케이스 데이터 진입점입니다. |

## 작업 기준

- 새 카탈로그 항목은 먼저 `config/navigationSections.tsx`의 라우트와 맞는지 확인합니다.
- 섹션별 데이터는 `catalog/<section>.ts`에 추가합니다.
- 프리뷰 렌더링이 필요한 컴포넌트 쇼케이스는 `component-showcases/`에 둡니다.
- 단순 문구와 목록 데이터는 page 파일에 직접 늘어놓지 않고 이 폴더로 분리합니다.
- 여러 파일에서 쓰는 데이터 타입은 `types/`에 둡니다.
