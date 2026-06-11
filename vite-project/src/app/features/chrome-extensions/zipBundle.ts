import { createZipBlob as createTextZipBlob } from '@/app/utils/zip';
import type { ExtensionScaffoldFile } from './scaffold';

export function createZipBlob(files: ExtensionScaffoldFile[]) {
  return createTextZipBlob(files);
}
