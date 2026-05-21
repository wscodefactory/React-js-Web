import { Code2 } from 'lucide-react';
import { Card, CardContent } from '../../components/common';
import type { ExtensionTemplate } from './types';

type FileListProps = {
  template: ExtensionTemplate;
};

export function FileList({ template }: FileListProps) {
  return (
    <Card>
      <CardContent className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Suggested structure</h2>
        <div className="space-y-2">
          {template.files.map((file) => (
            <div key={file} className="flex items-center gap-3 rounded-xl bg-gray-50 px-3 py-2 text-sm text-gray-700 dark:bg-gray-900 dark:text-gray-300">
              <Code2 className="h-4 w-4 text-green-600" /> {file}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
