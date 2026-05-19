import { useMemo, useRef, useState } from 'react';
import { ArrowLeftRight, Check, Copy, FileCode, Search, SearchX, Trash2, Upload, X } from 'lucide-react';
import { Button, Card, CardContent } from '../../components/common';
import { PageIntro } from '../../components/showcase/PageIntro';

export type UploadedYaml = { id: string; name: string; content: string };
export type Template = { id: string; title: string; description: string; code: string };
type ConverterMode = 'yaml-to-json' | 'json-to-yaml';

const templates: Template[] = [
  {
    id: 'app-config',
    title: 'Application config',
    description: 'Environment, feature flags, and API endpoints.',
    code: `app:
  name: storefront
  version: 1.0.0
api:
  baseUrl: https://api.example.com
features:
  analytics: true
  betaCheckout: false`,
  },
  {
    id: 'docker-compose',
    title: 'Docker Compose service',
    description: 'Small web and database stack for local development.',
    code: `services:
  web:
    image: nginx:latest
    ports:
      - "8080:80"
  database:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: local`,
  },
  {
    id: 'github-action',
    title: 'GitHub Actions workflow',
    description: 'Install dependencies, typecheck, and build on push.',
    code: `name: build
on:
  push:
    branches: [main]
jobs:
  web:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run build`,
  },
];

function getLineCount(value: string) {
  return value.split('\n').length;
}

function parseScalar(value: string) {
  const trimmed = value.trim();
  if (trimmed === 'true') return true;
  if (trimmed === 'false') return false;
  if (trimmed === 'null') return null;
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) return Number(trimmed);
  return trimmed.replace(/^["']|["']$/g, '');
}

function splitYamlKeyValue(value: string) {
  const separatorIndex = value.indexOf(':');
  if (separatorIndex === -1) return [value.trim(), ''] as const;
  return [value.slice(0, separatorIndex).trim(), value.slice(separatorIndex + 1).trim()] as const;
}

function parseYamlBlock(lines: Array<{ indent: number; text: string }>, startIndex: number, indent: number): [unknown, number] {
  const firstLine = lines[startIndex];
  const isArray = firstLine?.indent === indent && firstLine.text.startsWith('- ');

  if (isArray) {
    const result: unknown[] = [];
    let index = startIndex;

    while (index < lines.length && lines[index].indent === indent && lines[index].text.startsWith('- ')) {
      const itemText = lines[index].text.slice(2).trim();
      if (!itemText) {
        const [nested, nextIndex] = parseYamlBlock(lines, index + 1, indent + 2);
        result.push(nested);
        index = nextIndex;
        continue;
      }

      if (itemText.includes(':')) {
        const [key, rawValue] = splitYamlKeyValue(itemText);
        const item: Record<string, unknown> = { [key]: rawValue ? parseScalar(rawValue) : {} };
        index += 1;

        if (index < lines.length && lines[index].indent > indent) {
          const [nested, nextIndex] = parseYamlBlock(lines, index, indent + 2);
          if (typeof nested === 'object' && nested && !Array.isArray(nested)) {
            Object.assign(item, nested);
          }
          index = nextIndex;
        }

        result.push(item);
        continue;
      }

      result.push(parseScalar(itemText));
      index += 1;
    }

    return [result, index];
  }

  const result: Record<string, unknown> = {};
  let index = startIndex;

  while (index < lines.length && lines[index].indent >= indent) {
    const line = lines[index];
    if (line.indent > indent || line.text.startsWith('- ')) break;

    const [key, rawValue] = splitYamlKeyValue(line.text);
    if (!key) {
      index += 1;
      continue;
    }

    if (rawValue) {
      result[key] = parseScalar(rawValue);
      index += 1;
      continue;
    }

    if (index + 1 < lines.length && lines[index + 1].indent > indent) {
      const [nested, nextIndex] = parseYamlBlock(lines, index + 1, lines[index + 1].indent);
      result[key] = nested;
      index = nextIndex;
    } else {
      result[key] = {};
      index += 1;
    }
  }

  return [result, index];
}

function yamlToJson(input: string) {
  const lines = input
    .split('\n')
    .map((line) => ({ indent: line.match(/^\s*/)?.[0].length ?? 0, text: line.trim() }))
    .filter((line) => line.text && !line.text.startsWith('#'));

  if (lines.length === 0) {
    throw new Error('Add YAML content before converting.');
  }

  const [parsed] = parseYamlBlock(lines, 0, lines[0].indent);
  return JSON.stringify(parsed, null, 2);
}

function formatYamlScalar(value: unknown) {
  if (typeof value === 'string') {
    return /[:#\n]|^\s|\s$/.test(value) ? JSON.stringify(value) : value;
  }

  return String(value);
}

function jsonToYaml(value: unknown, indent = 0): string {
  const space = ' '.repeat(indent);

  if (Array.isArray(value)) {
    return value.map((item) => {
      if (item && typeof item === 'object') {
        return `${space}-\n${jsonToYaml(item, indent + 2)}`;
      }

      return `${space}- ${formatYamlScalar(item)}`;
    }).join('\n');
  }

  if (value && typeof value === 'object') {
    return Object.entries(value as Record<string, unknown>).map(([key, entry]) => {
      if (entry && typeof entry === 'object') {
        return `${space}${key}:\n${jsonToYaml(entry, indent + 2)}`;
      }

      return `${space}${key}: ${formatYamlScalar(entry)}`;
    }).join('\n');
  }

  return `${space}${formatYamlScalar(value)}`;
}

function TemplateCard({ template, onCopy, copiedId }: { template: Template; onCopy: (template: Template) => void; copiedId: string | null }) {
  const copied = copiedId === template.id;
  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{template.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{template.description}</p>
          </div>
          <Button variant="secondary" onClick={() => onCopy(template)} aria-label={`Copy ${template.title}`}>
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
        <pre className="max-h-64 overflow-auto rounded-xl bg-gray-950 p-4 text-sm text-gray-100"><code>{template.code}</code></pre>
      </CardContent>
    </Card>
  );
}

function UploadedYamlCard({ file, onRemove, onCopy, copiedId }: { file: UploadedYaml; onRemove: (id: string) => void; onCopy: (file: UploadedYaml) => void; copiedId: string | null }) {
  const copied = copiedId === file.id;
  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{file.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{getLineCount(file.content)} lines imported</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => onCopy(file)} aria-label={`Copy ${file.name}`}>{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}</Button>
            <Button variant="secondary" onClick={() => onRemove(file.id)} aria-label={`Remove ${file.name}`}><X className="h-4 w-4" /></Button>
          </div>
        </div>
        <pre className="max-h-72 overflow-auto rounded-xl bg-gray-50 p-4 text-sm text-gray-800 dark:bg-gray-900 dark:text-gray-200"><code>{file.content}</code></pre>
      </CardContent>
    </Card>
  );
}

export function YamlLibraryPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<UploadedYaml[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [templateQuery, setTemplateQuery] = useState('');
  const [converterMode, setConverterMode] = useState<ConverterMode>('yaml-to-json');
  const [converterInput, setConverterInput] = useState(templates[0].code);
  const [converterOutput, setConverterOutput] = useState('');
  const [status, setStatus] = useState('Upload YAML files or copy a starter template.');

  const visibleTemplates = useMemo(() => {
    const query = templateQuery.trim().toLowerCase();
    if (!query) return templates;
    return templates.filter((template) => `${template.title} ${template.description} ${template.code}`.toLowerCase().includes(query));
  }, [templateQuery]);

  const copyText = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setStatus('YAML copied to clipboard.');
      window.setTimeout(() => setCopiedId(null), 1400);
    } catch {
      setStatus('Clipboard access was blocked by the browser.');
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? []);
    if (selectedFiles.length === 0) {
      return;
    }

    selectedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const content = String(reader.result ?? '');
        setFiles((current) => [
          { id: `${file.name}-${file.lastModified}`, name: file.name, content },
          ...current.filter((item) => item.id !== `${file.name}-${file.lastModified}`),
        ]);
        setStatus(`${file.name} imported with ${getLineCount(content)} lines.`);
      };
      reader.readAsText(file, 'UTF-8');
    });
    event.target.value = '';
  };

  const removeFile = (id: string) => {
    setFiles((current) => current.filter((file) => file.id !== id));
    setStatus('Uploaded YAML removed.');
  };

  const clearUploads = () => {
    setFiles([]);
    setStatus('Uploaded YAML list cleared.');
  };

  const handleConvert = () => {
    try {
      const output = converterMode === 'yaml-to-json'
        ? yamlToJson(converterInput)
        : jsonToYaml(JSON.parse(converterInput));

      setConverterOutput(output);
      setStatus(converterMode === 'yaml-to-json' ? 'YAML converted to JSON.' : 'JSON converted to YAML.');
    } catch (error) {
      setConverterOutput('');
      setStatus(error instanceof Error ? error.message : 'Conversion failed.');
    }
  };

  const loadConverterSample = () => {
    if (converterMode === 'yaml-to-json') {
      setConverterInput(templates[0].code);
      setConverterOutput('');
      setStatus('YAML sample loaded.');
      return;
    }

    setConverterInput(JSON.stringify({ app: { name: 'storefront', version: '1.0.0' }, features: { analytics: true } }, null, 2));
    setConverterOutput('');
    setStatus('JSON sample loaded.');
  };

  return (
    <main className="p-4 md:p-8">
      <PageIntro highlight="YAML" title="Library" description="Upload, preview, and reuse configuration snippets in a React-friendly asset library." />

      <section className="mb-8 grid gap-4 md:grid-cols-3">
        {['Typed upload state', 'Reusable template cards', 'Clipboard feedback'].map((item) => (
          <Card key={item}><CardContent className="flex items-center gap-3"><FileCode className="h-5 w-5 text-green-600" /><span className="font-medium text-gray-900 dark:text-white">{item}</span></CardContent></Card>
        ))}
      </section>

      <div className="mb-8 flex flex-wrap gap-3">
        <input ref={inputRef} type="file" accept=".yml,.yaml,text/yaml,text/plain" multiple onChange={handleFileChange} className="hidden" />
        <Button onClick={() => inputRef.current?.click()}><Upload className="h-4 w-4" /> Upload YAML</Button>
        {files.length > 0 ? (
          <Button variant="secondary" onClick={clearUploads}><Trash2 className="h-4 w-4" /> Clear uploads</Button>
        ) : null}
      </div>

      <p className="mb-6 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-300">{status}</p>

      <Card className="mb-10">
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">YAML / JSON Converter</h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Convert common YAML maps and arrays into JSON, or format JSON back into YAML.</p>
            </div>
            <select
              value={converterMode}
              onChange={(event) => {
                setConverterMode(event.target.value as ConverterMode);
                setConverterOutput('');
              }}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              aria-label="Converter mode"
            >
              <option value="yaml-to-json">YAML to JSON</option>
              <option value="json-to-yaml">JSON to YAML</option>
            </select>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <textarea
                value={converterInput}
                onChange={(event) => setConverterInput(event.target.value)}
                className="h-64 w-full rounded-xl border border-gray-300 bg-gray-50 p-4 font-mono text-sm text-gray-900 outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                placeholder={converterMode === 'yaml-to-json' ? 'Paste YAML here' : 'Paste JSON here'}
              />
              <div className="mt-3 flex flex-wrap justify-end gap-2">
                <Button variant="secondary" onClick={loadConverterSample}>Load sample</Button>
                <Button onClick={handleConvert}><ArrowLeftRight className="h-4 w-4" /> Convert</Button>
              </div>
            </div>

            <div>
              <pre className="h-64 overflow-auto rounded-xl bg-gray-950 p-4 text-sm text-gray-100">
                <code>{converterOutput || 'Converted output will appear here.'}</code>
              </pre>
              <div className="mt-3 flex justify-end">
                <Button variant="secondary" onClick={() => copyText('converter-output', converterOutput)} disabled={!converterOutput}>
                  {copiedId === 'converter-output' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  Copy output
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {files.length > 0 && (
        <section className="mb-10 space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Uploaded files</h2>
          {files.map((file) => (
            <UploadedYamlCard key={file.id} file={file} copiedId={copiedId} onCopy={(item) => copyText(item.id, item.content)} onRemove={removeFile} />
          ))}
        </section>
      )}

      <section className="space-y-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Starter templates</h2>
          <label className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={templateQuery}
              onChange={(event) => setTemplateQuery(event.target.value)}
              placeholder="Search templates"
              className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            />
          </label>
        </div>
        {visibleTemplates.length > 0 ? (
          <div className="grid gap-4 lg:grid-cols-3">
            {visibleTemplates.map((template) => <TemplateCard key={template.id} template={template} copiedId={copiedId} onCopy={(item) => copyText(item.id, item.code)} />)}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <SearchX className="mb-4 h-10 w-10 text-gray-400" />
              <h3 className="font-semibold text-gray-900 dark:text-white">No templates found</h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Clear the query to see all starter templates.</p>
              <Button variant="secondary" onClick={() => setTemplateQuery('')} className="mt-5">Clear search</Button>
            </CardContent>
          </Card>
        )}
      </section>
    </main>
  );
}
