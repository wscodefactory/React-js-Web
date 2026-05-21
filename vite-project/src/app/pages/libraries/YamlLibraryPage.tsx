import { PageIntro } from '../../components/showcase/PageIntro';
import {
  UploadedYamlSection,
  YamlConverterPanel,
  YamlFeatureCards,
  YamlStatusMessage,
  YamlTemplateSection,
  YamlUploadActions,
  useYamlLibraryController,
} from '../../features/yaml-library';

export function YamlLibraryPage() {
  const yamlLibrary = useYamlLibraryController();

  return (
    <main className="p-4 md:p-8">
      <PageIntro highlight="YAML" title="Library" description="Upload, preview, and reuse configuration snippets in a React-friendly asset library." />

      <YamlFeatureCards />

      <YamlUploadActions
        filesCount={yamlLibrary.files.length}
        inputRef={yamlLibrary.inputRef}
        onClearUploads={yamlLibrary.clearUploads}
        onFileChange={yamlLibrary.handleFileChange}
      />

      <YamlStatusMessage message={yamlLibrary.status} />

      <YamlConverterPanel
        copiedId={yamlLibrary.copiedId}
        input={yamlLibrary.converterInput}
        mode={yamlLibrary.converterMode}
        onConvert={yamlLibrary.handleConvert}
        onCopyOutput={() => yamlLibrary.copyText('converter-output', yamlLibrary.converterOutput)}
        onInputChange={yamlLibrary.setConverterInput}
        onLoadSample={yamlLibrary.loadConverterSample}
        onModeChange={yamlLibrary.changeConverterMode}
        output={yamlLibrary.converterOutput}
      />

      <UploadedYamlSection
        copiedId={yamlLibrary.copiedId}
        files={yamlLibrary.files}
        onCopy={(item) => yamlLibrary.copyText(item.id, item.content)}
        onRemove={yamlLibrary.removeFile}
      />

      <YamlTemplateSection
        copiedId={yamlLibrary.copiedId}
        onCopy={(template) => yamlLibrary.copyText(template.id, template.code)}
        onQueryChange={yamlLibrary.setTemplateQuery}
        query={yamlLibrary.templateQuery}
        templates={yamlLibrary.visibleTemplates}
      />
    </main>
  );
}
