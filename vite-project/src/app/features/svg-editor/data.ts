import type { SvgShape } from './types';

export const initialShapes: SvgShape[] = [
  { id: 1, name: 'Rectangle', type: 'rect', x: 50, y: 50, width: 150, height: 100, fill: '#16a34a', stroke: '#000000', strokeWidth: 2, opacity: 100, visible: true, locked: false },
  { id: 2, name: 'Circle', type: 'circle', x: 240, y: 90, width: 120, height: 120, fill: '#3b82f6', stroke: '#000000', strokeWidth: 2, opacity: 100, visible: true, locked: false },
];
