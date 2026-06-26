import { useEffect, useMemo, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { copyTextToClipboard } from '../../utils/clipboard';
import { supportedPlatforms } from './data';
import { parseImportUrl } from './importUrl';
import { getLocalizedPlatform, mcpCopy } from './copy';
import { readStoredImportHistory, saveStoredImportHistory } from './importHistoryStorage';
import { downloadJsonFile, slugifyPackageName } from './packageExport';
import type { ImportedSource, McpManifest, McpPackage, PlatformId } from './types';

export function useMcpImportController() {
  const { language } = useLanguage();
  const text = mcpCopy[language];
  const [importUrl, setImportUrl] = useState('https://github.com/wscodefactory/React-js-Web');
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformId>('canvas');
  const [importedSource, setImportedSource] = useState<ImportedSource | null>(null);
  const [importHistory, setImportHistory] = useState<ImportedSource[]>(() => readStoredImportHistory());
  const [copied, setCopied] = useState(false);
  const [copyStatus, setCopyStatus] = useState(text.status.manifestReady);
  const [error, setError] = useState('');

  useEffect(() => {
    saveStoredImportHistory(importHistory);
  }, [importHistory]);

  const parsedUrl = useMemo(() => parseImportUrl(importUrl), [importUrl]);
  const selectedPlatformInfo = useMemo(
    () => getLocalizedPlatform(language, supportedPlatforms.find((platform) => platform.id === selectedPlatform) ?? supportedPlatforms[0]),
    [language, selectedPlatform],
  );

  const manifest = useMemo<McpManifest>(() => {
    const source = importedSource ?? {
      name: parsedUrl.name || text.status.pendingSource,
      host: parsedUrl.host || text.status.pendingHost,
      protocol: parsedUrl.protocol || 'https',
      url: parsedUrl.href || importUrl,
      platform: selectedPlatform,
      importedAt: text.status.notImported,
    };

    return {
      assets: selectedPlatformInfo.assets,
      importedAt: source.importedAt,
      name: source.name,
      platform: selectedPlatformInfo.label,
      source: source.url,
      status: selectedPlatformInfo.status,
    };
  }, [importUrl, importedSource, parsedUrl.href, parsedUrl.host, parsedUrl.name, parsedUrl.protocol, selectedPlatform, selectedPlatformInfo, text.status.notImported, text.status.pendingHost, text.status.pendingSource]);
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
          text.checklist.review(importedSource.name),
          text.checklist.mapAssets(selectedPlatformInfo.label),
          text.checklist.verify,
          text.checklist.publish,
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
    setCopyStatus(text.status.metadataUpdated);
  };

  const selectPlatform = (platform: PlatformId) => {
    setSelectedPlatform(platform);
    setCopied(false);
    setCopyStatus(text.status.metadataUpdated);
  };

  const handleImport = () => {
    if (!parsedUrl.valid) {
      setError(text.status.invalidUrl);
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
      importedAt: new Date().toLocaleTimeString(language === 'ko' ? 'ko-KR' : 'en-US', { hour: '2-digit', minute: '2-digit' }),
    };

    setError('');
    setCopied(false);
    setCopyStatus(text.status.metadataUpdated);
    setImportedSource(nextSource);
    setImportHistory((current) => [
      nextSource,
      ...current.filter((item) => `${item.protocol}-${item.host}-${item.name}` !== `${nextSource.protocol}-${nextSource.host}-${nextSource.name}`),
    ].slice(0, 4));
  };

  const copyManifest = async () => {
    const wasCopied = await copyTextToClipboard(manifestPreview);
    setCopied(wasCopied);
    setCopyStatus(wasCopied ? text.status.copied : text.status.copyFailed);
  };

  const downloadPackage = () => {
    const packagePayload = buildPackage();

    if (!packagePayload) {
      setCopyStatus(text.status.importFirst);
      return;
    }

    downloadJsonFile(JSON.stringify(packagePayload, null, 2), `${slugifyPackageName(`${packagePayload.source.name}-${selectedPlatformInfo.id}`)}.mcp-package.json`);
    setCopyStatus(text.status.packageReady);
  };

  const restoreImport = (source: ImportedSource) => {
    setImportedSource(source);
    setImportUrl(source.url);
    setSelectedPlatform(source.platform);
    setCopied(false);
    setCopyStatus(text.status.metadataRestored);
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
    setCopyStatus(text.status.historyCleared);
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
