import { CheckCircle2, Circle, Code2, Database, Download, FileJson, Move, Palette, Settings, Square, Terminal, Upload, Zap } from 'lucide-react';
import type {
  ActivityItem,
  CanvasStatItem,
  ColorScheme,
  MetricItem,
  SelectOption,
  SvgLayerItem,
  SvgToolItem,
  ToolResourceItem,
} from '@/app/types/showcase';

export const logoStyles = [
  'Minimalist',
  'Modern',
  'Vintage',
  'Abstract',
  'Geometric',
  'Hand-drawn',
  'Corporate',
  'Playful',
];

export const colorSchemes: ColorScheme[] = [
  { name: 'Ocean', colors: ['#0EA5E9', '#06B6D4', '#3B82F6'] },
  { name: 'Forest', colors: ['#10B981', '#16A34A', '#059669'] },
  { name: 'Sunset', colors: ['#F59E0B', '#EF4444', '#F97316'] },
  { name: 'Purple', colors: ['#8B5CF6', '#A855F7', '#9333EA'] },
  { name: 'Monochrome', colors: ['#000000', '#6B7280', '#FFFFFF'] },
];

export const powerToolkitMetrics: MetricItem[] = [
  { label: 'Available Tools', value: 24, accent: 'green', icon: Zap },
  { label: 'Categories', value: 6, accent: 'blue', icon: Settings },
  { label: 'Uses Today', value: 156, accent: 'gray', icon: Terminal },
];

export const powerToolkitRecentActivity: ActivityItem[] = [
  { title: 'Code Formatter', detail: '2 minutes ago' },
  { title: 'JSON Validator', detail: '15 minutes ago' },
  { title: 'Data Converter', detail: '1 hour ago' },
];

export const powerToolkitResources: ToolResourceItem[] = [
  { id: 1, icon: Code2, title: 'Code Formatter', description: 'Format and beautify TypeScript code', category: 'Development' },
  { id: 2, icon: Database, title: 'Data Converter', description: 'Convert between different data formats', category: 'Data' },
  { id: 3, icon: FileJson, title: 'JSON Validator', description: 'Validate and format JSON data', category: 'Validation' },
  { id: 4, icon: Terminal, title: 'Command Generator', description: 'Generate common CLI commands', category: 'Development' },
  { id: 5, icon: Settings, title: 'Config Builder', description: 'Build configuration files', category: 'Setup' },
  { id: 6, icon: Zap, title: 'Performance Analyzer', description: 'Analyze code performance', category: 'Optimization' },
];

export const svgEditorTools: SvgToolItem[] = [
  { id: 'select', icon: Move, label: 'Select' },
  { id: 'rectangle', icon: Square, label: 'Rectangle' },
  { id: 'circle', icon: Circle, label: 'Circle' },
  { id: 'pen', icon: Palette, label: 'Pen' },
];

export const svgEditorLayers: SvgLayerItem[] = [
  { id: 1, name: 'Background', visible: true, locked: false },
  { id: 2, name: 'Shape 1', visible: true, locked: false },
  { id: 3, name: 'Shape 2', visible: true, locked: false },
];

export const svgExportFormats: SelectOption[] = [
  { value: 'svg', label: 'SVG' },
  { value: 'png', label: 'PNG' },
  { value: 'jpg', label: 'JPG' },
  { value: 'webp', label: 'WebP' },
];

export const svgQualityOptions: SelectOption[] = [
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

export const svgScaleOptions: SelectOption[] = [
  { value: '1x', label: '1x' },
  { value: '2x', label: '2x' },
  { value: '3x', label: '3x' },
];

export const svgCanvasStats: CanvasStatItem[] = [
  { label: 'Position', value: 'X: 0, Y: 0' },
  { label: 'Size', value: 'W: 0, H: 0' },
  { label: 'Selected', value: 'None' },
  { label: 'Zoom', value: '100%' },
];

export const quickToolOptions: SelectOption[] = [
  { value: 'formatter', label: 'Code Formatter' },
  { value: 'validator', label: 'JSON Validator' },
  { value: 'converter', label: 'Data Converter' },
];

export const quickToolActions = [
  { id: 'clear', label: 'Clear', variant: 'secondary' as const },
  { id: 'process', label: 'Process', variant: 'primary' as const },
];

export const svgActionButtons = [
  { id: 'export', label: 'Export SVG', variant: 'primary' as const, icon: Download },
  { id: 'import', label: 'Import SVG', variant: 'secondary' as const, icon: Upload },
];

export const taskStatusIconMap = {
  completed: CheckCircle2,
  'in-progress': Circle,
  pending: Circle,
} as const;
