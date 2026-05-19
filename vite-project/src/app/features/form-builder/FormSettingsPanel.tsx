import { Card, CardContent, CardHeader, FormField, Input } from '../../components/common';

type FormSettingsPanelProps = {
  formName: string;
  onFormNameChange: (value: string) => void;
  onShowLabelsChange: (value: boolean) => void;
  onSubmitTextChange: (value: string) => void;
  showLabels: boolean;
  submitText: string;
};

export function FormSettingsPanel({
  formName,
  onFormNameChange,
  onShowLabelsChange,
  onSubmitTextChange,
  showLabels,
  submitText,
}: FormSettingsPanelProps) {
  return (
    <Card>
      <CardHeader title="Form Settings" description="Configure the base behavior before publishing." />
      <CardContent className="space-y-4">
        <FormField label="Form Name">
          <Input type="text" value={formName} onChange={(event) => onFormNameChange(event.target.value)} />
        </FormField>
        <FormField label="Submit Button Text">
          <Input type="text" value={submitText} onChange={(event) => onSubmitTextChange(event.target.value)} />
        </FormField>
        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <input type="checkbox" checked={showLabels} onChange={(event) => onShowLabelsChange(event.target.checked)} className="rounded border-gray-300 dark:border-gray-600" />
          Show field labels
        </label>
      </CardContent>
    </Card>
  );
}
