import { SVG_CANVAS_HEIGHT, SVG_CANVAS_WIDTH } from "./constants";
import type { SvgEditorCopy } from "./copy";

type CanvasToolbarProps = {
  onToggleGrid: () => void;
  onToggleGuides: () => void;
  showGrid: boolean;
  showGuides: boolean;
  text: SvgEditorCopy["canvas"];
};

function getToggleButtonClass(isActive: boolean) {
  return [
    "rounded-lg border px-3 py-2 text-sm",
    isActive ? "border-green-500 bg-green-50 text-green-700" : "border-gray-300 dark:border-gray-700",
  ].join(" ");
}

export function CanvasToolbar({ onToggleGrid, onToggleGuides, showGrid, showGuides, text }: CanvasToolbarProps) {
  return (
    <header className="flex flex-col gap-3 border-b border-gray-200 p-4 dark:border-gray-700 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{text.title}</h2>
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <span>{SVG_CANVAS_WIDTH} x {SVG_CANVAS_HEIGHT}</span>
          <span>|</span>
          <span>100%</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <button type="button" onClick={onToggleGrid} className={getToggleButtonClass(showGrid)}>{text.grid}</button>
        <button type="button" onClick={onToggleGuides} className={getToggleButtonClass(showGuides)}>{text.guides}</button>
      </div>
    </header>
  );
}
