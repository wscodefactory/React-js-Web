import type { SvgShape } from './types';
import { SVG_CANVAS_HEIGHT, SVG_CANVAS_WIDTH } from './constants';
import { buildPointPathData, getPointBounds, parseStraightPathPoints } from './pathGeometry';

export function buildSvgMarkup(shapes: SvgShape[]) {
  const shapeMarkup = shapes
    .filter((shape) => shape.visible)
    .map((shape) => {
      const common = `fill="${shape.fill}" stroke="${shape.stroke}" stroke-width="${shape.strokeWidth}" opacity="${shape.opacity / 100}"`;

      if (shape.type === 'circle') {
        return `<ellipse cx="${shape.x + shape.width / 2}" cy="${shape.y + shape.height / 2}" rx="${shape.width / 2}" ry="${shape.height / 2}" ${common} />`;
      }

      if (shape.type === 'path') {
        const pathData = shape.points?.length
          ? buildPointPathData(shape.points)
          : `M${shape.x} ${shape.y + shape.height} L${shape.x + shape.width} ${shape.y}`;

        return `<path d="${pathData}" ${common} fill="none" stroke-linecap="round" stroke-linejoin="round" />`;
      }

      return `<rect x="${shape.x}" y="${shape.y}" width="${shape.width}" height="${shape.height}" ${common} />`;
    })
    .join('\n  ');

  return `<svg width="${SVG_CANVAS_WIDTH}" height="${SVG_CANVAS_HEIGHT}" viewBox="0 0 ${SVG_CANVAS_WIDTH} ${SVG_CANVAS_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  ${shapeMarkup}
</svg>`;
}

export function parseImportedSvg(content: string, nextId: number): SvgShape[] {
  const documentNode = new DOMParser().parseFromString(content, 'image/svg+xml');
  const parserError = documentNode.querySelector('parsererror');

  if (parserError) {
    return [];
  }

  const rects = Array.from(documentNode.querySelectorAll('rect')).slice(0, 4).map((rect, index) => ({
    id: nextId + index,
    name: `Imported Rect ${index + 1}`,
    type: 'rect' as const,
    x: Number(rect.getAttribute('x') ?? 40 + index * 24),
    y: Number(rect.getAttribute('y') ?? 40 + index * 24),
    width: Number(rect.getAttribute('width') ?? 120),
    height: Number(rect.getAttribute('height') ?? 80),
    fill: rect.getAttribute('fill') ?? '#16a34a',
    stroke: rect.getAttribute('stroke') ?? '#000000',
    strokeWidth: Number(rect.getAttribute('stroke-width') ?? 2),
    opacity: Number(rect.getAttribute('opacity') ?? 1) * 100,
    visible: true,
    locked: false,
  }));

  const circles = Array.from(documentNode.querySelectorAll('circle')).slice(0, 4).map((circle, index) => {
    const radius = Number(circle.getAttribute('r') ?? 40);

    return {
      id: nextId + rects.length + index,
      name: `Imported Circle ${index + 1}`,
      type: 'circle' as const,
      x: Number(circle.getAttribute('cx') ?? 160) - radius,
      y: Number(circle.getAttribute('cy') ?? 120) - radius,
      width: radius * 2,
      height: radius * 2,
      fill: circle.getAttribute('fill') ?? '#3b82f6',
      stroke: circle.getAttribute('stroke') ?? '#000000',
      strokeWidth: Number(circle.getAttribute('stroke-width') ?? 2),
      opacity: Number(circle.getAttribute('opacity') ?? 1) * 100,
      visible: true,
      locked: false,
    };
  });

  const ellipses = Array.from(documentNode.querySelectorAll('ellipse')).slice(0, 4).map((ellipse, index) => {
    const radiusX = Number(ellipse.getAttribute('rx') ?? 40);
    const radiusY = Number(ellipse.getAttribute('ry') ?? radiusX);

    return {
      id: nextId + rects.length + circles.length + index,
      name: `Imported Ellipse ${index + 1}`,
      type: 'circle' as const,
      x: Number(ellipse.getAttribute('cx') ?? 160) - radiusX,
      y: Number(ellipse.getAttribute('cy') ?? 120) - radiusY,
      width: radiusX * 2,
      height: radiusY * 2,
      fill: ellipse.getAttribute('fill') ?? '#3b82f6',
      stroke: ellipse.getAttribute('stroke') ?? '#000000',
      strokeWidth: Number(ellipse.getAttribute('stroke-width') ?? 2),
      opacity: Number(ellipse.getAttribute('opacity') ?? 1) * 100,
      visible: true,
      locked: false,
    };
  });

  const paths = Array.from(documentNode.querySelectorAll('path')).slice(0, 4).flatMap((path, index) => {
    const points = parseStraightPathPoints(path.getAttribute('d') ?? '');

    if (points.length < 2) {
      return [];
    }

    const bounds = getPointBounds(points);

    return [{
      id: nextId + rects.length + circles.length + ellipses.length + index,
      name: `Imported Path ${index + 1}`,
      type: 'path' as const,
      ...bounds,
      fill: 'none',
      stroke: path.getAttribute('stroke') ?? '#000000',
      strokeWidth: Number(path.getAttribute('stroke-width') ?? 3),
      opacity: Number(path.getAttribute('opacity') ?? 1) * 100,
      points,
      visible: true,
      locked: false,
    }];
  });

  return [...rects, ...circles, ...ellipses, ...paths];
}
