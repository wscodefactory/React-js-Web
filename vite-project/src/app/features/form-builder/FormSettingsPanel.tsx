import { Card, CardContent, CardHeader, FormField, Input } from '../../components/common';
import { useLanguage } from '../../context/LanguageContext';
import { formBuilderCopy } from './copy';

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
  const { language } = useLanguage();
  const text = formBuilderCopy[language].settings;

  return (
    <Card>
      <CardHeader title={text.title} description={text.description} />
      <CardContent className="space-y-4">
        <FormField label={text.formName}>
          <Input type="text" value={formName} onChange={(event) => onFormNameChange(event.target.value)} />
        </FormField>
        <FormField label={text.submitText}>
          <Input type="text" value={submitText} onChange={(event) => onSubmitTextChange(event.target.value)} />
        </FormField>
        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <input type="checkbox" checked={showLabels} onChange={(event) => onShowLabelsChange(event.target.checked)} className="rounded border-gray-300 dark:border-gray-600" />
          {text.showLabels}
        </label>
      </CardContent>
    </Card>
  );
}
