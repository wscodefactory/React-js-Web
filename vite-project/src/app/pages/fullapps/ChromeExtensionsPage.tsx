import { useMemo, useState } from 'react';
import { CheckCircle, Circle, Code2, Copy, Download, ExternalLink, Moon, Plus, Search, Sun } from 'lucide-react';
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

type PreviewNote = {
  id: number;
  title: string;
  body: string;
  pinned: boolean;
};

const notes: PreviewNote[] = [
  { id: 1, title: 'Research notes', body: 'Summarize sources before the meeting.', pinned: true },
  { id: 2, title: 'Code review', body: 'Check route handling and empty states.', pinned: false },
  { id: 3, title: 'Release checklist', body: 'Build, typecheck, and verify permissions.', pinned: true },
  { id: 4, title: 'Ideas', body: 'Add command palette shortcuts.', pinned: false },
];

const checklistItems = [
  'Define permissions',
  'Create popup UI',
  'Connect storage',
  'Run browser test',
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
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'All' | 'Pinned' | 'Recent'>('All');
  const [items, setItems] = useState<PreviewNote[]>(notes);
  const [status, setStatus] = useState('Popup preview ready.');

  const filteredNotes = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return items.filter((note) => {
      const matchesQuery = !normalizedQuery || `${note.title} ${note.body}`.toLowerCase().includes(normalizedQuery);
      const matchesTab = activeTab === 'All' || (activeTab === 'Pinned' ? note.pinned : note.id > notes.length);
      return matchesQuery && matchesTab;
    });
  }, [activeTab, items, query]);

  const addNote = () => {
    const nextNote = {
      id: Math.max(0, ...items.map((note) => note.id)) + 1,
      title: `New note ${items.length + 1}`,
      body: 'Drafted from the popup preview.',
      pinned: false,
    };
    setItems((current) => [nextNote, ...current]);
    setActiveTab('Recent');
    setQuery('');
    setStatus(`${nextNote.title} added.`);
  };

  return (
    <div className={`mx-auto w-full max-w-sm overflow-hidden rounded-3xl border shadow-xl ${isDark ? 'border-gray-700 bg-gray-950' : 'border-gray-200 bg-white'}`}>
      <div className="p-4">
        <label className={`mb-3 flex items-center gap-2 rounded-xl px-3 py-2 ${isDark ? 'bg-gray-900 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
          <Search className="h-4 w-4" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search notes"
            className={`w-full bg-transparent text-sm outline-none placeholder:text-gray-400 ${isDark ? 'text-white' : 'text-gray-900'}`}
          />
        </label>
        <div className="mb-3 flex gap-2">
          {(['All', 'Pinned', 'Recent'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-full px-3 py-1 text-xs ${activeTab === tab ? 'bg-green-600 text-white' : isDark ? 'bg-gray-900 text-gray-400' : 'bg-gray-100 text-gray-600'}`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="space-y-2">
          {filteredNotes.map((note) => (
            <article key={note.title} className={`rounded-2xl border p-3 ${isDark ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-gray-50'}`}>
              <div className="flex items-start justify-between gap-2">
                <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{note.title}</h3>
                {note.pinned ? <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] text-green-700">Pinned</span> : null}
              </div>
              <p className="text-xs text-gray-500">{note.body}</p>
            </article>
          ))}
          {filteredNotes.length === 0 ? (
            <div className={`rounded-2xl border p-4 text-center text-xs ${isDark ? 'border-gray-800 text-gray-500' : 'border-gray-200 text-gray-500'}`}>
              No notes match this view.
            </div>
          ) : null}
        </div>
        <p className="mt-3 text-xs text-gray-500">{status}</p>
      </div>
      <div className="flex justify-end p-4 pt-0">
        <button type="button" onClick={addNote} className="flex h-10 w-10 items-center justify-center rounded-full bg-green-600 text-white shadow-lg" aria-label="Add preview note"><Plus className="h-5 w-5" /></button>
      </div>
    </div>
  );
}

function TemplateSelector({ selectedId, onSelect }: { selectedId: string; onSelect: (id: string) => void }) {
  return (
    <div className="space-y-3">
      {templates.map((template) => (
        <button key={template.id} type="button" onClick={() => onSelect(template.id)} className={`w-full rounded-2xl border p-4 text-left transition ${selectedId === template.id ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-gray-200 bg-white hover:border-green-300 dark:border-gray-700 dark:bg-gray-800'}`}>
          <span className="mb-1 block text-sm font-semibold text-gray-900 dark:text-white">{template.name}</span>
          <span className="block text-xs text-gray-500 dark:text-gray-400">{template.category}</span>
        </button>
      ))}
    </div>
  );
}

function BuildChecklist() {
  const [completedItems, setCompletedItems] = useState<string[]>([]);
  const completedCount = completedItems.length;
  const progress = Math.round((completedCount / checklistItems.length) * 100);

  const toggleItem = (item: string) => {
    setCompletedItems((current) => current.includes(item) ? current.filter((entry) => entry !== item) : [...current, item]);
  };

  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-white">Build checklist</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{completedCount} of {checklistItems.length} complete</p>
          </div>
          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-300">{progress}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-900">
          <div className="h-full rounded-full bg-green-600 transition-all" style={{ width: `${progress}%` }} />
        </div>
        <div className="space-y-2">
          {checklistItems.map((item) => {
            const done = completedItems.includes(item);
            return (
              <button
                key={item}
                type="button"
                onClick={() => toggleItem(item)}
                className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm transition ${done ? 'bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-300' : 'bg-gray-50 text-gray-600 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800'}`}
              >
                {done ? <CheckCircle className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                {item}
              </button>
            );
          })}
        </div>
        {completedCount > 0 ? (
          <Button variant="secondary" onClick={() => setCompletedItems([])} className="w-full justify-center">Reset checklist</Button>
        ) : null}
      </CardContent>
    </Card>
  );
}

function ManifestPanel({ template }: { template: ExtensionTemplate }) {
  const manifest = useMemo(() => buildManifest(template), [template]);
  const [copied, setCopied] = useState(false);

  const copyManifest = async () => {
    await navigator.clipboard.writeText(manifest);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };

  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Manifest preview</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Generated from the selected template data.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={copyManifest} aria-label={`Copy ${template.name} manifest`} className="inline-flex items-center justify-center gap-2 whitespace-nowrap">
              {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Copied' : 'Copy'}
            </Button>
            <Button variant="secondary" onClick={() => downloadManifest(template)} className="inline-flex items-center justify-center gap-2 whitespace-nowrap"><Download className="h-4 w-4" /> JSON</Button>
          </div>
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
  const [notesOpen, setNotesOpen] = useState(false);
  const selectedTemplate = templates.find((template) => template.id === selectedId) ?? templates[0];

  return (
    <main className="p-4 md:p-8">
      <PageIntro highlight="Chrome" title="Extensions" description="Plan browser-extension templates with reusable React sections, typed data, and clean implementation previews." />

      <div className="grid gap-6 xl:grid-cols-[300px_1fr]">
        <aside className="space-y-4">
          <TemplateSelector selectedId={selectedId} onSelect={setSelectedId} />
          <BuildChecklist />
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
                <Button variant="secondary" onClick={() => setNotesOpen((current) => !current)}>
                  <ExternalLink className="h-4 w-4" />
                  {notesOpen ? 'Hide implementation notes' : 'Open implementation notes'}
                </Button>
              </div>
              <div>
                <div className="mb-3 flex justify-end gap-2">
                  <Button variant={theme === 'light' ? 'primary' : 'secondary'} onClick={() => setTheme('light')} aria-label="Preview light theme"><Sun className="h-4 w-4" /></Button>
                  <Button variant={theme === 'dark' ? 'primary' : 'secondary'} onClick={() => setTheme('dark')} aria-label="Preview dark theme"><Moon className="h-4 w-4" /></Button>
                </div>
                <PopupPreview theme={theme} />
              </div>
            </CardContent>
          </Card>

          {notesOpen ? (
            <Card>
              <CardContent className="grid gap-4 md:grid-cols-3">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Storage</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Persist template data with the {selectedTemplate.permissions.includes('storage') ? 'declared storage permission' : 'selected permissions'}.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Popup</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Use the preview shell as the first popup route and connect list actions next.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Testing</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Load the unpacked folder, verify permissions, then run a popup interaction pass.</p>
                </div>
              </CardContent>
            </Card>
          ) : null}

          <div className="grid gap-6 lg:grid-cols-2">
            <ManifestPanel template={selectedTemplate} />
            <FileList template={selectedTemplate} />
          </div>
        </section>
      </div>
    </main>
  );
}
