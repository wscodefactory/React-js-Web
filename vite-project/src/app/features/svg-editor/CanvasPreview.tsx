import { useRef, useState } from 'react';
import type { PointerEvent } from 'react';
import { Card } from '../../components/common';
import { CanvasStatGrid } from '../../components/showcase/CanvasStatGrid';
import type { CanvasStatItem } from '../../types/showcase';
import { SVG_CANVAS_HEIGHT, SVG_CANVAS_WIDTH, SVG_MIN_SHAPE_SIZE } from './constants';
import { buildPointPathData, clampCanvasPoint, getPointDistance } from './pathGeometry';
import { ShapeElement } from './ShapeElement';
import type { SvgPoint, SvgShape } from './types';

const GRID_SIZE = 40;
const GRID_MAJOR_INTERVAL = 5;
const GRID_ORIGIN = {
  x: SVG_CANVAS_WIDTH / 2,
  y: SVG_CANVAS_HEIGHT / 2,
};

type ResizeHandle = 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw';

type MoveDragState = {
  mode: 'move';
  offsetX: number;
  offsetY: number;
  pointerId: number;
  shapeId: number;
};

type ResizeDragState = {
  handle: ResizeHandle;
  initialShape: SvgShape;
  mode: 'resize';
  pointerId: number;
  shapeId: number;
};

type DrawDragState = {
  mode: 'draw';
  pointerId: number;
  points: SvgPoint[];
};

type DragState = DrawDragState | MoveDragState | ResizeDragState;

type CanvasPreviewProps = {
  activeTool: string;
  onBeginShapeTransform: (id: number) => void;
  onCreateFreehandPath: (points: SvgPoint[]) => void;
  onDragLockedShape: (id: number) => void;
  onFinishShapeDrag: (id: number) => void;
  onFinishShapeResize: (id: number) => void;
  onMoveShape: (id: number, position: Pick<SvgShape, 'x' | 'y'>) => void;
  onResizeShape: (id: number, geometry: Pick<SvgShape, 'x' | 'y' | 'width' | 'height'>) => void;
  onSelectShape: (id: number) => void;
  onToggleGrid: () => void;
  onToggleGuides: () => void;
  selectedShapeId: number | null;
  shapes: SvgShape[];
  showGrid: boolean;
  showGuides: boolean;
};

function getCenteredGridPositions(max: number, origin: number, step: number) {
  const positions = new Set<number>([origin]);

  for (let offset = step; origin + offset <= max || origin - offset >= 0; offset += step) {
    if (origin + offset <= max) {
      positions.add(origin + offset);
    }

    if (origin - offset >= 0) {
      positions.add(origin - offset);
    }
  }

  return Array.from(positions).sort((a, b) => a - b);
}

function isMajorGridLine(position: number, origin: number) {
  return Math.abs((position - origin) / GRID_SIZE) % GRID_MAJOR_INTERVAL === 0;
}

function CenteredGridLayer() {
  const verticalLines = getCenteredGridPositions(SVG_CANVAS_WIDTH, GRID_ORIGIN.x, GRID_SIZE);
  const horizontalLines = getCenteredGridPositions(SVG_CANVAS_HEIGHT, GRID_ORIGIN.y, GRID_SIZE);

  return (
    <g pointerEvents="none">
      <rect width={SVG_CANVAS_WIDTH} height={SVG_CANVAS_HEIGHT} fill="#ffffff" />
      <g stroke="#e5e7eb" strokeWidth="1">
        {verticalLines.filter((x) => x !== GRID_ORIGIN.x && !isMajorGridLine(x, GRID_ORIGIN.x)).map((x) => (
          <line key={`grid-v-${x}`} x1={x} y1="0" x2={x} y2={SVG_CANVAS_HEIGHT} />
        ))}
        {horizontalLines.filter((y) => y !== GRID_ORIGIN.y && !isMajorGridLine(y, GRID_ORIGIN.y)).map((y) => (
          <line key={`grid-h-${y}`} x1="0" y1={y} x2={SVG_CANVAS_WIDTH} y2={y} />
        ))}
      </g>
      <g stroke="#d1d5db" strokeWidth="1.5">
        {verticalLines.filter((x) => x !== GRID_ORIGIN.x && isMajorGridLine(x, GRID_ORIGIN.x)).map((x) => (
          <line key={`grid-major-v-${x}`} x1={x} y1="0" x2={x} y2={SVG_CANVAS_HEIGHT} />
        ))}
        {horizontalLines.filter((y) => y !== GRID_ORIGIN.y && isMajorGridLine(y, GRID_ORIGIN.y)).map((y) => (
          <line key={`grid-major-h-${y}`} x1="0" y1={y} x2={SVG_CANVAS_WIDTH} y2={y} />
        ))}
      </g>
      <g stroke="#10b981" strokeWidth="2">
        <line x1={GRID_ORIGIN.x} y1="0" x2={GRID_ORIGIN.x} y2={SVG_CANVAS_HEIGHT} />
        <line x1="0" y1={GRID_ORIGIN.y} x2={SVG_CANVAS_WIDTH} y2={GRID_ORIGIN.y} />
      </g>
      <circle cx={GRID_ORIGIN.x} cy={GRID_ORIGIN.y} r="5" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
      <text x={GRID_ORIGIN.x + 10} y={GRID_ORIGIN.y - 10} fill="#059669" fontSize="18" fontWeight="600">0,0</text>
    </g>
  );
}

function getResizeCursor(handle: ResizeHandle) {
  const cursorMap: Record<ResizeHandle, string> = {
    e: 'ew-resize',
    n: 'ns-resize',
    ne: 'nesw-resize',
    nw: 'nwse-resize',
    s: 'ns-resize',
    se: 'nwse-resize',
    sw: 'nesw-resize',
    w: 'ew-resize',
  };

  return cursorMap[handle];
}

function getResizeHandles(shape: SvgShape) {
  const centerX = shape.x + shape.width / 2;
  const centerY = shape.y + shape.height / 2;
  const right = shape.x + shape.width;
  const bottom = shape.y + shape.height;

  return [
    { handle: 'nw' as const, x: shape.x, y: shape.y },
    { handle: 'n' as const, x: centerX, y: shape.y },
    { handle: 'ne' as const, x: right, y: shape.y },
    { handle: 'e' as const, x: right, y: centerY },
    { handle: 'se' as const, x: right, y: bottom },
    { handle: 's' as const, x: centerX, y: bottom },
    { handle: 'sw' as const, x: shape.x, y: bottom },
    { handle: 'w' as const, x: shape.x, y: centerY },
  ];
}

function getResizedShapeGeometry(shape: SvgShape, handle: ResizeHandle, point: { x: number; y: number }) {
  const right = shape.x + shape.width;
  const bottom = shape.y + shape.height;
  let x = shape.x;
  let y = shape.y;
  let width = shape.width;
  let height = shape.height;

  if (handle.includes('e')) {
    width = Math.min(Math.max(point.x - shape.x, SVG_MIN_SHAPE_SIZE), SVG_CANVAS_WIDTH - shape.x);
  }

  if (handle.includes('s')) {
    height = Math.min(Math.max(point.y - shape.y, SVG_MIN_SHAPE_SIZE), SVG_CANVAS_HEIGHT - shape.y);
  }

  if (handle.includes('w')) {
    x = Math.min(Math.max(point.x, 0), right - SVG_MIN_SHAPE_SIZE);
    width = right - x;
  }

  if (handle.includes('n')) {
    y = Math.min(Math.max(point.y, 0), bottom - SVG_MIN_SHAPE_SIZE);
    height = bottom - y;
  }

  return {
    height: Math.round(height),
    width: Math.round(width),
    x: Math.round(x),
    y: Math.round(y),
  };
}

function shouldAppendDrawPoint(points: SvgPoint[], point: SvgPoint) {
  const previousPoint = points[points.length - 1];

  return !previousPoint || getPointDistance(previousPoint, point) >= 3;
}

type SelectionOverlayProps = {
  canResize: boolean;
  onStartResize: (shape: SvgShape, handle: ResizeHandle, event: PointerEvent<SVGRectElement>) => void;
  shape: SvgShape;
};

function SelectionOverlay({ canResize, onStartResize, shape }: SelectionOverlayProps) {
  const handleSize = 14;

  return (
    <g>
      <rect
        x={shape.x}
        y={shape.y}
        width={shape.width}
        height={shape.height}
        fill="none"
        stroke="#f59e0b"
        strokeDasharray="8 6"
        strokeWidth="2"
        pointerEvents="none"
      />
      {canResize && getResizeHandles(shape).map(({ handle, x, y }) => (
        <rect
          key={handle}
          aria-label={`Resize ${handle}`}
          data-resize-handle={handle}
          x={x - handleSize / 2}
          y={y - handleSize / 2}
          width={handleSize}
          height={handleSize}
          rx="3"
          fill="#ffffff"
          stroke="#f59e0b"
          strokeWidth="2"
          onPointerDown={(event) => onStartResize(shape, handle, event)}
          style={{ cursor: getResizeCursor(handle), touchAction: 'none' }}
        />
      ))}
    </g>
  );
}

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
  const svgRef = useRef<SVGSVGElement>(null);
  const [dragState, setDragState] = useState<DragState | null>(null);
  const selectedShape = shapes.find((shape) => shape.id === selectedShapeId);
  const stats: CanvasStatItem[] = [
    { label: 'Position', value: selectedShape ? `X: ${selectedShape.x}, Y: ${selectedShape.y}` : 'X: 0, Y: 0' },
    { label: 'Size', value: selectedShape ? `W: ${selectedShape.width}, H: ${selectedShape.height}` : 'W: 0, H: 0' },
    { label: 'Selected', value: selectedShape?.name ?? 'None' },
    { label: 'Zoom', value: '100%' },
  ];

  const getCanvasPoint = (event: PointerEvent<SVGElement>) => {
    const svg = svgRef.current;

    if (!svg) {
      return { x: 0, y: 0 };
    }

    const rect = svg.getBoundingClientRect();

    return clampCanvasPoint({
      x: ((event.clientX - rect.left) / rect.width) * SVG_CANVAS_WIDTH,
      y: ((event.clientY - rect.top) / rect.height) * SVG_CANVAS_HEIGHT,
    });
  };

  const clampShapePosition = (shape: SvgShape, x: number, y: number) => ({
    x: Math.round(Math.min(Math.max(x, 0), Math.max(0, SVG_CANVAS_WIDTH - shape.width))),
    y: Math.round(Math.min(Math.max(y, 0), Math.max(0, SVG_CANVAS_HEIGHT - shape.height))),
  });

  const handleStartDrag = (shape: SvgShape, event: PointerEvent<SVGElement>) => {
    if (activeTool === 'pen') {
      return;
    }

    onSelectShape(shape.id);

    if (activeTool !== 'select') {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    if (shape.locked) {
      onDragLockedShape(shape.id);
      return;
    }

    const point = getCanvasPoint(event);
    onBeginShapeTransform(shape.id);
    svgRef.current?.setPointerCapture(event.pointerId);
    setDragState({
      mode: 'move',
      offsetX: point.x - shape.x,
      offsetY: point.y - shape.y,
      pointerId: event.pointerId,
      shapeId: shape.id,
    });
  };

  const handleStartResize = (shape: SvgShape, handle: ResizeHandle, event: PointerEvent<SVGRectElement>) => {
    onSelectShape(shape.id);

    if (activeTool !== 'select') {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    if (shape.locked) {
      onDragLockedShape(shape.id);
      return;
    }

    svgRef.current?.setPointerCapture(event.pointerId);
    onBeginShapeTransform(shape.id);
    setDragState({
      handle,
      initialShape: shape,
      mode: 'resize',
      pointerId: event.pointerId,
      shapeId: shape.id,
    });
  };

  const handleDragMove = (event: PointerEvent<SVGSVGElement>) => {
    if (!dragState) {
      return;
    }

    event.preventDefault();
    const point = getCanvasPoint(event);

    if (dragState.mode === 'draw') {
      setDragState((current) => {
        if (!current || current.mode !== 'draw' || !shouldAppendDrawPoint(current.points, point)) {
          return current;
        }

        return { ...current, points: [...current.points, point] };
      });
      return;
    }

    const shape = shapes.find((item) => item.id === dragState.shapeId);

    if (!shape || shape.locked) {
      setDragState(null);
      return;
    }

    if (dragState.mode === 'resize') {
      onResizeShape(shape.id, getResizedShapeGeometry(dragState.initialShape, dragState.handle, point));
      return;
    }

    onMoveShape(shape.id, clampShapePosition(shape, point.x - dragState.offsetX, point.y - dragState.offsetY));
  };

  const handleStartFreehandPath = (event: PointerEvent<SVGSVGElement>) => {
    if (activeTool !== 'pen' || event.button !== 0) {
      return;
    }

    event.preventDefault();
    const point = getCanvasPoint(event);
    svgRef.current?.setPointerCapture(event.pointerId);
    setDragState({
      mode: 'draw',
      pointerId: event.pointerId,
      points: [point],
    });
  };

  const handleFinishDrag = () => {
    if (!dragState) {
      return;
    }

    if (svgRef.current?.hasPointerCapture(dragState.pointerId)) {
      svgRef.current.releasePointerCapture(dragState.pointerId);
    }

    if (dragState.mode === 'draw') {
      onCreateFreehandPath(dragState.points);
    } else if (dragState.mode === 'resize') {
      onFinishShapeResize(dragState.shapeId);
    } else {
      onFinishShapeDrag(dragState.shapeId);
    }

    setDragState(null);
  };

  return (
    <Card>
      <header className="flex flex-col gap-3 border-b border-gray-200 p-4 dark:border-gray-700 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Canvas</h2>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <span>{SVG_CANVAS_WIDTH} x {SVG_CANVAS_HEIGHT}</span>
            <span>|</span>
            <span>100%</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button type="button" onClick={onToggleGrid} className={`rounded-lg border px-3 py-2 text-sm ${showGrid ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-300 dark:border-gray-700'}`}>Grid</button>
          <button type="button" onClick={onToggleGuides} className={`rounded-lg border px-3 py-2 text-sm ${showGuides ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-300 dark:border-gray-700'}`}>Guides</button>
        </div>
      </header>

      <div className="p-8">
        <div className="flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-900">
          <svg
            ref={svgRef}
            className="h-full w-full"
            width={SVG_CANVAS_WIDTH}
            height={SVG_CANVAS_HEIGHT}
            viewBox={`0 0 ${SVG_CANVAS_WIDTH} ${SVG_CANVAS_HEIGHT}`}
            onPointerDown={handleStartFreehandPath}
            onPointerMove={handleDragMove}
            onPointerUp={handleFinishDrag}
            onPointerCancel={handleFinishDrag}
            style={{ cursor: activeTool === 'pen' ? 'crosshair' : undefined, touchAction: 'none' }}
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
                canDrag={activeTool === 'select' && !shape.locked}
                dragging={dragState?.mode !== 'draw' && dragState?.shapeId === shape.id}
                shape={shape}
                selected={selectedShapeId === shape.id}
                onSelect={onSelectShape}
                onStartDrag={handleStartDrag}
              />
            ))}
            {selectedShape && activeTool === 'select' ? (
              <SelectionOverlay
                canResize={!selectedShape.locked}
                shape={selectedShape}
                onStartResize={handleStartResize}
              />
            ) : null}
            {dragState?.mode === 'draw' && dragState.points.length > 0 ? (
              <path
                d={buildPointPathData(dragState.points)}
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
