import { Card } from "../../components/common";
import { CanvasStatGrid } from "../../components/showcase/CanvasStatGrid";
import { useLanguage } from "../../context/LanguageContext";
import type { CanvasStatItem } from "../../types/showcase";
import { SVG_CANVAS_HEIGHT, SVG_CANVAS_WIDTH } from "./constants";
import { CanvasToolbar } from "./CanvasToolbar";
import { CenteredGridLayer } from "./CenteredGridLayer";
import { getSvgShapeDisplayName, svgEditorCopy } from "./copy";
import { SelectionOverlay } from "./SelectionOverlay";
import { ShapeElement } from "./ShapeElement";
import { useCanvasPointerController } from "./useCanvasPointerController";
import type { SvgPoint, SvgShape } from "./types";

type CanvasPreviewProps = {
  activeTool: string;
  onBeginShapeTransform: (id: number) => void;
  onCreateFreehandPath: (points: SvgPoint[]) => void;
  onDragLockedShape: (id: number) => void;
  onFinishShapeDrag: (id: number) => void;
  onFinishShapeResize: (id: number) => void;
  onMoveShape: (id: number, position: Pick<SvgShape, "x" | "y">) => void;
  onResizeShape: (id: number, geometry: Pick<SvgShape, "x" | "y" | "width" | "height">) => void;
  onSelectShape: (id: number) => void;
  onToggleGrid: () => void;
  onToggleGuides: () => void;
  selectedShapeId: number | null;
  shapes: SvgShape[];
  showGrid: boolean;
  showGuides: boolean;
};

export function CanvasPreview({
  activeTool,
  onBeginShapeTransform,
  onCreateFreehandPath,
  onDragLockedShape,
  onFinishShapeDrag,
  onFinishShapeResize,
  onMoveShape,
  onResizeShape,
  onSelectShape,
  onToggleGrid,
  onToggleGuides,
  selectedShapeId,
  shapes,
  showGrid,
  showGuides,
}: CanvasPreviewProps) {
  const { language } = useLanguage();
  const text = svgEditorCopy[language].canvas;
  const selectedShape = shapes.find((shape) => shape.id === selectedShapeId);
  const canvasPointer = useCanvasPointerController({
    activeTool,
    onBeginShapeTransform,
    onCreateFreehandPath,
    onDragLockedShape,
    onFinishShapeDrag,
    onFinishShapeResize,
    onMoveShape,
    onResizeShape,
    onSelectShape,
    shapes,
  });
  const stats: CanvasStatItem[] = [
    { label: text.stats.position, value: selectedShape ? `X: ${selectedShape.x}, Y: ${selectedShape.y}` : "X: 0, Y: 0" },
    { label: text.stats.size, value: selectedShape ? `W: ${selectedShape.width}, H: ${selectedShape.height}` : "W: 0, H: 0" },
    { label: text.stats.selected, value: selectedShape ? getSvgShapeDisplayName(language, selectedShape.name) : text.stats.none },
    { label: text.stats.zoom, value: "100%" },
  ];

  return (
    <Card>
      <CanvasToolbar
        onToggleGrid={onToggleGrid}
        onToggleGuides={onToggleGuides}
        showGrid={showGrid}
        showGuides={showGuides}
        text={text}
      />

      <div className="p-8">
        <div className="flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-900">
          <svg
            ref={canvasPointer.svgRef}
            className="h-full w-full"
            width={SVG_CANVAS_WIDTH}
            height={SVG_CANVAS_HEIGHT}
            viewBox={`0 0 ${SVG_CANVAS_WIDTH} ${SVG_CANVAS_HEIGHT}`}
            onPointerDown={canvasPointer.handleStartFreehandPath}
            onPointerMove={canvasPointer.handleDragMove}
            onPointerUp={canvasPointer.handleFinishDrag}
            onPointerCancel={canvasPointer.handleFinishDrag}
            style={{ cursor: activeTool === "pen" ? "crosshair" : undefined, touchAction: "none" }}
          >
            {showGrid ? <CenteredGridLayer /> : <rect width={SVG_CANVAS_WIDTH} height={SVG_CANVAS_HEIGHT} fill="#ffffff" />}
            {showGuides ? (
              <g stroke="#94a3b8" strokeDasharray="4 4" strokeWidth="1">
                <line x1={SVG_CANVAS_WIDTH / 2} y1="0" x2={SVG_CANVAS_WIDTH / 2} y2={SVG_CANVAS_HEIGHT} />
                <line x1="0" y1={SVG_CANVAS_HEIGHT / 2} x2={SVG_CANVAS_WIDTH} y2={SVG_CANVAS_HEIGHT / 2} />
              </g>
            ) : null}
            {shapes.filter((shape) => shape.visible).map((shape) => (
              <ShapeElement
                key={shape.id}
                canDrag={activeTool === "select" && !shape.locked}
                dragging={canvasPointer.dragState?.mode !== "draw" && canvasPointer.dragState?.shapeId === shape.id}
                shape={shape}
                selected={selectedShapeId === shape.id}
                onSelect={onSelectShape}
                onStartDrag={canvasPointer.handleStartDrag}
              />
            ))}
            {selectedShape && activeTool === "select" ? (
              <SelectionOverlay
                canResize={!selectedShape.locked}
                shape={selectedShape}
                text={text}
                onStartResize={canvasPointer.handleStartResize}
              />
            ) : null}
            {canvasPointer.dragPathData ? (
              <path
                d={canvasPointer.dragPathData}
                fill="none"
                opacity="0.85"
                pointerEvents="none"
                stroke="#111827"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
              />
            ) : null}
          </svg>
        </div>
      </div>

      <footer className="border-t border-gray-200 p-4 dark:border-gray-700">
        <CanvasStatGrid items={stats} />
      </footer>
    </Card>
  );
}
