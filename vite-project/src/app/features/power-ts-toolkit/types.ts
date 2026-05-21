export type QuickToolValue = 'formatter' | 'validator' | 'converter' | 'command' | 'config' | 'performance' | 'powerfx';
export type ConversionTarget = 'react' | 'javascript';

export type ToolProcessResult = {
  status: string;
  output: string;
};
