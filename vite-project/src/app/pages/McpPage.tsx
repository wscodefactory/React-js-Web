import {
  ImportHistoryPanel,
  ManifestPreviewPanel,
  McpExplainerCard,
  McpFeatureGrid,
  McpImportHero,
  PlatformSelector,
  useMcpImportController,
} from '../features/mcp';

export function McpPage() {
  const mcpImport = useMcpImportController();

  return (
    <div className="container-page space-y-section">
      <McpImportHero
        error={mcpImport.error}
        importUrl={mcpImport.importUrl}
        importedSource={mcpImport.importedSource}
        onImport={mcpImport.handleImport}
        onImportUrlChange={mcpImport.changeImportUrl}
      />

      <McpExplainerCard />
      <McpFeatureGrid />

      <PlatformSelector
        selectedPlatform={mcpImport.selectedPlatform}
        onSelectPlatform={mcpImport.selectPlatform}
      />

      <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
        <ManifestPreviewPanel
          copied={mcpImport.copied}
          copyStatus={mcpImport.copyStatus}
          manifestPreview={mcpImport.manifestPreview}
          onCopyManifest={mcpImport.copyManifest}
          platform={mcpImport.selectedPlatformInfo}
        />
        <ImportHistoryPanel
          history={mcpImport.importHistory}
          onClearHistory={mcpImport.clearImportHistory}
          onRemoveImport={mcpImport.removeImportHistoryItem}
          onRestoreImport={mcpImport.restoreImport}
        />
      </section>
    </div>
  );
}
