import type { PointerEvent } from "react";
import type { SvgEditorCopy } from "./copy";
import { getResizeCursor, getResizeHandles, type ResizeHandle } from "./canvasGeometry";
import type { SvgShape } from "./types";

type SelectionOverlayProps = {
  canResize: boolean;
  onStartResize: (shape: SvgShape, handle: ResizeHandle, event: PointerEvent<SVGRectElement>) => void;
  shape: SvgShape;
  text: SvgEditorCopy["canvas"];
};

const resizeHandleSize = 14;

export function SelectionOverlay({ canResize, onStartResize, shape, text }: SelectionOverlayProps) {
  return (
    <g>
      <rect
        x={shape.x}
        y={shape.y}
        width={shape.width}
        height={shape.height}
        fill="none"
        stroke="#f59e0b"
        strokeDasharray="8 6"
        strokeWidth="2"
        pointerEvents="none"
      />
      {canResize && getResizeHandles(shape).map(({ handle, x, y }) => (
        <rect
          key={handle}
          aria-label={text.resizeHandle(handle)}
          data-resize-handle={handle}
          x={x - resizeHandleSize / 2}
          y={y - resizeHandleSize / 2}
          width={resizeHandleSize}
          height={resizeHandleSize}
          rx="3"
          fill="#ffffff"
          stroke="#f59e0b"
          strokeWidth="2"
          onPointerDown={(event) => onStartResize(shape, handle, event)}
          style={{ cursor: getResizeCursor(handle), touchAction: "none" }}
        />
      ))}
    </g>
  );
}
