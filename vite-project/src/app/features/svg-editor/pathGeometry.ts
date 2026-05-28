import { SVG_CANVAS_HEIGHT, SVG_CANVAS_WIDTH } from './constants';
import type { SvgPoint, SvgShape } from './types';

const MIN_PATH_SPAN = 1;

const roundCoordinate = (value: number) => Math.round(value * 10) / 10;

export const clampCanvasPoint = (point: SvgPoint): SvgPoint => ({
  x: roundCoordinate(Math.min(Math.max(point.x, 0), SVG_CANVAS_WIDTH)),
  y: roundCoordinate(Math.min(Math.max(point.y, 0), SVG_CANVAS_HEIGHT)),
});

export const getPointDistance = (firstPoint: SvgPoint, secondPoint: SvgPoint) => (
  Math.hypot(firstPoint.x - secondPoint.x, firstPoint.y - secondPoint.y)
);

export const getPointBounds = (points: SvgPoint[]) => {
  const xValues = points.map((point) => point.x);
  const yValues = points.map((point) => point.y);
  const minX = Math.min(...xValues);
  const maxX = Math.max(...xValues);
  const minY = Math.min(...yValues);
  const maxY = Math.max(...yValues);

  return {
    height: Math.max(MIN_PATH_SPAN, roundCoordinate(maxY - minY)),
    width: Math.max(MIN_PATH_SPAN, roundCoordinate(maxX - minX)),
    x: roundCoordinate(minX),
    y: roundCoordinate(minY),
  };
};

export const buildPointPathData = (points: SvgPoint[] = []) => {
  if (points.length === 0) {
    return '';
  }

  const [firstPoint, ...remainingPoints] = points.map(clampCanvasPoint);

  return [
    `M${firstPoint.x} ${firstPoint.y}`,
    ...remainingPoints.map((point) => `L${point.x} ${point.y}`),
  ].join(' ');
};

export const translatePathPoints = (points: SvgPoint[] = [], dx: number, dy: number) => (
  points.map((point) => clampCanvasPoint({ x: point.x + dx, y: point.y + dy }))
);

export const scalePathPoints = (shape: SvgShape, geometry: Pick<SvgShape, 'x' | 'y' | 'width' | 'height'>) => {
  if (!shape.points?.length) {
    return shape.points;
  }

  const widthScale = geometry.width / Math.max(shape.width, MIN_PATH_SPAN);
  const heightScale = geometry.height / Math.max(shape.height, MIN_PATH_SPAN);

  return shape.points.map((point) => clampCanvasPoint({
    x: geometry.x + (point.x - shape.x) * widthScale,
    y: geometry.y + (point.y - shape.y) * heightScale,
  }));
};

export const parseStraightPathPoints = (pathData: string): SvgPoint[] => {
  const commandMatches = pathData.matchAll(/[ML]\s*(-?\d*\.?\d+)\s*,?\s*(-?\d*\.?\d+)/gi);

  return Array.from(commandMatches, (match) => clampCanvasPoint({
    x: Number(match[1]),
    y: Number(match[2]),
  }));
};
