import { Card, CardContent } from '../../components/common';
import { svgEditorTools } from '../../data/showcase';
import type { SvgToolItem } from '../../types/showcase';

type SvgToolPaletteProps = {
  activeTool: string;
  onSelectTool: (tool: string) => void;
};

export function SvgToolPalette({
  activeTool,
  onSelectTool,
}: SvgToolPaletteProps) {
  return (
    <Card>
      <CardContent>
        <h2 className="card-title">Tools</h2>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {svgEditorTools.map((tool: SvgToolItem) => {
            const Icon = tool.icon;
            const selected = activeTool === tool.id;

            return (
              <button
                key={tool.id}
                type="button"
                onClick={() => onSelectTool(tool.id)}
                className={`flex flex-col items-center gap-2 rounded-lg border p-3 transition-colors ${
                  selected
                    ? 'border-green-500 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
                    : 'border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className="icon" />
                <span className="text-xs">{tool.label}</span>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
