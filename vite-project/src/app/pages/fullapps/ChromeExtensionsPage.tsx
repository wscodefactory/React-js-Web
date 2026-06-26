import { useMemo, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { PageIntro } from '../../components/showcase/PageIntro';
import {
  BuildChecklist,
  ExtensionDetailPanel,
  FileList,
  ImplementationNotes,
  ManifestPanel,
  TemplateSelector,
  buildExtensionScaffold,
  chromeExtensionText,
  extensionTemplates,
  getExtensionTemplateCopy,
  type PreviewTheme,
} from '../../features/chrome-extensions';

export function ChromeExtensionsPage() {
  const { language } = useLanguage();
  const text = chromeExtensionText[language];
  const [selectedId, setSelectedId] = useState(extensionTemplates[0].id);
  const [theme, setTheme] = useState<PreviewTheme>('light');
  const [notesOpen, setNotesOpen] = useState(false);
  const selectedTemplate = extensionTemplates.find((template) => template.id === selectedId) ?? extensionTemplates[0];
  const displayTemplate = useMemo(() => getExtensionTemplateCopy(language, selectedTemplate), [language, selectedTemplate]);
  const scaffoldFiles = useMemo(() => buildExtensionScaffold(displayTemplate), [displayTemplate]);

  return (
    <main className="min-w-0 max-w-full overflow-x-hidden p-4 md:p-8">
      <PageIntro highlight={text.page.highlight} title={text.page.title} description={text.page.description} />

      <div className="grid min-w-0 gap-6 2xl:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="min-w-0 space-y-4">
          <TemplateSelector selectedId={selectedId} onSelect={setSelectedId} />
          <BuildChecklist templateId={selectedTemplate.id} templateName={displayTemplate.name} />
        </aside>

        <section className="min-w-0 space-y-6">
          <ExtensionDetailPanel
            notesOpen={notesOpen}
            onNotesOpenChange={setNotesOpen}
            onThemeChange={setTheme}
            template={displayTemplate}
            theme={theme}
          />

          {notesOpen ? <ImplementationNotes template={displayTemplate} /> : null}

          <div className="grid min-w-0 gap-6 2xl:grid-cols-2">
            <ManifestPanel template={displayTemplate} />
            <FileList bundleName={`${displayTemplate.name} starter`} files={scaffoldFiles} />
          </div>
        </section>
      </div>
    </main>
  );
}
