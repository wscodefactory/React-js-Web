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
          <ActionsPanel
            canRedo={svgEditor.canRedo}
            canUndo={svgEditor.canUndo}
            onCopySvg={svgEditor.copySvgMarkup}
            onExport={svgEditor.handleExport}
            onHideSource={() => svgEditor.setShowSource(false)}
            onImportClick={() => svgEditor.fileInputRef.current?.click()}
            onRedo={svgEditor.redo}
            onReset={svgEditor.resetCanvas}
            onUndo={svgEditor.undo}
            showSource={svgEditor.showSource}
            svgMarkup={svgEditor.svgMarkup}
          />
        </aside>

        <section className="space-y-6">
          <CanvasPreview
            activeTool={svgEditor.activeTool}
            onBeginShapeTransform={svgEditor.beginShapeTransform}
            onCreateFreehandPath={svgEditor.createFreehandPath}
            shapes={svgEditor.shapes}
            selectedShapeId={svgEditor.selectedShapeId}
            showGrid={svgEditor.showGrid}
            showGuides={svgEditor.showGuides}
            onDragLockedShape={svgEditor.handleLockedShapeDrag}
            onFinishShapeDrag={svgEditor.finishShapeDrag}
            onFinishShapeResize={svgEditor.finishShapeResize}
            onMoveShape={svgEditor.moveShape}
            onResizeShape={svgEditor.resizeShape}
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
