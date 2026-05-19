import type { SvgShape } from './types';

type ShapeElementProps = {
  onSelect: (id: number) => void;
  selected: boolean;
  shape: SvgShape;
};

export function ShapeElement({
  onSelect,
  selected,
  shape,
}: ShapeElementProps) {
  const commonProps = {
    fill: shape.fill,
    stroke: selected ? '#f59e0b' : shape.stroke,
    strokeWidth: selected ? shape.strokeWidth + 2 : shape.strokeWidth,
    opacity: shape.opacity / 100,
    onClick: () => onSelect(shape.id),
    style: { cursor: 'pointer' },
  };

  if (shape.type === 'circle') {
    return <circle cx={shape.x + shape.width / 2} cy={shape.y + shape.height / 2} r={shape.width / 2} {...commonProps} />;
  }

  if (shape.type === 'path') {
    return <path d={`M${shape.x} ${shape.y + shape.height} C${shape.x + 40} ${shape.y}, ${shape.x + shape.width - 40} ${shape.y}, ${shape.x + shape.width} ${shape.y + shape.height}`} {...commonProps} fill="none" />;
  }

  return <rect x={shape.x} y={shape.y} width={shape.width} height={shape.height} {...commonProps} />;
}
