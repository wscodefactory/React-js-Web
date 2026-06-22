import { UploadedYamlCard } from './UploadedYamlCard';
import { useLanguage } from '../../context/LanguageContext';
import { yamlLibraryText } from '../../i18n';
import type { UploadedYaml } from './types';

type UploadedYamlSectionProps = {
  copiedId: string | null;
  files: UploadedYaml[];
  onCopy: (file: UploadedYaml) => void;
  onDownload: (file: UploadedYaml) => void;
  onRemove: (id: string) => void;
};

export function UploadedYamlSection({
  copiedId,
  files,
  onCopy,
  onDownload,
  onRemove,
}: UploadedYamlSectionProps) {
  const { language } = useLanguage();
  const text = yamlLibraryText[language];

  if (files.length === 0) {
    return null;
  }

  return (
    <section className="mb-10 space-y-4">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{text.uploadedFiles}</h2>
      {files.map((file) => (
        <UploadedYamlCard
          key={file.id}
          copiedId={copiedId}
          file={file}
          onCopy={onCopy}
          onDownload={onDownload}
          onRemove={onRemove}
        />
      ))}
    </section>
  );
}
