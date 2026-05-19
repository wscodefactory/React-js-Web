import type { ExportFormat, ExportQuality, ExportScale } from './types';

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}

export async function exportAsset(svgMarkup: string, format: ExportFormat, scale: ExportScale, quality: ExportQuality) {
  if (format === 'svg') {
    downloadBlob(new Blob([svgMarkup], { type: 'image/svg+xml;charset=utf-8' }), 'canvas-export.svg');
    return;
  }

  const scaleValue = Number(scale.replace('x', ''));
  const svgBlob = new Blob([svgMarkup], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);
  const image = new Image();
  image.src = url;

  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error('Could not render SVG for export.'));
  });

  const canvas = document.createElement('canvas');
  canvas.width = 800 * scaleValue;
  canvas.height = 600 * scaleValue;
  const context = canvas.getContext('2d');

  if (!context) {
    URL.revokeObjectURL(url);
    throw new Error('Canvas export is not supported in this browser.');
  }

  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  URL.revokeObjectURL(url);

  const qualityValue = quality === 'high' ? 0.95 : quality === 'medium' ? 0.75 : 0.55;
  const mimeType = format === 'jpg' ? 'image/jpeg' : `image/${format}`;
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, mimeType, qualityValue));

  if (!blob) {
    throw new Error('Export failed.');
  }

  downloadBlob(blob, `canvas-export.${format}`);
}
