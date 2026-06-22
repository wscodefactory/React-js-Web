import { PageIntro } from '../../components/showcase/PageIntro';
import { useLanguage } from '../../context/LanguageContext';
import {
  UploadedYamlSection,
  YamlConverterPanel,
  YamlFeatureCards,
  YamlStatusMessage,
  YamlTemplateSection,
  YamlUploadActions,
  useYamlLibraryController,
} from '../../features/yaml-library';
import { yamlLibraryText } from '../../i18n';

export function YamlLibraryPage() {
  const yamlLibrary = useYamlLibraryController();
  const { language } = useLanguage();
  const text = yamlLibraryText[language];

  return (
    <main className="p-4 md:p-8">
      <PageIntro highlight={text.highlight} title={text.title} description={text.description} />

      <YamlFeatureCards />

      <YamlUploadActions
        filesCount={yamlLibrary.files.length}
        inputRef={yamlLibrary.inputRef}
        onClearUploads={yamlLibrary.clearUploads}
        onDownloadUploads={yamlLibrary.downloadUploads}
        onFileChange={yamlLibrary.handleFileChange}
      />

      <YamlStatusMessage message={yamlLibrary.status} />

      <YamlConverterPanel
        copiedId={yamlLibrary.copiedId}
        input={yamlLibrary.converterInput}
        mode={yamlLibrary.converterMode}
        onConvert={yamlLibrary.handleConvert}
        onCopyOutput={() => yamlLibrary.copyText('converter-output', yamlLibrary.converterOutput)}
        onDownloadOutput={yamlLibrary.downloadConverterOutput}
        onInputChange={yamlLibrary.setConverterInput}
        onLoadSample={yamlLibrary.loadConverterSample}
        onModeChange={yamlLibrary.changeConverterMode}
        output={yamlLibrary.converterOutput}
      />

      <UploadedYamlSection
        copiedId={yamlLibrary.copiedId}
        files={yamlLibrary.files}
        onCopy={(item) => yamlLibrary.copyText(item.id, item.content)}
        onDownload={yamlLibrary.downloadUploadedFile}
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
