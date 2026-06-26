# SVG Editor Feature

SVG 도형을 캔버스에서 만들고 조정한 뒤 마크업이나 파일로 내보내는 편집 기능입니다.

## 파일 역할

| 파일 | 역할 |
| --- | --- |
| `useSvgEditorController.ts` | 도형 목록, 선택 상태, 도구 선택, 속성 변경, 내보내기 흐름을 관리합니다. |
| `useCanvasPointerController.ts` | 캔버스 포인터 이벤트와 드래그 동작을 관리합니다. |
| `CanvasPreview.tsx` | SVG 캔버스와 도형 렌더링을 담당합니다. |
| `CanvasToolbar.tsx` | 캔버스 확대, 정렬, 보기 관련 액션을 제공합니다. |
| `SvgToolPalette.tsx` | 도형 추가와 편집 도구 선택 UI입니다. |
| `LayersPanel.tsx` | 도형 레이어 목록과 선택 흐름을 보여줍니다. |
| `PropertiesPanel.tsx` | 선택한 도형의 속성을 편집합니다. |
| `ExportSettings.tsx` | 내보내기 옵션을 설정합니다. |
| `ActionsPanel.tsx` | 초기화, 복사, 내보내기 같은 작업 버튼을 배치합니다. |
| `ShapeElement.tsx` | 개별 SVG 도형을 렌더링합니다. |
| `SelectionOverlay.tsx` | 선택된 도형의 조작 영역을 표시합니다. |
| `CenteredGridLayer.tsx` | 캔버스 기준선과 그리드 표시를 담당합니다. |
| `canvasGeometry.ts` | 캔버스 좌표와 크기 계산 helper입니다. |
| `pathGeometry.ts` | path 도형 계산 helper입니다. |
| `shapeListUtils.ts` | 도형 목록 추가, 삭제, 정렬 helper입니다. |
| `shapeTransformUtils.ts` | 도형 이동, 크기 변경, 회전 계산 helper입니다. |
| `svgMarkup.ts` | 현재 도형 상태를 SVG 마크업으로 변환합니다. |
| `exportAsset.ts` | SVG 결과를 내보내기용 자산으로 만듭니다. |
| `SvgStatusCard.tsx` | 현재 편집 상태 요약을 표시합니다. |
| `copy.ts` | 화면 문구를 관리합니다. |
| `data.ts` | 기본 도형, 색상, 도구 데이터를 둡니다. |
| `types.ts` | SVG 편집기 전용 타입입니다. |

## 작업 기준

- 새 도형을 추가할 때는 `types.ts`, `data.ts`, `ShapeElement.tsx`, `svgMarkup.ts`, 변환 helper를 함께 확인합니다.
- 좌표 계산은 컴포넌트 안에 직접 넣지 않고 geometry helper로 분리합니다.
- 포인터 이벤트는 `useCanvasPointerController.ts`에 모아 캔버스 렌더링과 분리합니다.
- 내보내기 결과가 바뀌면 `svgMarkup.ts`와 `exportAsset.ts`를 같이 확인합니다.
