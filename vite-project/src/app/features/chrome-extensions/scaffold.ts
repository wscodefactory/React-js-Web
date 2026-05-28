import { buildManifest } from './manifest';
import type { ExtensionTemplate } from './types';

export type ExtensionScaffoldFile = {
  path: string;
  language: string;
  content: string;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildPopupHtml(template: ExtensionTemplate) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(template.name)}</title>
    <link rel="stylesheet" href="./styles.css" />
  </head>
  <body>
    <main class="popup-shell">
      <header class="popup-header">
        <span class="eyebrow">${escapeHtml(template.category)}</span>
        <h1>${escapeHtml(template.name)}</h1>
      </header>
      <section id="app" class="content-list" aria-live="polite"></section>
      <footer class="popup-footer">
        <button id="primaryAction" type="button">Add item</button>
      </footer>
    </main>
    <script src="./popup.js" type="module"></script>
  </body>
</html>`;
}

function buildPopupJs(template: ExtensionTemplate) {
  if (template.id === 'tabs') {
    return `const app = document.querySelector('#app');
const action = document.querySelector('#primaryAction');

const sessions = [
  { title: 'Design review', detail: '5 tabs grouped for handoff' },
  { title: 'Build checks', detail: 'Docs, CI, and preview links' },
  { title: 'Research set', detail: 'Sources saved for tomorrow' },
];

function render() {
  app.innerHTML = sessions
    .map((item) => \`<article class="list-item"><strong>\${item.title}</strong><span>\${item.detail}</span></article>\`)
    .join('');
}

action.addEventListener('click', () => {
  sessions.unshift({ title: \`Workspace \${sessions.length + 1}\`, detail: 'New tab group draft' });
  render();
});

render();`;
  }

  if (template.id === 'links') {
    return `const app = document.querySelector('#app');
const action = document.querySelector('#primaryAction');

const links = [
  { title: 'Admin dashboard', detail: 'https://example.com/admin' },
  { title: 'Design system', detail: 'https://example.com/design' },
  { title: 'Release notes', detail: 'https://example.com/releases' },
];

function render() {
  app.innerHTML = links
    .map((item) => \`<a class="list-item" href="\${item.detail}" target="_blank" rel="noreferrer"><strong>\${item.title}</strong><span>\${item.detail}</span></a>\`)
    .join('');
}

action.addEventListener('click', () => {
  links.unshift({ title: \`Shortcut \${links.length + 1}\`, detail: 'https://example.com/new' });
  render();
});

render();`;
  }

  return `const app = document.querySelector('#app');
const action = document.querySelector('#primaryAction');

const notes = [
  { title: 'Research notes', detail: 'Summarize sources before the meeting.' },
  { title: 'Code review', detail: 'Check route handling and empty states.' },
  { title: 'Release checklist', detail: 'Build, typecheck, and verify permissions.' },
];

function render() {
  app.innerHTML = notes
    .map((item) => \`<article class="list-item"><strong>\${item.title}</strong><span>\${item.detail}</span></article>\`)
    .join('');
}

action.addEventListener('click', () => {
  notes.unshift({ title: \`Note \${notes.length + 1}\`, detail: 'Drafted from the extension popup.' });
  render();
});

render();`;
}

function buildStylesCss() {
  return `:root {
  color-scheme: light;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

body {
  width: 360px;
  margin: 0;
  background: #f8fafc;
  color: #111827;
}

.popup-shell {
  display: grid;
  gap: 16px;
  padding: 18px;
}

.popup-header {
  display: grid;
  gap: 6px;
}

.eyebrow {
  color: #16a34a;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
}

h1 {
  margin: 0;
  font-size: 20px;
}

.content-list {
  display: grid;
  gap: 10px;
}

.list-item {
  display: grid;
  gap: 4px;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  background: #ffffff;
  padding: 12px;
  color: inherit;
  text-decoration: none;
}

.list-item span {
  color: #6b7280;
  font-size: 12px;
}

.popup-footer {
  display: flex;
  justify-content: flex-end;
}

button {
  border: 0;
  border-radius: 999px;
  background: #16a34a;
  color: #ffffff;
  cursor: pointer;
  font-weight: 700;
  padding: 10px 14px;
}`;
}

function buildBackgroundJs(template: ExtensionTemplate) {
  return `chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    templateId: '${template.id}',
    installedAt: new Date().toISOString(),
  });
});`;
}

function buildIconSvg(template: ExtensionTemplate) {
  const initial = escapeHtml(template.name.trim()[0] ?? 'E');

  return `<svg width="128" height="128" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
  <rect width="128" height="128" rx="28" fill="#16a34a" />
  <text x="64" y="82" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="58" font-weight="800" fill="#ffffff">${initial}</text>
</svg>`;
}

function buildFallbackFile(filePath: string, template: ExtensionTemplate) {
  return `// ${filePath}
// Generated starter file for ${template.name}.`;
}

function getLanguage(filePath: string) {
  if (filePath.endsWith('.json')) return 'json';
  if (filePath.endsWith('.html')) return 'html';
  if (filePath.endsWith('.css')) return 'css';
  if (filePath.endsWith('.svg')) return 'svg';
  if (filePath.endsWith('.js')) return 'javascript';
  return 'text';
}

function buildFileContent(filePath: string, template: ExtensionTemplate) {
  switch (filePath) {
    case 'manifest.json':
      return buildManifest(template);
    case 'popup.html':
      return buildPopupHtml(template);
    case 'popup.js':
      return buildPopupJs(template);
    case 'styles.css':
      return buildStylesCss();
    case 'background.js':
      return buildBackgroundJs(template);
    case 'icons/icon.svg':
      return buildIconSvg(template);
    default:
      return buildFallbackFile(filePath, template);
  }
}

export function buildExtensionScaffold(template: ExtensionTemplate): ExtensionScaffoldFile[] {
  return template.files.map((filePath) => ({
    path: filePath,
    language: getLanguage(filePath),
    content: buildFileContent(filePath, template),
  }));
}
