import { useMemo, useState } from 'react';
import { supportedPlatforms } from './data';
import { parseImportUrl } from './importUrl';
import type { ImportedSource, PlatformId } from './types';

export function useMcpImportController() {
  const [importUrl, setImportUrl] = useState('https://github.com/wscodefactory/React-js-Web');
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformId>('canvas');
  const [importedSource, setImportedSource] = useState<ImportedSource | null>(null);
  const [importHistory, setImportHistory] = useState<ImportedSource[]>([]);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const parsedUrl = useMemo(() => parseImportUrl(importUrl), [importUrl]);
  const selectedPlatformInfo = useMemo(
    () => supportedPlatforms.find((platform) => platform.id === selectedPlatform) ?? supportedPlatforms[0],
    [selectedPlatform],
  );

  const manifestPreview = useMemo(() => {
    const source = importedSource ?? {
      name: parsedUrl.name || 'pending-source',
      host: parsedUrl.host || 'pending-host',
      protocol: parsedUrl.protocol || 'https',
      url: parsedUrl.href || importUrl,
      platform: selectedPlatform,
      importedAt: 'Not imported',
    };

    return JSON.stringify(
      {
        name: source.name,
        source: source.url,
        platform: selectedPlatformInfo.label,
        status: selectedPlatformInfo.status,
        importedAt: source.importedAt,
        assets: selectedPlatformInfo.assets,
      },
      null,
      2,
    );
  }, [importUrl, importedSource, parsedUrl.href, parsedUrl.host, parsedUrl.name, parsedUrl.protocol, selectedPlatform, selectedPlatformInfo]);

  const changeImportUrl = (value: string) => {
    setImportUrl(value);
    setCopied(false);
  };

  const selectPlatform = (platform: PlatformId) => {
    setSelectedPlatform(platform);
    setCopied(false);
  };

  const handleImport = () => {
    if (!parsedUrl.valid) {
      setError('Enter a valid https:// or file URL before importing.');
      setImportedSource(null);
      return;
    }

    const nextSource: ImportedSource = {
      id: `${parsedUrl.protocol}-${parsedUrl.host}-${parsedUrl.name}-${Date.now()}`,
      name: parsedUrl.name,
      host: parsedUrl.host,
      protocol: parsedUrl.protocol,
      url: parsedUrl.href,
      platform: selectedPlatform,
      importedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setError('');
    setCopied(false);
    setImportedSource(nextSource);
    setImportHistory((current) => [
      nextSource,
      ...current.filter((item) => `${item.protocol}-${item.host}-${item.name}` !== `${nextSource.protocol}-${nextSource.host}-${nextSource.name}`),
    ].slice(0, 4));
  };

  const copyManifest = async () => {
    await navigator.clipboard.writeText(manifestPreview);
    setCopied(true);
  };

  const restoreImport = (source: ImportedSource) => {
    setImportedSource(source);
    setSelectedPlatform(source.platform);
    setCopied(false);
  };

  return {
    changeImportUrl,
    copied,
    copyManifest,
    error,
    handleImport,
    importHistory,
    importedSource,
    importUrl,
    manifestPreview,
    restoreImport,
    selectPlatform,
    selectedPlatform,
    selectedPlatformInfo,
  };
}
