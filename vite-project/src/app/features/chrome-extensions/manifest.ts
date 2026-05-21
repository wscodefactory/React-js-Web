import type { ExtensionTemplate } from './types';

export function buildManifest(template: ExtensionTemplate) {
  return JSON.stringify({
    manifest_version: 3,
    name: template.name,
    version: '1.0.0',
    description: template.description,
    action: { default_popup: 'popup.html', default_title: template.name },
    permissions: template.permissions,
  }, null, 2);
}

export function downloadManifest(template: ExtensionTemplate) {
  const blob = new Blob([buildManifest(template)], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = url;
  anchor.download = `${template.id}-manifest.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}
