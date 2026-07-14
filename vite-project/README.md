# Vite Project Guide

Solucioneomos 앱의 실제 React + TypeScript + Vite 프로젝트입니다.

## 시작하기

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
- `build`: 배포 가능한 정적 파일을 `dist/`에 생성합니다.
- `preview`: 빌드 결과를 로컬 서버에서 확인합니다.
- `docs`: TypeDoc 문서를 `docs/`에 생성합니다.

## 주요 폴더

| 경로 | 역할 |
| --- | --- |
| `src/main.tsx` | React 앱 진입점 |
| `src/styles/` | 전역 스타일, Tailwind, 테마 |
| `src/app/App.tsx` | 전역 Provider와 Router 연결 |
| `src/app/routes.tsx` | React Router 설정 |
| `src/app/components/` | 공통 레이아웃과 UI 컴포넌트 |
| `src/app/features/` | Form Builder, SVG Editor 등 기능 모듈 |
| `src/app/pages/` | URL에 연결되는 페이지 컴포넌트 |
| `src/app/utils/` | 저장소, 검색, 클립보드, 백업 유틸 |

## 업데이트 메모

- SVG Editor는 실행 취소/다시 실행, SVG 가져오기/내보내기, 선택 도형 정렬을 지원합니다.
- Form Builder는 필드별 placeholder/helper/min length 설정과 HTML/Zod export를 지원합니다.
- Header의 액션 메뉴에서 `Ctrl+K` 검색, workspace 백업/복원을 사용할 수 있습니다.
- Theme Builder에서 색상, radius, spacing 토큰을 조정하고 CSS 변수로 내보낼 수 있습니다.
- Accessibility Checker에서 붙여 넣은 HTML의 라벨, alt, 버튼 이름, 링크, heading, contrast를 점검할 수 있습니다.
