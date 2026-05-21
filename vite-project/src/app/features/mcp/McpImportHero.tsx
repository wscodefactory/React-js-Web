import { Button, Card, CardContent, FormField, Input, SectionHeader } from '../../components/common';
import type { ImportedSource } from './types';

type McpImportHeroProps = {
  error: string;
  importUrl: string;
  importedSource: ImportedSource | null;
  onImport: () => void;
  onImportUrlChange: (value: string) => void;
};

export function McpImportHero({
  error,
  importUrl,
  importedSource,
  onImport,
  onImportUrlChange,
}: McpImportHeroProps) {
  return (
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
            onChange={(event) => onImportUrlChange(event.target.value)}
            placeholder="Paste an import URL"
          />
        </FormField>
        <Button className="w-full sm:w-auto" onClick={onImport}>
          Import
        </Button>
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
                <p className="card-description">
                  {importedSource.name} from {importedSource.host}
                </p>
              </div>
              <span className="badge badge-success">
                {importedSource.protocol.toUpperCase()} at {importedSource.importedAt}
              </span>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </section>
  );
}
