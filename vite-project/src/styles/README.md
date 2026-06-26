# Styles Folder Guide

`src/styles`는 앱 전역 CSS와 테마 파일을 관리합니다. 컴포넌트별 세부 스타일보다 앱 전체에 적용되는 기반 스타일을 둡니다.

## 파일 역할

| 파일 | 역할 |
| --- | --- |
| `index.css` | 앱에서 import하는 스타일 진입점입니다. |
| `tailwind.css` | Tailwind CSS 엔트리와 유틸리티 연결을 담당합니다. |
| `theme.css` | 색상, 배경, 그림자, 다크 모드 같은 테마 변수를 관리합니다. |
| `fonts.css` | 폰트 face와 기본 글꼴 관련 설정을 관리합니다. |
| `components.css` | 여러 컴포넌트에서 공유하는 전역 class 스타일을 둡니다. |

## 작업 기준

- 특정 컴포넌트에만 필요한 스타일은 가능하면 해당 컴포넌트의 class 조합으로 해결합니다.
- 여러 화면에서 반복되는 전역 class만 `components.css`에 둡니다.
- 색상과 테마 값은 `theme.css`의 변수 기준으로 맞춥니다.
- 새 스타일 파일을 만들면 `index.css`에서 import 흐름을 확인합니다.
- 페이지 단위로 과하게 큰 CSS를 만들기보다 공통 패턴과 컴포넌트 구조를 먼저 정리합니다.
