import { SVG_CANVAS_HEIGHT, SVG_CANVAS_WIDTH, SVG_MIN_SHAPE_SIZE } from "./constants";
import { getPointDistance } from "./pathGeometry";
import type { SvgPoint, SvgShape } from "./types";

export const GRID_SIZE = 40;
export const GRID_MAJOR_INTERVAL = 5;
export const GRID_ORIGIN = {
  x: SVG_CANVAS_WIDTH / 2,
  y: SVG_CANVAS_HEIGHT / 2,
};

export type ResizeHandle = "n" | "ne" | "e" | "se" | "s" | "sw" | "w" | "nw";

const resizeCursorMap: Record<ResizeHandle, string> = {
  e: "ew-resize",
  n: "ns-resize",
  ne: "nesw-resize",
  nw: "nwse-resize",
  s: "ns-resize",
  se: "nwse-resize",
  sw: "nesw-resize",
  w: "ew-resize",
};

export function getCenteredGridPositions(max: number, origin: number, step: number) {
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

export function isMajorGridLine(position: number, origin: number) {
  return Math.abs((position - origin) / GRID_SIZE) % GRID_MAJOR_INTERVAL === 0;
}

export function getResizeCursor(handle: ResizeHandle) {
  return resizeCursorMap[handle];
}

export function getResizeHandles(shape: SvgShape) {
  const centerX = shape.x + shape.width / 2;
  const centerY = shape.y + shape.height / 2;
  const right = shape.x + shape.width;
  const bottom = shape.y + shape.height;

  return [
    { handle: "nw" as const, x: shape.x, y: shape.y },
    { handle: "n" as const, x: centerX, y: shape.y },
    { handle: "ne" as const, x: right, y: shape.y },
    { handle: "e" as const, x: right, y: centerY },
    { handle: "se" as const, x: right, y: bottom },
    { handle: "s" as const, x: centerX, y: bottom },
    { handle: "sw" as const, x: shape.x, y: bottom },
    { handle: "w" as const, x: shape.x, y: centerY },
  ];
}

export function getResizedShapeGeometry(shape: SvgShape, handle: ResizeHandle, point: SvgPoint) {
  const right = shape.x + shape.width;
  const bottom = shape.y + shape.height;
  let x = shape.x;
  let y = shape.y;
  let width = shape.width;
  let height = shape.height;

  if (handle.includes("e")) {
    width = Math.min(Math.max(point.x - shape.x, SVG_MIN_SHAPE_SIZE), SVG_CANVAS_WIDTH - shape.x);
  }

  if (handle.includes("s")) {
    height = Math.min(Math.max(point.y - shape.y, SVG_MIN_SHAPE_SIZE), SVG_CANVAS_HEIGHT - shape.y);
  }

  if (handle.includes("w")) {
    x = Math.min(Math.max(point.x, 0), right - SVG_MIN_SHAPE_SIZE);
    width = right - x;
  }

  if (handle.includes("n")) {
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

export function clampShapePosition(shape: SvgShape, x: number, y: number) {
  return {
    x: Math.round(Math.min(Math.max(x, 0), Math.max(0, SVG_CANVAS_WIDTH - shape.width))),
    y: Math.round(Math.min(Math.max(y, 0), Math.max(0, SVG_CANVAS_HEIGHT - shape.height))),
  };
}

export function shouldAppendDrawPoint(points: SvgPoint[], point: SvgPoint) {
  const previousPoint = points[points.length - 1];

  return !previousPoint || getPointDistance(previousPoint, point) >= 3;
}
