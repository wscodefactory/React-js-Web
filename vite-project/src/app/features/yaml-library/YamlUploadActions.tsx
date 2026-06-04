import type { ChangeEvent, Ref, RefObject } from 'react';
import { Download, Trash2, Upload } from 'lucide-react';
import { Button } from '../../components/common';

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
  return (
    <div className="mb-8 flex flex-wrap gap-3">
      <input ref={inputRef as Ref<HTMLInputElement>} type="file" accept=".yml,.yaml,text/yaml,text/plain" multiple onChange={onFileChange} className="hidden" />
      <Button onClick={() => inputRef.current?.click()}>
        <Upload className="h-4 w-4" /> Upload YAML
      </Button>
      {filesCount > 0 ? (
        <>
          <Button variant="secondary" onClick={onDownloadUploads}>
            <Download className="h-4 w-4" /> Download all
          </Button>
          <Button variant="secondary" onClick={onClearUploads}>
            <Trash2 className="h-4 w-4" /> Clear uploads
          </Button>
        </>
      ) : null}
    </div>
  );
}
