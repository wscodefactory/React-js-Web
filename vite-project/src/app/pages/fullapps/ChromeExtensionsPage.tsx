import { useMemo, useState } from 'react';
import { PageIntro } from '../../components/showcase/PageIntro';
import {
  BuildChecklist,
  ExtensionDetailPanel,
  FileList,
  ImplementationNotes,
  ManifestPanel,
  TemplateSelector,
  buildExtensionScaffold,
  extensionTemplates,
  type PreviewTheme,
} from '../../features/chrome-extensions';

export function ChromeExtensionsPage() {
  const [selectedId, setSelectedId] = useState(extensionTemplates[0].id);
  const [theme, setTheme] = useState<PreviewTheme>('light');
  const [notesOpen, setNotesOpen] = useState(false);
  const selectedTemplate = extensionTemplates.find((template) => template.id === selectedId) ?? extensionTemplates[0];
  const scaffoldFiles = useMemo(() => buildExtensionScaffold(selectedTemplate), [selectedTemplate]);

  return (
    <main className="p-4 md:p-8">
      <PageIntro highlight="Chrome" title="Extensions" description="Plan browser-extension templates with reusable React sections, typed data, and clean implementation previews." />

      <div className="grid gap-6 xl:grid-cols-[300px_1fr]">
        <aside className="space-y-4">
          <TemplateSelector selectedId={selectedId} onSelect={setSelectedId} />
          <BuildChecklist templateId={selectedTemplate.id} templateName={selectedTemplate.name} />
        </aside>

        <section className="space-y-6">
          <ExtensionDetailPanel
            notesOpen={notesOpen}
            onNotesOpenChange={setNotesOpen}
            onThemeChange={setTheme}
            template={selectedTemplate}
            theme={theme}
          />

          {notesOpen ? <ImplementationNotes template={selectedTemplate} /> : null}

          <div className="grid gap-6 lg:grid-cols-2">
            <ManifestPanel template={selectedTemplate} />
            <FileList bundleName={`${selectedTemplate.name} scaffold`} files={scaffoldFiles} />
          </div>
        </section>
      </div>
    </main>
  );
}
