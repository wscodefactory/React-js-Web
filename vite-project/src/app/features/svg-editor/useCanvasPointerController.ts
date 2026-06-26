import { useRef, useState } from "react";
import type { PointerEvent } from "react";
import { SVG_CANVAS_HEIGHT, SVG_CANVAS_WIDTH } from "./constants";
import { buildPointPathData, clampCanvasPoint } from "./pathGeometry";
import {
  clampShapePosition,
  getResizedShapeGeometry,
  shouldAppendDrawPoint,
  type ResizeHandle,
} from "./canvasGeometry";
import type { SvgPoint, SvgShape } from "./types";

type MoveDragState = {
  mode: "move";
  offsetX: number;
  offsetY: number;
  pointerId: number;
  shapeId: number;
};

type ResizeDragState = {
  handle: ResizeHandle;
  initialShape: SvgShape;
  mode: "resize";
  pointerId: number;
  shapeId: number;
};

type DrawDragState = {
  mode: "draw";
  pointerId: number;
  points: SvgPoint[];
};

type DragState = DrawDragState | MoveDragState | ResizeDragState;

type CanvasPointerControllerOptions = {
  activeTool: string;
  onBeginShapeTransform: (id: number) => void;
  onCreateFreehandPath: (points: SvgPoint[]) => void;
  onDragLockedShape: (id: number) => void;
  onFinishShapeDrag: (id: number) => void;
  onFinishShapeResize: (id: number) => void;
  onMoveShape: (id: number, position: Pick<SvgShape, "x" | "y">) => void;
  onResizeShape: (id: number, geometry: Pick<SvgShape, "x" | "y" | "width" | "height">) => void;
  onSelectShape: (id: number) => void;
  shapes: SvgShape[];
};

export function useCanvasPointerController({
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
}: CanvasPointerControllerOptions) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dragState, setDragState] = useState<DragState | null>(null);

  function getCanvasPoint(event: PointerEvent<SVGElement>) {
    const svg = svgRef.current;

    if (!svg) {
      return { x: 0, y: 0 };
    }

    const rect = svg.getBoundingClientRect();

    return clampCanvasPoint({
      x: ((event.clientX - rect.left) / rect.width) * SVG_CANVAS_WIDTH,
      y: ((event.clientY - rect.top) / rect.height) * SVG_CANVAS_HEIGHT,
    });
  }

  function handleStartDrag(shape: SvgShape, event: PointerEvent<SVGElement>) {
    if (activeTool === "pen") {
      return;
    }

    onSelectShape(shape.id);

    if (activeTool !== "select") {
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
      mode: "move",
      offsetX: point.x - shape.x,
      offsetY: point.y - shape.y,
      pointerId: event.pointerId,
      shapeId: shape.id,
    });
  }

  function handleStartResize(shape: SvgShape, handle: ResizeHandle, event: PointerEvent<SVGRectElement>) {
    onSelectShape(shape.id);

    if (activeTool !== "select") {
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
      mode: "resize",
      pointerId: event.pointerId,
      shapeId: shape.id,
    });
  }

  function handleDragMove(event: PointerEvent<SVGSVGElement>) {
    if (!dragState) {
      return;
    }

    event.preventDefault();
    const point = getCanvasPoint(event);

    if (dragState.mode === "draw") {
      setDragState((current) => {
        if (!current || current.mode !== "draw" || !shouldAppendDrawPoint(current.points, point)) {
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

    if (dragState.mode === "resize") {
      onResizeShape(shape.id, getResizedShapeGeometry(dragState.initialShape, dragState.handle, point));
      return;
    }

    onMoveShape(shape.id, clampShapePosition(shape, point.x - dragState.offsetX, point.y - dragState.offsetY));
  }

  function handleStartFreehandPath(event: PointerEvent<SVGSVGElement>) {
    if (activeTool !== "pen" || event.button !== 0) {
      return;
    }

    event.preventDefault();
    const point = getCanvasPoint(event);
    svgRef.current?.setPointerCapture(event.pointerId);
    setDragState({
      mode: "draw",
      pointerId: event.pointerId,
      points: [point],
    });
  }

  function handleFinishDrag() {
    if (!dragState) {
      return;
    }

    if (svgRef.current?.hasPointerCapture(dragState.pointerId)) {
      svgRef.current.releasePointerCapture(dragState.pointerId);
    }

    if (dragState.mode === "draw") {
      onCreateFreehandPath(dragState.points);
    } else if (dragState.mode === "resize") {
      onFinishShapeResize(dragState.shapeId);
    } else {
      onFinishShapeDrag(dragState.shapeId);
    }

    setDragState(null);
  }

  return {
    dragState,
    dragPathData: dragState?.mode === "draw" ? buildPointPathData(dragState.points) : null,
    handleDragMove,
    handleFinishDrag,
    handleStartDrag,
    handleStartFreehandPath,
    handleStartResize,
    svgRef,
  };
}
