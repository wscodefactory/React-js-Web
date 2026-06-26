import { Button, Card, CardContent, FormField, Input, SectionHeader } from '../../components/common';
import { useLanguage } from '../../context/LanguageContext';
import { mcpCopy } from './copy';
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
  const { language } = useLanguage();
  const text = mcpCopy[language].hero;

  return (
    <section className="mx-auto max-w-3xl space-y-6 text-center">
      <SectionHeader
        title={text.title}
        titleHighlight={text.titleHighlight}
        description={text.description}
      />

      <div className="flex flex-col items-end justify-center gap-3 sm:flex-row">
        <FormField label={text.importUrl} className="w-full text-left sm:flex-1">
          <Input
            type="text"
            value={importUrl}
            onChange={(event) => onImportUrlChange(event.target.value)}
            placeholder={text.placeholder}
          />
        </FormField>
        <Button className="w-full sm:w-auto" onClick={onImport}>
          {text.importButton}
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
                <h2 className="card-title">{text.sourceTitle}</h2>
                <p className="card-description">
                  {text.sourceFrom(importedSource.name, importedSource.host)}
                </p>
              </div>
              <span className="badge badge-success">
                {text.importedAt(importedSource.protocol, importedSource.importedAt)}
              </span>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </section>
  );
}
