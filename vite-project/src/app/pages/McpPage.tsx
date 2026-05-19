/**
 * Route page reserved for MCP-related content.
 * Structured sections and typed feature data make the page read like an app surface, not static HTML.
 */
import { useMemo, useState } from 'react';
import { CheckCircle2, Copy, History, PackageCheck, ShieldCheck } from 'lucide-react';
import { Button, Card, CardContent, FormField, Input, SectionHeader } from '../components/common';
import { mcpFeatures } from '../data/catalog';

const supportedPlatforms = [
  {
    id: 'canvas',
    label: 'Canvas',
    status: 'Design-ready',
    description: 'Package reusable canvas patterns and component notes.',
    assets: ['Screen schema', 'Theme tokens', 'Usage notes'],
  },
  {
    id: 'ui-library',
    label: 'UI Library',
    status: 'Component-ready',
    description: 'Publish preview metadata, examples, and implementation status.',
    assets: ['Component manifest', 'Preview entries', 'Variant map'],
  },
  {
    id: 'github',
    label: 'GitHub',
    status: 'Source-ready',
    description: 'Track external source repositories before library publishing.',
    assets: ['Repository URL', 'Import summary', 'Review checklist'],
  },
] as const;

type PlatformId = (typeof supportedPlatforms)[number]['id'];

type ImportedSource = {
  id: string;
  name: string;
  host: string;
  protocol: string;
  url: string;
  platform: PlatformId;
  importedAt: string;
};

function parseImportUrl(value: string) {
  try {
    const url = new URL(value);
    const protocol = url.protocol.replace(':', '');
    const validProtocol = protocol === 'https' || protocol === 'file';
    const name = url.pathname.split('/').filter(Boolean).pop() || url.hostname || 'local-file';

    return {
      valid: validProtocol,
      name,
      host: url.hostname || 'local file',
      protocol,
      href: url.href,
    };
  } catch {
    return {
      valid: false,
      name: '',
      host: '',
      protocol: '',
      href: '',
    };
  }
}

export function McpPage() {
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

  return (
    <div className="container-page space-y-section">
      <section className="mx-auto max-w-3xl space-y-6 text-center">
        <SectionHeader
          title="MCP"
          titleHighlight="PowerLibs"
          description="Build and share a component library platform for Power Apps style workflows, with a community-driven distribution model."
        />

        <div className="flex flex-col items-end justify-center gap-3 sm:flex-row">
          <FormField label="Import URL" className="w-full text-left sm:flex-1">
            <Input
              type="text"
              value={importUrl}
              onChange={(event) => {
                setImportUrl(event.target.value);
                setCopied(false);
              }}
              placeholder="Paste an import URL"
            />
          </FormField>
          <Button className="w-full sm:w-auto" onClick={handleImport}>Import</Button>
        </div>

        {error ? (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-300">{error}</p>
        ) : null}

        {importedSource ? (
          <Card>
            <CardContent className="text-left">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="card-title">Imported Source</h2>
                  <p className="card-description">{importedSource.name} from {importedSource.host}</p>
                </div>
                <span className="badge badge-success">{importedSource.protocol.toUpperCase()} at {importedSource.importedAt}</span>
              </div>
            </CardContent>
          </Card>
        ) : null}
      </section>

      <Card>
        <CardContent className="space-y-3">
          <h2 className="card-title">What is MCP?</h2>
          <p className="card-description">
            MCP gives teams a single place to publish, discover, version, and reuse component knowledge. It works like a curated registry for app building blocks.
          </p>
        </CardContent>
      </Card>

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">What MCP helps you do</h2>
          <p className="text-muted mt-1">Build, govern, and distribute reusable assets with a clearer delivery workflow.</p>
        </div>
        <div className="grid-auto">
          {mcpFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} className="h-full">
                <CardContent className="space-y-3">
                  <Icon className="h-8 w-8 text-green-600 dark:text-green-400" />
                  <h3 className="card-title">{feature.title}</h3>
                  <p className="card-description">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <Card>
        <CardContent className="space-y-4">
          <h2 className="card-title">Works with</h2>
          <div className="grid gap-3 md:grid-cols-3">
            {supportedPlatforms.map((platform) => (
              <button
                key={platform.id}
                type="button"
                onClick={() => {
                  setSelectedPlatform(platform.id);
                  setCopied(false);
                }}
                className={[
                  'rounded-lg border p-4 text-left transition',
                  selectedPlatform === platform.id
                    ? 'border-green-500 bg-green-50 shadow-sm dark:border-green-500 dark:bg-green-950/30'
                    : 'border-gray-200 bg-white hover:border-green-300 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-green-700',
                ].join(' ')}
              >
                <span className="flex items-center justify-between gap-3">
                  <span className="font-semibold text-gray-900 dark:text-white">{platform.label}</span>
                  {selectedPlatform === platform.id ? <CheckCircle2 className="h-5 w-5 text-green-600" /> : <ShieldCheck className="h-5 w-5 text-gray-400" />}
                </span>
                <span className="mt-2 block text-sm text-gray-500 dark:text-gray-400">{platform.description}</span>
                <span className="mt-3 inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                  {platform.status}
                </span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
        <Card>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="card-title">Manifest Preview</h2>
                <p className="card-description">{selectedPlatformInfo.label} package metadata</p>
              </div>
              <Button variant="secondary" onClick={copyManifest} className="shrink-0 whitespace-nowrap">
                <span className="inline-flex items-center gap-2 whitespace-nowrap">
                  {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? 'Copied' : 'Copy'}
                </span>
              </Button>
            </div>
            <pre className="max-h-80 overflow-auto rounded-lg bg-gray-950 p-4 text-sm text-gray-100">
              <code>{manifestPreview}</code>
            </pre>
            <div className="grid gap-2 sm:grid-cols-3">
              {selectedPlatformInfo.assets.map((asset) => (
                <div key={asset} className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-700 dark:bg-gray-900 dark:text-gray-300">
                  <PackageCheck className="h-4 w-4 text-green-600" />
                  {asset}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <History className="h-5 w-5 text-green-600" />
              <h2 className="card-title">Import History</h2>
            </div>
            {importHistory.length > 0 ? (
              <div className="space-y-3">
                {importHistory.map((item) => {
                  const platform = supportedPlatforms.find((entry) => entry.id === item.platform) ?? supportedPlatforms[0];

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setImportedSource(item);
                        setSelectedPlatform(item.platform);
                        setCopied(false);
                      }}
                      className="w-full rounded-lg border border-gray-200 bg-white p-3 text-left transition hover:border-green-300 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-green-700"
                    >
                      <span className="block font-medium text-gray-900 dark:text-white">{item.name}</span>
                      <span className="mt-1 block text-sm text-gray-500 dark:text-gray-400">{platform.label} / {item.importedAt}</span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-gray-300 p-4 text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
                No imports yet.
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
