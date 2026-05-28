export type SvgShapeType = 'rect' | 'circle' | 'path';
export type ExportFormat = 'svg' | 'png' | 'jpg' | 'webp';
export type ExportQuality = 'high' | 'medium' | 'low';
export type ExportScale = '1x' | '2x' | '3x';

export type SvgPoint = {
  x: number;
  y: number;
};

export type SvgShape = {
  id: number;
  name: string;
  type: SvgShapeType;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
  opacity: number;
  points?: SvgPoint[];
  visible: boolean;
  locked: boolean;
};
