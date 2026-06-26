import type { SvgShape } from "./types";

export const SVG_HISTORY_LIMIT = 50;

export function cloneShapes(shapeList: SvgShape[]) {
  return shapeList.map((shape) => ({
    ...shape,
    points: shape.points?.map((point) => ({ ...point })),
  }));
}

export function areShapeListsEqual(firstList: SvgShape[], secondList: SvgShape[]) {
  return JSON.stringify(firstList) === JSON.stringify(secondList);
}

export function getNextSelectedShapeId(shapeList: SvgShape[], currentId: number | null) {
  if (currentId !== null && shapeList.some((shape) => shape.id === currentId)) {
    return currentId;
  }

  return shapeList[0]?.id ?? null;
}

export function getNextShapeId(shapeList: SvgShape[]) {
  return Math.max(0, ...shapeList.map((shape) => shape.id)) + 1;
}
