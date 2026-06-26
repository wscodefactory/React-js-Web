import { SVG_CANVAS_HEIGHT, SVG_CANVAS_WIDTH, SVG_MIN_SHAPE_SIZE } from "./constants";
import { clampCanvasPoint, getPointBounds, getPointDistance, scalePathPoints, translatePathPoints } from "./pathGeometry";
import type { SvgPoint, SvgShape, SvgShapeType } from "./types";

export function clampShapeGeometry(shape: SvgShape, updates: Partial<SvgShape>) {
  const nextShape = { ...shape, ...updates };
  const width = Math.round(Math.min(Math.max(nextShape.width, SVG_MIN_SHAPE_SIZE), SVG_CANVAS_WIDTH));
  const height = Math.round(Math.min(Math.max(nextShape.height, SVG_MIN_SHAPE_SIZE), SVG_CANVAS_HEIGHT));
  const x = Math.round(Math.min(Math.max(nextShape.x, 0), Math.max(0, SVG_CANVAS_WIDTH - width)));
  const y = Math.round(Math.min(Math.max(nextShape.y, 0), Math.max(0, SVG_CANVAS_HEIGHT - height)));

  return { ...nextShape, height, width, x, y };
}

export function applyShapeUpdates(shape: SvgShape, updates: Partial<SvgShape>) {
  const nextShape = clampShapeGeometry(shape, updates);
  const shouldTransformPath = shape.type === "path"
    && Boolean(shape.points?.length)
    && ["height", "width", "x", "y"].some((key) => key in updates);

  if (!shouldTransformPath) {
    return nextShape;
  }

  return {
    ...nextShape,
    points: scalePathPoints(shape, nextShape),
  };
}

export function getSanitizedFreehandPoints(points: SvgPoint[]) {
  return points.map(clampCanvasPoint).filter((point, index, pointList) => (
    index === 0 || getPointDistance(pointList[index - 1], point) >= 2
  ));
}

export function createShapeForTool(tool: string, nextId: number): SvgShape {
  const shapeType: SvgShapeType = tool === "circle" ? "circle" : "rect";

  return {
    id: nextId,
    name: shapeType === "circle" ? `Circle ${nextId}` : `Rectangle ${nextId}`,
    type: shapeType,
    x: 80 + (nextId * 36) % 360,
    y: 80 + (nextId * 28) % 240,
    width: shapeType === "circle" ? 180 : 240,
    height: shapeType === "circle" ? 180 : 160,
    fill: "#16a34a",
    stroke: "#000000",
    strokeWidth: 2,
    opacity: 100,
    visible: true,
    locked: false,
  };
}

export function createPathShape(nextId: number, points: SvgPoint[]): SvgShape {
  return {
    id: nextId,
    name: `Path ${nextId}`,
    type: "path",
    ...getPointBounds(points),
    fill: "none",
    stroke: "#111827",
    strokeWidth: 3,
    opacity: 100,
    points,
    visible: true,
    locked: false,
  };
}

export function moveShapeToPosition(shape: SvgShape, position: Pick<SvgShape, "x" | "y">) {
  const dx = position.x - shape.x;
  const dy = position.y - shape.y;

  return {
    ...shape,
    ...position,
    points: shape.type === "path" ? translatePathPoints(shape.points, dx, dy) : shape.points,
  };
}

export function createDuplicateShape(shape: SvgShape, nextId: number) {
  const nextX = Math.min(shape.x + 24, Math.max(0, SVG_CANVAS_WIDTH - shape.width));
  const nextY = Math.min(shape.y + 24, Math.max(0, SVG_CANVAS_HEIGHT - shape.height));

  return {
    ...shape,
    id: nextId,
    name: `${shape.name} Copy`,
    points: shape.type === "path" ? translatePathPoints(shape.points, nextX - shape.x, nextY - shape.y) : shape.points,
    x: nextX,
    y: nextY,
    locked: false,
  };
}
