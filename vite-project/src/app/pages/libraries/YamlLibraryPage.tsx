import { useRef, useState } from 'react';
import { Check, Copy, FileCode, Upload, X } from 'lucide-react';
import { Button, Card, CardContent } from '../../components/common';
import { PageIntro } from '../../components/showcase/PageIntro';

export type UploadedYaml = { id: string; name: string; content: string };
export type Template = { id: string; title: string; description: string; code: string };

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
          <Button variant="secondary" onClick={() => onCopy(template)}>
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
            <Button variant="secondary" onClick={() => onCopy(file)}>{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}</Button>
            <Button variant="secondary" onClick={() => onRemove(file.id)}><X className="h-4 w-4" /></Button>
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

  const copyText = async (id: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    window.setTimeout(() => setCopiedId(null), 1400);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? []);
    selectedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setFiles((current) => [
          ...current,
          { id: `${file.name}-${file.lastModified}`, name: file.name, content: String(reader.result ?? '') },
        ]);
      };
      reader.readAsText(file, 'UTF-8');
    });
    event.target.value = '';
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
      </div>

      {files.length > 0 && (
        <section className="mb-10 space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Uploaded files</h2>
          {files.map((file) => (
            <UploadedYamlCard key={file.id} file={file} copiedId={copiedId} onCopy={(item) => copyText(item.id, item.content)} onRemove={(id) => setFiles((current) => current.filter((file) => file.id !== id))} />
          ))}
        </section>
      )}

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Starter templates</h2>
        <div className="grid gap-4 lg:grid-cols-3">
          {templates.map((template) => <TemplateCard key={template.id} template={template} copiedId={copiedId} onCopy={(item) => copyText(item.id, item.code)} />)}
        </div>
      </section>
    </main>
  );
}
