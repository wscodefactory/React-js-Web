import { Card, CardContent } from '../../components/common';
import type { ExtensionTemplate } from './types';

type ImplementationNotesProps = {
  template: ExtensionTemplate;
};

export function ImplementationNotes({ template }: ImplementationNotesProps) {
  return (
    <Card>
      <CardContent className="grid gap-4 md:grid-cols-3">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">Storage</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Persist template data with the {template.permissions.includes('storage') ? 'declared storage permission' : 'selected permissions'}.
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">Popup</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Use the preview shell as the first popup route and connect list actions next.
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">Testing</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Load the unpacked folder, verify permissions, then run a popup interaction pass.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
