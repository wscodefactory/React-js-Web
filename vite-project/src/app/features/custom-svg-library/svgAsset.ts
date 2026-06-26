import { lucideSvgPaths } from './data';
import type { IconAsset } from './types';

export function createLucideSvgAsset(name: string, color: string, size: number) {
  const paths = lucideSvgPaths[name];
  if (!paths) {
    return '';
  }

  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;
}

export function sanitizeSvgMarkup(content: string) {
  const parser = new DOMParser();
  const parsedDocument = parser.parseFromString(content, 'image/svg+xml');
  const root = parsedDocument.querySelector('svg');

  if (!root || parsedDocument.querySelector('parsererror')) {
    return '';
  }

  root.querySelectorAll('script, foreignObject').forEach((node) => node.remove());
  root.querySelectorAll('*').forEach((node) => {
    Array.from(node.attributes).forEach((attribute) => {
      if (attribute.name.toLowerCase().startsWith('on')) {
        node.removeAttribute(attribute.name);
      }
    });
  });

  root.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  return new XMLSerializer().serializeToString(root);
}

export function getAssetSvg(asset: IconAsset, color: string, size: number) {
  return asset.svg ?? createLucideSvgAsset(asset.name, color, size);
}

export function downloadSvgText(content: string, fileName: string) {
  const blob = new Blob([content], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function downloadBlobAsset(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function slugifyAssetName(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
