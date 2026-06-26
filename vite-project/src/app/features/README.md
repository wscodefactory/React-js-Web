# Features Folder Guide

`features`는 실제 사용자 기능을 도메인별로 묶는 폴더입니다. 라우트 페이지는 얇게 유지하고, 상태 계산, 패널 조립, 저장, 내보내기 로직은 이곳에서 관리합니다.

## 기능 폴더

| 경로 | 역할 |
| --- | --- |
| `calendars/` | 날짜 선택, 일정 보드, 일정 저장, 캘린더 프리뷰를 관리합니다. |
| `chrome-extensions/` | 크롬 확장 템플릿, manifest, 파일 목록, 팝업 미리보기, ZIP 묶음을 다룹니다. |
| `cleaning-confirmation/` | 방문 일정, 현재 세션, 완료 메모, 확인 요약 내보내기를 관리합니다. |
| `custom-svg-library/` | SVG 아이콘 자산, 색상/크기 조정, 임시 저장, 내보내기 흐름을 관리합니다. |
| `feedback-app/` | 피드백 수집, 받은 의견 목록, 응답 작성, 내보내기를 담당합니다. |
| `form-builder/` | 폼 필드 구성, 캔버스, 설정, 코드와 스키마 내보내기를 다룹니다. |
| `full-apps/` | 완성형 앱 카탈로그의 검색, 저장, 표시 방식 전환을 관리합니다. |
| `home/` | 홈 화면 검색, 빠른 이동, 프로젝트 맵, 작업 원칙 섹션을 구성합니다. |
| `logo-generator/` | 로고 옵션, 미리보기, 저장된 로고, SVG 자산 출력을 담당합니다. |
| `mcp/` | MCP 플랫폼 선택, import URL, manifest 미리보기, 기록 저장, 패키지 내보내기를 다룹니다. |
| `power-ts-toolkit/` | 코드 정리, 변환, Power Fx 처리, 결과 기록과 내보내기를 담당합니다. |
| `project-management/` | 프로젝트 선택, 작업 큐, 워크스페이스 상태, 로컬 저장을 관리합니다. |
| `svg-editor/` | SVG 캔버스, 도형, 레이어, 속성, 선택 영역, 내보내기를 담당합니다. |
| `yaml-library/` | YAML 템플릿, 업로드 파일, 변환, 내보내기, 상태 메시지를 관리합니다. |

## 파일 이름 기준

| 패턴 | 용도 |
| --- | --- |
| `index.ts` | 외부에서 가져갈 공개 API를 모읍니다. |
| `types.ts` | 해당 feature 안에서 쓰는 타입을 정의합니다. |
| `copy.ts` | 해당 feature 전용 화면 문구를 관리합니다. |
| `data.ts` | 기본 목록, 샘플, 옵션 데이터를 둡니다. |
| `use*Controller.ts` | 화면 상태와 이벤트 핸들러를 묶는 hook입니다. |
| `*Storage.ts` | localStorage 저장과 복원 로직을 담당합니다. |
| `*Export.ts`, `export*.ts` | 파일, 코드, 요약 데이터 내보내기를 담당합니다. |

## 작업 기준

- route page는 feature를 불러와 조립하는 역할에 가깝게 유지합니다.
- 상태 계산과 이벤트 흐름은 controller hook으로 모읍니다.
- feature 밖에서도 재사용될 타입만 `src/app/types`로 올립니다.
- 다른 feature에 직접 의존하기보다 공통 UI, 공통 util, 공통 type을 통해 연결합니다.
- 브라우저 저장소 key는 feature 내부에서 한 곳에 모아 관리합니다.
