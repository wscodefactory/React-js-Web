# MCP Feature

MCP 패키지 구성, import URL, 플랫폼 선택, manifest 미리보기, 가져오기 기록을 한 화면에서 다루는 기능입니다.

## 파일 역할

| 파일 | 역할 |
| --- | --- |
| `useMcpImportController.ts` | 선택된 플랫폼, import URL, 기록, 내보내기 상태를 관리합니다. |
| `McpImportHero.tsx` | URL 입력과 주요 import 액션을 보여주는 상단 영역입니다. |
| `PlatformSelector.tsx` | 대상 플랫폼 선택 UI입니다. |
| `ManifestPreviewPanel.tsx` | 현재 구성의 manifest 미리보기를 보여줍니다. |
| `ImportHistoryPanel.tsx` | 이전 import 기록을 표시하고 다시 선택할 수 있게 합니다. |
| `McpExplainerCard.tsx` | MCP 흐름을 설명하는 카드입니다. |
| `McpFeatureGrid.tsx` | 기능 카드 목록을 구성합니다. |
| `importUrl.ts` | URL 파싱과 정리 helper를 둡니다. |
| `importHistoryStorage.ts` | import 기록을 localStorage에 저장합니다. |
| `packageExport.ts` | 패키지 관련 내보내기 데이터를 만듭니다. |
| `copy.ts` | 화면 문구를 관리합니다. |
| `data.ts` | 플랫폼, 기능 카드, 기본 manifest 데이터를 둡니다. |
| `types.ts` | MCP 기능 전용 타입입니다. |

## 작업 기준

- 플랫폼을 추가할 때는 `data.ts`, `types.ts`, `PlatformSelector.tsx`, manifest 미리보기를 함께 확인합니다.
- URL 규칙을 바꾸면 `importUrl.ts`와 controller의 상태 처리 흐름을 같이 점검합니다.
- 기록 저장 구조를 바꾸면 `importHistoryStorage.ts`의 기본값과 버전 처리를 확인합니다.
- 화면 문구는 `copy.ts`에 두고, 라우트 이름이나 검색 문구는 `i18n.ts`와 함께 맞춥니다.
