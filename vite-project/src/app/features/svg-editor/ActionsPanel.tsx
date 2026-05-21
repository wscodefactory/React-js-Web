import { Download, Upload } from 'lucide-react';
import { Button } from '../../components/common';

type ActionsPanelProps = {
  onExport: () => void;
  onImportClick: () => void;
};

export function ActionsPanel({
  onExport,
  onImportClick,
}: ActionsPanelProps) {
  return (
    <div className="space-y-2">
      <Button onClick={onExport} className="flex w-full items-center justify-center gap-2">
        <Download className="icon-sm" />
        Export SVG
      </Button>
      <Button variant="secondary" onClick={onImportClick} className="flex w-full items-center justify-center gap-2">
        <Upload className="icon-sm" />
        Import SVG
      </Button>
    </div>
  );
}
