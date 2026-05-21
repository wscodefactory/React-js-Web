import { MetricGrid } from '@/app/components/showcase/MetricGrid';
import { PageIntro } from '@/app/components/showcase/PageIntro';
import {
  BuilderActions,
  ExportCodePanel,
  FieldTypePanel,
  FormCanvasPanel,
  FormSettingsPanel,
  useFormBuilderController,
} from '@/app/features/form-builder';

export function FormBuilderPage() {
  const formBuilder = useFormBuilderController();

  return (
    <div className="space-y-6 p-4 md:p-8">
      <PageIntro
        highlight="Form"
        title="Builder"
        description="Create custom forms with drag-and-drop simplicity"
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-1">
          <FieldTypePanel
            selectedType={formBuilder.selectedType}
            onAddField={formBuilder.addField}
            onSelectType={formBuilder.setSelectedType}
          />
          <FormSettingsPanel
            formName={formBuilder.formName}
            submitText={formBuilder.submitText}
            showLabels={formBuilder.showLabels}
            onFormNameChange={formBuilder.setFormName}
            onSubmitTextChange={formBuilder.setSubmitText}
            onShowLabelsChange={formBuilder.setShowLabels}
          />
          <BuilderActions
            mode={formBuilder.mode}
            onModeChange={formBuilder.setMode}
            onReset={formBuilder.resetFields}
          />
        </div>

        <div className="space-y-6 lg:col-span-2">
          {formBuilder.mode === 'code' ? (
            <ExportCodePanel code={formBuilder.exportCode} />
          ) : (
            <FormCanvasPanel
              fields={formBuilder.fields}
              formName={formBuilder.formName}
              submitText={formBuilder.submitText}
              showLabels={formBuilder.showLabels}
              isPreview={formBuilder.mode === 'preview'}
              submitStatus={formBuilder.submitStatus}
              onAddField={() => formBuilder.addField()}
              onDuplicateField={formBuilder.duplicateField}
              onMoveField={formBuilder.moveField}
              onRemoveField={formBuilder.removeField}
              onSubmit={formBuilder.submitForm}
              onToggleRequired={formBuilder.toggleRequired}
              onUpdateFieldLabel={formBuilder.updateFieldLabel}
            />
          )}
          <MetricGrid items={formBuilder.metrics} columnsClassName="grid-cols-3" />
        </div>
      </div>
    </div>
  );
}
