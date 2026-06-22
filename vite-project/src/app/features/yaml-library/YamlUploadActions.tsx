import type { ChangeEvent, Ref, RefObject } from 'react';
import { Download, Trash2, Upload } from 'lucide-react';
import { Button } from '../../components/common';
import { useLanguage } from '../../context/LanguageContext';
import { yamlLibraryText } from '../../i18n';

type YamlUploadActionsProps = {
  filesCount: number;
  inputRef: RefObject<HTMLInputElement | null>;
  onClearUploads: () => void;
  onDownloadUploads: () => void;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

export function YamlUploadActions({
  filesCount,
  inputRef,
  onClearUploads,
  onDownloadUploads,
  onFileChange,
}: YamlUploadActionsProps) {
  const { language } = useLanguage();
  const text = yamlLibraryText[language];

  return (
    <div className="mb-8 flex flex-wrap gap-3">
      <input ref={inputRef as Ref<HTMLInputElement>} type="file" accept=".yml,.yaml,text/yaml,text/plain" multiple onChange={onFileChange} className="hidden" />
      <Button onClick={() => inputRef.current?.click()}>
        <Upload className="h-4 w-4" /> {text.uploadYaml}
      </Button>
      {filesCount > 0 ? (
        <>
          <Button variant="secondary" onClick={onDownloadUploads}>
            <Download className="h-4 w-4" /> {text.downloadAll}
          </Button>
          <Button variant="secondary" onClick={onClearUploads}>
            <Trash2 className="h-4 w-4" /> {text.clearUploads}
          </Button>
        </>
      ) : null}
    </div>
  );
}
