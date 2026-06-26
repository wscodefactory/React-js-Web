# Form Builder Feature

폼 필드를 조합하고, 미리보기 캔버스에서 확인한 뒤 코드나 스키마로 내보내는 도구입니다.

## 파일 역할

| 파일 | 역할 |
| --- | --- |
| `useFormBuilderController.ts` | 폼 상태, 필드 추가/수정/삭제, 선택 상태, 내보내기 흐름을 묶습니다. |
| `FormCanvasPanel.tsx` | 현재 폼 구성을 캔버스 형태로 보여줍니다. |
| `CanvasFieldCard.tsx` | 캔버스 안의 개별 필드 카드를 렌더링합니다. |
| `FieldTypePanel.tsx` | 추가할 필드 타입 목록을 제공합니다. |
| `FormSettingsPanel.tsx` | 폼 제목과 설명 같은 전체 설정을 다룹니다. |
| `ExportCodePanel.tsx` | 생성된 코드나 스키마 결과를 보여줍니다. |
| `BuilderActions.tsx` | 초기화, 복사, 내보내기 같은 주요 액션을 배치합니다. |
| `FieldInput.tsx` | 필드 설정에 쓰는 입력 UI입니다. |
| `fieldUtils.ts` | 필드 생성과 정리 helper를 둡니다. |
| `exportCode.ts` | 폼 구성을 코드 문자열로 변환합니다. |
| `schemaExport.ts` | 폼 구성을 스키마 형태로 변환합니다. |
| `draftStorage.ts` | 작업 중인 폼 초안을 저장하고 복원합니다. |
| `copy.ts` | 화면 문구를 관리합니다. |
| `data.ts` | 기본 필드 타입과 샘플 데이터를 둡니다. |
| `types.ts` | 폼 빌더 전용 타입입니다. |

## 작업 기준

- 새 필드 타입을 추가할 때는 `types.ts`, `data.ts`, `fieldUtils.ts`, 렌더링 로직을 함께 확인합니다.
- 저장 구조를 바꾸면 `draftStorage.ts`의 버전과 복원 기본값을 함께 점검합니다.
- 내보내기 결과 형식은 `exportCode.ts`와 `schemaExport.ts`에서 분리해 관리합니다.
- UI 패널은 controller에서 받은 상태와 handler를 사용하고, 직접 저장소를 만지지 않습니다.
