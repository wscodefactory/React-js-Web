import type { Ref } from 'react';
import { SectionHeader } from '@/app/components/common';
import {
  ActionsPanel,
  CanvasPreview,
  ExportSettings,
  LayersPanel,
  PropertiesPanel,
  SvgStatusCard,
  SvgToolPalette,
  useSvgEditorController,
} from '@/app/features/svg-editor';

export function SvgEditorPage() {
  const svgEditor = useSvgEditorController();

  return (
    <div className="container-page">
      <SectionHeader
        titleHighlight="SVG"
        title="Editor"
        description="Create and edit scalable vector graphics with professional tools"
      />

      <input
        ref={svgEditor.fileInputRef as Ref<HTMLInputElement>}
        type="file"
        accept=".svg,image/svg+xml"
        onChange={svgEditor.handleImportFile}
        className="hidden"
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="space-y-section">
          <SvgToolPalette activeTool={svgEditor.activeTool} onSelectTool={svgEditor.addShape} />
          <PropertiesPanel selectedShape={svgEditor.selectedShape} onUpdateSelected={svgEditor.updateSelectedShape} />
          <LayersPanel
            shapes={svgEditor.shapes}
            selectedShapeId={svgEditor.selectedShapeId}
            onSelectShape={svgEditor.setSelectedShapeId}
            onToggleVisibility={svgEditor.toggleVisibility}
            onToggleLock={svgEditor.toggleLock}
            onDuplicateShape={svgEditor.duplicateShape}
            onDeleteShape={svgEditor.deleteShape}
          />
          <ActionsPanel onExport={svgEditor.handleExport} onImportClick={() => svgEditor.fileInputRef.current?.click()} />
        </aside>

        <section className="space-y-6">
          <CanvasPreview
            shapes={svgEditor.shapes}
            selectedShapeId={svgEditor.selectedShapeId}
            showGrid={svgEditor.showGrid}
            showGuides={svgEditor.showGuides}
            onToggleGrid={() => svgEditor.setShowGrid((current) => !current)}
            onToggleGuides={() => svgEditor.setShowGuides((current) => !current)}
            onSelectShape={svgEditor.setSelectedShapeId}
          />
          <ExportSettings
            format={svgEditor.format}
            quality={svgEditor.quality}
            scale={svgEditor.scale}
            onFormatChange={svgEditor.setFormat}
            onQualityChange={svgEditor.setQuality}
            onScaleChange={svgEditor.setScale}
          />
          <SvgStatusCard status={svgEditor.status} />
        </section>
      </div>
    </div>
  );
}
