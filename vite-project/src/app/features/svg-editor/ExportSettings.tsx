import { Card, CardContent, FormField, Select } from '../../components/common';
import { useLanguage } from '../../context/LanguageContext';
import { svgExportFormats, svgQualityOptions, svgScaleOptions } from '../../data/showcase';
import { svgEditorCopy } from './copy';
import type { ExportFormat, ExportQuality, ExportScale } from './types';

type ExportSettingsProps = {
  format: ExportFormat;
  onFormatChange: (value: ExportFormat) => void;
  onQualityChange: (value: ExportQuality) => void;
  onScaleChange: (value: ExportScale) => void;
  quality: ExportQuality;
  scale: ExportScale;
};

export function ExportSettings({
  format,
  onFormatChange,
  onQualityChange,
  onScaleChange,
  quality,
  scale,
}: ExportSettingsProps) {
  const { language } = useLanguage();
  const text = svgEditorCopy[language].exportSettings;
  const formatOptions = svgExportFormats.map((option) => ({ ...option, label: text.formatOptions[option.value as ExportFormat] }));
  const qualityOptions = svgQualityOptions.map((option) => ({ ...option, label: text.qualityOptions[option.value as ExportQuality] }));
  const scaleOptions = svgScaleOptions.map((option) => ({ ...option, label: text.scaleOptions[option.value as ExportScale] }));

  return (
    <Card>
      <CardContent>
        <h3 className="card-title">{text.title}</h3>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          <FormField label={text.format}>
            <Select options={formatOptions} value={format} onChange={(event) => onFormatChange(event.target.value as ExportFormat)} />
          </FormField>
          <FormField label={text.quality}>
            <Select options={qualityOptions} value={quality} onChange={(event) => onQualityChange(event.target.value as ExportQuality)} />
          </FormField>
          <FormField label={text.scale}>
            <Select options={scaleOptions} value={scale} onChange={(event) => onScaleChange(event.target.value as ExportScale)} />
          </FormField>
        </div>
      </CardContent>
    </Card>
  );
}
