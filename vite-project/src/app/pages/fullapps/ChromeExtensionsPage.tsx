import { useMemo, useState } from 'react';
import { CheckCircle, Code2, Download, ExternalLink, Moon, Plus, Search, Sun } from 'lucide-react';
import { Button, Card, CardContent } from '../../components/common';
import { PageIntro } from '../../components/showcase/PageIntro';

export type PreviewTheme = 'light' | 'dark';
export type ExtensionTemplate = {
  id: string;
  name: string;
  category: string;
  description: string;
  permissions: string[];
  files: string[];
};

const templates: ExtensionTemplate[] = [
  {
    id: 'notes',
    name: 'Quick Notes Extension',
    category: 'Productivity',
    description: 'Popup-based note capture with local storage and keyboard-friendly controls.',
    permissions: ['storage'],
    files: ['manifest.json', 'popup.html', 'popup.js', 'styles.css'],
  },
  {
    id: 'tabs',
    name: 'Tab Organizer Extension',
    category: 'Browser utility',
    description: 'Group open tabs, search sessions, and restore selected workspaces.',
    permissions: ['tabs', 'storage'],
    files: ['manifest.json', 'popup.html', 'background.js', 'styles.css'],
  },
  {
    id: 'links',
    name: 'Quick Links Extension',
    category: 'Navigation',
    description: 'Pinned shortcut panel for frequently used dashboards and docs.',
    permissions: ['storage'],
    files: ['manifest.json', 'popup.html', 'popup.js', 'icons/icon.svg'],
  },
];

const notes = [
  { title: 'Research notes', body: 'Summarize sources before the meeting.' },
  { title: 'Code review', body: 'Check route handling and empty states.' },
  { title: 'Release checklist', body: 'Build, typecheck, and verify permissions.' },
  { title: 'Ideas', body: 'Add command palette shortcuts.' },
];

function buildManifest(template: ExtensionTemplate) {
  return JSON.stringify({
    manifest_version: 3,
    name: template.name,
    version: '1.0.0',
    description: template.description,
    action: { default_popup: 'popup.html', default_title: template.name },
    permissions: template.permissions,
  }, null, 2);
}

function downloadManifest(template: ExtensionTemplate) {
  const blob = new Blob([buildManifest(template)], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${template.id}-manifest.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}

function PopupPreview({ theme }: { theme: PreviewTheme }) {
  const isDark = theme === 'dark';
  return (
    <div className={`mx-auto w-full max-w-sm overflow-hidden rounded-3xl border shadow-xl ${isDark ? 'border-gray-700 bg-gray-950' : 'border-gray-200 bg-white'}`}>
      <div className="p-4">
        <div className={`mb-3 flex items-center gap-2 rounded-xl px-3 py-2 ${isDark ? 'bg-gray-900 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
          <Search className="h-4 w-4" />
          <span className="text-sm">Search notes</span>
        </div>
        <div className="mb-3 flex gap-2">
          {['All', 'Pinned', 'Recent'].map((tab, index) => (
            <span key={tab} className={`rounded-full px-3 py-1 text-xs ${index === 0 ? 'bg-green-600 text-white' : isDark ? 'bg-gray-900 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>{tab}</span>
          ))}
        </div>
        <div className="space-y-2">
          {notes.map((note) => (
            <article key={note.title} className={`rounded-2xl border p-3 ${isDark ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-gray-50'}`}>
              <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{note.title}</h3>
              <p className="text-xs text-gray-500">{note.body}</p>
            </article>
          ))}
        </div>
      </div>
      <button className="absolute hidden" aria-hidden="true" />
      <div className="flex justify-end p-4 pt-0">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green-600 text-white shadow-lg"><Plus className="h-5 w-5" /></span>
      </div>
    </div>
  );
}

function TemplateSelector({ selectedId, onSelect }: { selectedId: string; onSelect: (id: string) => void }) {
  return (
    <div className="space-y-3">
      {templates.map((template) => (
        <button key={template.id} onClick={() => onSelect(template.id)} className={`w-full rounded-2xl border p-4 text-left transition ${selectedId === template.id ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-gray-200 bg-white hover:border-green-300 dark:border-gray-700 dark:bg-gray-800'}`}>
          <span className="mb-1 block text-sm font-semibold text-gray-900 dark:text-white">{template.name}</span>
          <span className="block text-xs text-gray-500 dark:text-gray-400">{template.category}</span>
        </button>
      ))}
    </div>
  );
}

function ManifestPanel({ template }: { template: ExtensionTemplate }) {
  const manifest = useMemo(() => buildManifest(template), [template]);
  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Manifest preview</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Generated from the selected template data.</p>
          </div>
          <Button variant="secondary" onClick={() => downloadManifest(template)}><Download className="h-4 w-4" /> JSON</Button>
        </div>
        <pre className="max-h-80 overflow-auto rounded-xl bg-gray-950 p-4 text-sm text-gray-100"><code>{manifest}</code></pre>
      </CardContent>
    </Card>
  );
}

function FileList({ template }: { template: ExtensionTemplate }) {
  return (
    <Card>
      <CardContent className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Suggested structure</h2>
        <div className="space-y-2">
          {template.files.map((file) => (
            <div key={file} className="flex items-center gap-3 rounded-xl bg-gray-50 px-3 py-2 text-sm text-gray-700 dark:bg-gray-900 dark:text-gray-300">
              <Code2 className="h-4 w-4 text-green-600" /> {file}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function ChromeExtensionsPage() {
  const [selectedId, setSelectedId] = useState(templates[0].id);
  const [theme, setTheme] = useState<PreviewTheme>('light');
  const selectedTemplate = templates.find((template) => template.id === selectedId) ?? templates[0];

  return (
    <main className="p-4 md:p-8">
      <PageIntro highlight="Chrome" title="Extensions" description="Plan browser-extension templates with reusable React sections, typed data, and clean implementation previews." />

      <div className="grid gap-6 xl:grid-cols-[300px_1fr]">
        <aside className="space-y-4">
          <TemplateSelector selectedId={selectedId} onSelect={setSelectedId} />
          <Card>
            <CardContent className="space-y-3">
              <h2 className="font-semibold text-gray-900 dark:text-white">Build checklist</h2>
              {['Define permissions', 'Create popup UI', 'Connect storage', 'Run browser test'].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"><CheckCircle className="h-4 w-4 text-green-600" /> {item}</div>
              ))}
            </CardContent>
          </Card>
        </aside>

        <section className="space-y-6">
          <Card>
            <CardContent className="grid gap-6 lg:grid-cols-[1fr_360px]">
              <div className="space-y-4">
                <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-300">{selectedTemplate.category}</span>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">{selectedTemplate.name}</h2>
                <p className="text-gray-600 dark:text-gray-400">{selectedTemplate.description}</p>
                <div className="flex flex-wrap gap-2">
                  {selectedTemplate.permissions.map((permission) => <span key={permission} className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600 dark:bg-gray-900 dark:text-gray-300">{permission}</span>)}
                </div>
                <Button variant="secondary"><ExternalLink className="h-4 w-4" /> Open implementation notes</Button>
              </div>
              <div>
                <div className="mb-3 flex justify-end gap-2">
                  <Button variant={theme === 'light' ? 'primary' : 'secondary'} onClick={() => setTheme('light')}><Sun className="h-4 w-4" /></Button>
                  <Button variant={theme === 'dark' ? 'primary' : 'secondary'} onClick={() => setTheme('dark')}><Moon className="h-4 w-4" /></Button>
                </div>
                <PopupPreview theme={theme} />
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            <ManifestPanel template={selectedTemplate} />
            <FileList template={selectedTemplate} />
          </div>
        </section>
      </div>
    </main>
  );
}
