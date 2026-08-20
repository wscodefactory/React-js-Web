export function extractExportedFunctionSource(source: string, exportName: string) {
  const functionMarker = `export function ${exportName}`;
  const startIndex = source.indexOf(functionMarker);

  if (startIndex < 0) {
    return '';
  }

  const nextExportIndex = source.indexOf('\nexport ', startIndex + functionMarker.length);
  return source.slice(startIndex, nextExportIndex < 0 ? undefined : nextExportIndex).trim();
}
