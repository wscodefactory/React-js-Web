import { Code, Eye, RotateCcw } from 'lucide-react';
import { Button } from '../../components/common';
import type { BuilderMode } from './types';

type BuilderActionsProps = {
  mode: BuilderMode;
  onModeChange: (mode: BuilderMode) => void;
  onReset: () => void;
};

export function BuilderActions({
  mode,
  onModeChange,
  onReset,
}: BuilderActionsProps) {
  return (
    <div className="space-y-2">
      <Button variant={mode === 'preview' ? 'primary' : 'secondary'} className="w-full justify-center gap-2" onClick={() => onModeChange(mode === 'preview' ? 'build' : 'preview')}>
        <Eye className="h-4 w-4" />
        {mode === 'preview' ? 'Edit Form' : 'Preview Form'}
      </Button>
      <Button variant={mode === 'code' ? 'primary' : 'secondary'} className="w-full justify-center gap-2" onClick={() => onModeChange(mode === 'code' ? 'build' : 'code')}>
        <Code className="h-4 w-4" />
        {mode === 'code' ? 'Back to Builder' : 'Export Code'}
      </Button>
      <Button variant="secondary" className="w-full justify-center gap-2" onClick={onReset}>
        <RotateCcw className="h-4 w-4" />
        Reset Builder
      </Button>
    </div>
  );
}
