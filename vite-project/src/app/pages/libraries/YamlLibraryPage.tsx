import { Copy, Download, FileCode, Upload } from 'lucide-react';
import { Card, CardContent, CardHeader, Button } from '@/app/components/common';
import { PageIntro } from '@/app/components/showcase/PageIntro';
import { yamlExamples, yamlFeatures } from '@/app/data/showcase';

export function YamlLibraryPage() {
  return (
    <div className="p-4 md:p-8 space-y-8">
      <PageIntro
        highlight="YAML"
        title="Library"
        description="Parse, validate, and generate YAML configurations with ease"
      />

      <ActionBar />
      <FeaturePanel />
      <ExamplesPanel />
    </div>
  );
}

function ActionBar() {
  return (
    <div className="flex flex-wrap gap-3">
      <Button className="gap-2">
        <Upload className="w-4 h-4" />
        Upload YAML
      </Button>
      <Button variant="secondary" className="gap-2">
        <Download className="w-4 h-4" />
        Download
      </Button>
      <Button variant="secondary" className="gap-2">
        <FileCode className="w-4 h-4" />
        New Template
      </Button>
    </div>
  );
}

function FeaturePanel() {
  return (
    <Card>
      <CardHeader title="Features" description="Core capabilities packaged as reusable YAML workflows." />
      <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {yamlFeatures.map((feature) => (
          <div key={feature.id} className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-600 dark:bg-green-400" />
            <span className="text-gray-700 dark:text-gray-300">{feature.label}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function ExamplesPanel() {
  return (
    <section>
      <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Example Templates</h2>
      <div className="space-y-4">
        {yamlExamples.map((example) => (
          <Card key={example.id}>
            <CardHeader
              title={example.title}
              description={example.description}
              badge={
                <button className="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700">
                  <Copy className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
              }
            />
            <CardContent>
              <pre className="overflow-x-auto rounded-lg bg-gray-50 p-4 dark:bg-gray-900">
                <code className="text-sm text-gray-800 dark:text-gray-200">{example.code}</code>
              </pre>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
