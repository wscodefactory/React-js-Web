import type { LogoGeneratorCopy, LogoStyle } from './types';

export function getLocalizedOptionLabel(copy: LogoGeneratorCopy, label: string) {
  if (label === 'Primary') {
    return copy.optionLabels.primary;
  }

  const variant = Number(label.replace('Variation ', ''));
  return Number.isFinite(variant) ? copy.optionLabels.variation(variant) : label;
}

export function slugifyFileName(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9\uac00-\ud7a3]+/gi, '-').replace(/^-|-$/g, '') || 'logo';
}

function escapeSvgText(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function createLogoSvg(brandName: string, style: LogoStyle, colors: [string, string, string], variant = 0) {
  const initial = escapeSvgText((brandName.trim()[0] ?? 'L').toUpperCase());
  const [primary, secondary, soft] = colors;

  const templates: Record<LogoStyle, string> = {
    Minimal: `<circle cx="100" cy="100" r="58" fill="none" stroke="${primary}" stroke-width="5"/><text x="100" y="121" text-anchor="middle" font-family="Inter, Arial" font-size="58" font-weight="700" fill="${primary}">${initial}</text>`,
    Modern: `<rect x="42" y="42" width="116" height="116" rx="30" fill="${primary}"/><path d="M70 126 L100 66 L130 126" fill="none" stroke="white" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/><circle cx="100" cy="100" r="14" fill="${secondary}"/>`,
    Geometric: `<path d="M100 34 L158 76 L136 146 H64 L42 76 Z" fill="${soft}" stroke="${primary}" stroke-width="7"/><path d="M100 62 L126 100 L100 138 L74 100 Z" fill="${secondary}"/><text x="100" y="111" text-anchor="middle" font-family="Inter, Arial" font-size="34" font-weight="800" fill="white">${initial}</text>`,
    Badge: `<rect x="38" y="52" width="124" height="96" rx="22" fill="${primary}"/><circle cx="100" cy="100" r="34" fill="${soft}"/><text x="100" y="113" text-anchor="middle" font-family="Inter, Arial" font-size="38" font-weight="800" fill="${primary}">${initial}</text>`,
  };

  const rotation = variant * 8;
  return `<svg width="240" height="240" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><g transform="rotate(${rotation} 100 100)">${templates[style]}</g></svg>`;
}

export function downloadSvgAsset(svg: string, fileName: string) {
  const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${slugifyFileName(fileName)}.svg`;
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

export async function downloadPngAsset(svg: string, fileName: string, outputSize = 1024) {
  const svgUrl = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }));

  try {
    const image = new Image();
    const loaded = new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error('Unable to render SVG preview.'));
    });

    image.src = svgUrl;
    await loaded;

    const canvas = document.createElement('canvas');
    canvas.width = outputSize;
    canvas.height = outputSize;
    const context = canvas.getContext('2d');

    if (!context) {
      throw new Error('Canvas is not available.');
    }

    context.clearRect(0, 0, outputSize, outputSize);
    context.drawImage(image, 0, 0, outputSize, outputSize);

    const pngBlob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
          return;
        }

        reject(new Error('PNG export failed.'));
      }, 'image/png');
    });

    const pngUrl = URL.createObjectURL(pngBlob);
    const anchor = document.createElement('a');
    anchor.href = pngUrl;
    anchor.download = `${slugifyFileName(fileName)}.png`;
    anchor.click();
    URL.revokeObjectURL(pngUrl);
  } finally {
    URL.revokeObjectURL(svgUrl);
  }
}
