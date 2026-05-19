import type { supportedPlatforms } from './data';

export type PlatformId = (typeof supportedPlatforms)[number]['id'];
export type SupportedPlatform = (typeof supportedPlatforms)[number];

export type ImportedSource = {
  id: string;
  name: string;
  host: string;
  protocol: string;
  url: string;
  platform: PlatformId;
  importedAt: string;
};

export type ParsedImportUrl = {
  valid: boolean;
  name: string;
  host: string;
  protocol: string;
  href: string;
};
