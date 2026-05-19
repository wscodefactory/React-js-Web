import type { SvgShape } from './types';

export function buildSvgMarkup(shapes: SvgShape[]) {
  const shapeMarkup = shapes
    .filter((shape) => shape.visible)
    .map((shape) => {
      const common = `fill="${shape.fill}" stroke="${shape.stroke}" stroke-width="${shape.strokeWidth}" opacity="${shape.opacity / 100}"`;

      if (shape.type === 'circle') {
        return `<circle cx="${shape.x + shape.width / 2}" cy="${shape.y + shape.height / 2}" r="${shape.width / 2}" ${common} />`;
      }

      if (shape.type === 'path') {
        return `<path d="M${shape.x} ${shape.y + shape.height} C${shape.x + 40} ${shape.y}, ${shape.x + shape.width - 40} ${shape.y}, ${shape.x + shape.width} ${shape.y + shape.height}" ${common} fill="none" />`;
      }

      return `<rect x="${shape.x}" y="${shape.y}" width="${shape.width}" height="${shape.height}" ${common} />`;
    })
    .join('\n  ');

  return `<svg width="800" height="600" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
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

  return [...rects, ...circles];
}
