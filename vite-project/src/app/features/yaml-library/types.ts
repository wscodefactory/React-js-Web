export type UploadedYaml = {
  id: string;
  name: string;
  content: string;
};

export type YamlTemplate = {
  id: string;
  title: string;
  description: string;
  code: string;
};

export type ConverterMode = 'yaml-to-json' | 'json-to-yaml';
