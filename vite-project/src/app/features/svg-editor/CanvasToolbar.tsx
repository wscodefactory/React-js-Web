import { AlignCenterHorizontal, AlignCenterVertical, AlignEndHorizontal, AlignEndVertical, AlignStartHorizontal, AlignStartVertical } from "lucide-react";
import { SVG_CANVAS_HEIGHT, SVG_CANVAS_WIDTH } from "./constants";
import type { SvgEditorCopy } from "./copy";
import type { SvgAlignment } from "./types";

type CanvasToolbarProps = {
  hasSelection: boolean;
  onAlignSelected: (alignment: SvgAlignment) => void;
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

const alignmentButtons: Array<{ id: SvgAlignment; icon: typeof AlignStartHorizontal }> = [
  { id: "left", icon: AlignStartVertical },
  { id: "center", icon: AlignCenterVertical },
  { id: "right", icon: AlignEndVertical },
  { id: "top", icon: AlignStartHorizontal },
  { id: "middle", icon: AlignCenterHorizontal },
  { id: "bottom", icon: AlignEndHorizontal },
];

export function CanvasToolbar({
  hasSelection,
  onAlignSelected,
  onToggleGrid,
  onToggleGuides,
  showGrid,
  showGuides,
  text,
}: CanvasToolbarProps) {
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
      <div className="flex flex-wrap items-center gap-2">
        <div className="grid grid-cols-6 gap-1" role="group" aria-label={text.alignTitle}>
          {alignmentButtons.map(({ id, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => onAlignSelected(id)}
              disabled={!hasSelection}
              title={text.align[id]}
              aria-label={text.align[id]}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 text-gray-600 transition hover:border-green-500 hover:text-green-700 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:text-gray-300 dark:hover:border-green-400 dark:hover:text-green-300"
            >
              <Icon className="icon-sm" />
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button type="button" onClick={onToggleGrid} className={getToggleButtonClass(showGrid)}>{text.grid}</button>
          <button type="button" onClick={onToggleGuides} className={getToggleButtonClass(showGuides)}>{text.guides}</button>
        </div>
      </div>
    </header>
  );
}
