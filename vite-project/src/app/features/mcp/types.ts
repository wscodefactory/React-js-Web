import type { supportedPlatforms } from './data';

export type PlatformId = (typeof supportedPlatforms)[number]['id'];
export type SupportedPlatform = {
  assets: readonly string[];
  description: string;
  id: PlatformId;
  label: string;
  status: string;
};

export type ImportedSource = {
  id: string;
  name: string;
  host: string;
  protocol: string;
  url: string;
  platform: PlatformId;
  importedAt: string;
};

export type McpManifest = {
  assets: readonly string[];
  importedAt: string;
  name: string;
  platform: string;
  source: string;
  status: string;
};

export type McpPackage = {
  history: ImportedSource[];
  install: {
    assets: readonly string[];
    checklist: string[];
    target: string;
  };
  manifest: McpManifest;
  packageVersion: 1;
  source: ImportedSource;
};

export type ParsedImportUrl = {
  valid: boolean;
  name: string;
  host: string;
  protocol: string;
  href: string;
};
