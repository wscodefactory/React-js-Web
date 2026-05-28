import type { PointerEvent } from 'react';
import { buildPointPathData } from './pathGeometry';
import type { SvgShape } from './types';

type ShapeElementProps = {
  canDrag: boolean;
  dragging: boolean;
  onSelect: (id: number) => void;
  onStartDrag: (shape: SvgShape, event: PointerEvent<SVGElement>) => void;
  selected: boolean;
  shape: SvgShape;
};

export function ShapeElement({
  canDrag,
  dragging,
  onSelect,
  onStartDrag,
  selected,
  shape,
}: ShapeElementProps) {
  const cursor = shape.locked ? 'not-allowed' : dragging ? 'grabbing' : canDrag ? 'grab' : 'pointer';
  const commonProps = {
    fill: shape.fill,
    stroke: selected ? '#f59e0b' : shape.stroke,
    strokeWidth: selected ? shape.strokeWidth + 2 : shape.strokeWidth,
    opacity: shape.opacity / 100,
    onClick: () => onSelect(shape.id),
    onPointerDown: (event: PointerEvent<SVGElement>) => onStartDrag(shape, event),
    style: { cursor, touchAction: 'none' },
  };

  if (shape.type === 'circle') {
    return <ellipse cx={shape.x + shape.width / 2} cy={shape.y + shape.height / 2} rx={shape.width / 2} ry={shape.height / 2} {...commonProps} />;
  }

  if (shape.type === 'path') {
    const pathData = shape.points?.length
      ? buildPointPathData(shape.points)
      : `M${shape.x} ${shape.y + shape.height} L${shape.x + shape.width} ${shape.y}`;

    return <path d={pathData} {...commonProps} fill="none" strokeLinecap="round" strokeLinejoin="round" />;
  }

  return <rect x={shape.x} y={shape.y} width={shape.width} height={shape.height} {...commonProps} />;
}
