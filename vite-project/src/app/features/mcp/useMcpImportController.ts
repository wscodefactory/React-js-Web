import { useEffect, useMemo, useState } from 'react';
import { copyTextToClipboard } from '../../utils/clipboard';
import { supportedPlatforms } from './data';
import { parseImportUrl } from './importUrl';
import type { ImportedSource, McpManifest, McpPackage, PlatformId } from './types';

const importHistoryStorageKey = 'web5:mcp-import-history:v1';

function readStoredImportHistory() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(importHistoryStorageKey) ?? '[]');
    return Array.isArray(parsed) ? parsed.filter((item): item is ImportedSource => (
      item &&
      typeof item.id === 'string' &&
      typeof item.name === 'string' &&
      typeof item.host === 'string' &&
      typeof item.protocol === 'string' &&
      typeof item.url === 'string' &&
      typeof item.importedAt === 'string' &&
      supportedPlatforms.some((platform) => platform.id === item.platform)
    )) : [];
  } catch {
    return [];
  }
}

function downloadText(content: string, fileName: string) {
  const blob = new Blob([content], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}

function slugify(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'mcp-package';
}

export function useMcpImportController() {
  const [importUrl, setImportUrl] = useState('https://github.com/wscodefactory/React-js-Web');
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformId>('canvas');
  const [importedSource, setImportedSource] = useState<ImportedSource | null>(null);
  const [importHistory, setImportHistory] = useState<ImportedSource[]>(() => readStoredImportHistory());
  const [copied, setCopied] = useState(false);
  const [copyStatus, setCopyStatus] = useState('Manifest metadata is ready to copy.');
  const [error, setError] = useState('');

  useEffect(() => {
    window.localStorage.setItem(importHistoryStorageKey, JSON.stringify(importHistory));
  }, [importHistory]);

  const parsedUrl = useMemo(() => parseImportUrl(importUrl), [importUrl]);
  const selectedPlatformInfo = useMemo(
    () => supportedPlatforms.find((platform) => platform.id === selectedPlatform) ?? supportedPlatforms[0],
    [selectedPlatform],
  );

  const manifest = useMemo<McpManifest>(() => {
    const source = importedSource ?? {
      name: parsedUrl.name || 'pending-source',
      host: parsedUrl.host || 'pending-host',
      protocol: parsedUrl.protocol || 'https',
      url: parsedUrl.href || importUrl,
      platform: selectedPlatform,
      importedAt: 'Not imported',
    };

    return {
      assets: selectedPlatformInfo.assets,
      importedAt: source.importedAt,
      name: source.name,
      platform: selectedPlatformInfo.label,
      source: source.url,
      status: selectedPlatformInfo.status,
    };
  }, [importUrl, importedSource, parsedUrl.href, parsedUrl.host, parsedUrl.name, parsedUrl.protocol, selectedPlatform, selectedPlatformInfo]);
  const manifestPreview = useMemo(() => JSON.stringify(manifest, null, 2), [manifest]);

  const buildPackage = (): McpPackage | null => {
    if (!importedSource) {
      return null;
    }

    return {
      history: importHistory,
      install: {
        assets: selectedPlatformInfo.assets,
        checklist: [
          `Review ${importedSource.name} source before publishing.`,
          `Map imported assets to ${selectedPlatformInfo.label}.`,
          'Verify usage notes, permissions, and preview metadata.',
          'Publish the package manifest after review.',
        ],
        target: selectedPlatformInfo.label,
      },
      manifest,
      packageVersion: 1,
      source: importedSource,
    };
  };

  const changeImportUrl = (value: string) => {
    setImportUrl(value);
    setCopied(false);
    setCopyStatus('Manifest metadata updated.');
  };

  const selectPlatform = (platform: PlatformId) => {
    setSelectedPlatform(platform);
    setCopied(false);
    setCopyStatus('Manifest metadata updated.');
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
    setCopyStatus('Manifest metadata updated.');
    setImportedSource(nextSource);
    setImportHistory((current) => [
      nextSource,
      ...current.filter((item) => `${item.protocol}-${item.host}-${item.name}` !== `${nextSource.protocol}-${nextSource.host}-${nextSource.name}`),
    ].slice(0, 4));
  };

  const copyManifest = async () => {
    const wasCopied = await copyTextToClipboard(manifestPreview);
    setCopied(wasCopied);
    setCopyStatus(wasCopied ? 'Manifest copied to clipboard.' : 'Clipboard copy failed. Use JSON download instead.');
  };

  const downloadPackage = () => {
    const packagePayload = buildPackage();

    if (!packagePayload) {
      setCopyStatus('Import a source before downloading an MCP package.');
      return;
    }

    downloadText(JSON.stringify(packagePayload, null, 2), `${slugify(`${packagePayload.source.name}-${selectedPlatformInfo.id}`)}.mcp-package.json`);
    setCopyStatus('MCP package queued for download.');
  };

  const restoreImport = (source: ImportedSource) => {
    setImportedSource(source);
    setImportUrl(source.url);
    setSelectedPlatform(source.platform);
    setCopied(false);
    setCopyStatus('Manifest metadata restored.');
    setError('');
  };

  const removeImportHistoryItem = (id: string) => {
    setImportHistory((current) => current.filter((item) => item.id !== id));

    if (importedSource?.id === id) {
      setImportedSource(null);
    }
  };

  const clearImportHistory = () => {
    setImportHistory([]);
    setImportedSource(null);
    setCopied(false);
    setCopyStatus('Import history cleared.');
  };

  return {
    changeImportUrl,
    clearImportHistory,
    copied,
    copyStatus,
    copyManifest,
    downloadPackage,
    error,
    handleImport,
    importHistory,
    importedSource,
    importUrl,
    manifestPreview,
    removeImportHistoryItem,
    restoreImport,
    selectPlatform,
    selectedPlatform,
    selectedPlatformInfo,
  };
}
