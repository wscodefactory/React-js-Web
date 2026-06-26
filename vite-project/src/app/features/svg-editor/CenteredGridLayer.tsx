import { SVG_CANVAS_HEIGHT, SVG_CANVAS_WIDTH } from "./constants";
import { getCenteredGridPositions, GRID_ORIGIN, GRID_SIZE, isMajorGridLine } from "./canvasGeometry";

export function CenteredGridLayer() {
  const verticalLines = getCenteredGridPositions(SVG_CANVAS_WIDTH, GRID_ORIGIN.x, GRID_SIZE);
  const horizontalLines = getCenteredGridPositions(SVG_CANVAS_HEIGHT, GRID_ORIGIN.y, GRID_SIZE);

  return (
    <g pointerEvents="none">
      <rect width={SVG_CANVAS_WIDTH} height={SVG_CANVAS_HEIGHT} fill="#ffffff" />
      <g stroke="#e5e7eb" strokeWidth="1">
        {verticalLines.filter((x) => x !== GRID_ORIGIN.x && !isMajorGridLine(x, GRID_ORIGIN.x)).map((x) => (
          <line key={`grid-v-${x}`} x1={x} y1="0" x2={x} y2={SVG_CANVAS_HEIGHT} />
        ))}
        {horizontalLines.filter((y) => y !== GRID_ORIGIN.y && !isMajorGridLine(y, GRID_ORIGIN.y)).map((y) => (
          <line key={`grid-h-${y}`} x1="0" y1={y} x2={SVG_CANVAS_WIDTH} y2={y} />
        ))}
      </g>
      <g stroke="#d1d5db" strokeWidth="1.5">
        {verticalLines.filter((x) => x !== GRID_ORIGIN.x && isMajorGridLine(x, GRID_ORIGIN.x)).map((x) => (
          <line key={`grid-major-v-${x}`} x1={x} y1="0" x2={x} y2={SVG_CANVAS_HEIGHT} />
        ))}
        {horizontalLines.filter((y) => y !== GRID_ORIGIN.y && isMajorGridLine(y, GRID_ORIGIN.y)).map((y) => (
          <line key={`grid-major-h-${y}`} x1="0" y1={y} x2={SVG_CANVAS_WIDTH} y2={y} />
        ))}
      </g>
      <g stroke="#10b981" strokeWidth="2">
        <line x1={GRID_ORIGIN.x} y1="0" x2={GRID_ORIGIN.x} y2={SVG_CANVAS_HEIGHT} />
        <line x1="0" y1={GRID_ORIGIN.y} x2={SVG_CANVAS_WIDTH} y2={GRID_ORIGIN.y} />
      </g>
      <circle cx={GRID_ORIGIN.x} cy={GRID_ORIGIN.y} r="5" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
      <text x={GRID_ORIGIN.x + 10} y={GRID_ORIGIN.y - 10} fill="#059669" fontSize="18" fontWeight="600">0,0</text>
    </g>
  );
}
