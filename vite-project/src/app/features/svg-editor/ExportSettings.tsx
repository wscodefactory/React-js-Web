import { Card, CardContent, FormField, Select } from '../../components/common';
import { svgExportFormats, svgQualityOptions, svgScaleOptions } from '../../data/showcase';
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
  return (
    <Card>
      <CardContent>
        <h3 className="card-title">Export Settings</h3>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          <FormField label="Format">
            <Select options={svgExportFormats} value={format} onChange={(event) => onFormatChange(event.target.value as ExportFormat)} />
          </FormField>
          <FormField label="Quality">
            <Select options={svgQualityOptions} value={quality} onChange={(event) => onQualityChange(event.target.value as ExportQuality)} />
          </FormField>
          <FormField label="Scale">
            <Select options={svgScaleOptions} value={scale} onChange={(event) => onScaleChange(event.target.value as ExportScale)} />
          </FormField>
        </div>
      </CardContent>
    </Card>
  );
}
