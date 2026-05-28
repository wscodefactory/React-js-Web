import type { SvgShape } from './types';

export const initialShapes: SvgShape[] = [
  { id: 1, name: 'Rectangle', type: 'rect', x: 100, y: 100, width: 300, height: 200, fill: '#16a34a', stroke: '#000000', strokeWidth: 2, opacity: 100, visible: true, locked: false },
  { id: 2, name: 'Circle', type: 'circle', x: 480, y: 180, width: 240, height: 240, fill: '#3b82f6', stroke: '#000000', strokeWidth: 2, opacity: 100, visible: true, locked: false },
];
