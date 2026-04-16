import type { FeatureListItem, MetricItem, SvgLibraryItem, YamlExample } from '@/app/types/showcase';

export const yamlExamples: YamlExample[] = [
  {
    id: 1,
    title: 'Configuration Example',
    description: 'Basic YAML configuration structure',
    code: `name: MyApp\nversion: 1.0.0\nenvironment:\n  production: true\n  debug: false\ndatabase:\n  host: localhost\n  port: 5432\n  name: mydb`,
  },
  {
    id: 2,
    title: 'Docker Compose',
    description: 'Docker service configuration',
    code: `version: '3.8'\nservices:\n  web:\n    image: nginx:latest\n    ports:\n      - "80:80"\n  db:\n    image: postgres:14\n    environment:\n      POSTGRES_PASSWORD: secret`,
  },
  {
    id: 3,
    title: 'CI/CD Pipeline',
    description: 'GitHub Actions workflow',
    code: `name: CI\non: [push, pull_request]\njobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v2\n      - name: Run tests\n        run: npm test`,
  },
];

export const yamlFeatures: FeatureListItem[] = [
  { id: 'validation', label: 'YAML syntax validation' },
  { id: 'schema', label: 'Schema definition support' },
  { id: 'json', label: 'Convert to/from JSON' },
  { id: 'template', label: 'Template generation' },
  { id: 'documents', label: 'Multi-document support' },
  { id: 'comments', label: 'Comment preservation' },
];

export const svgIcons: SvgLibraryItem[] = [
  { id: 1, name: 'User Circle', category: 'Users', size: '24x24' },
  { id: 2, name: 'Shopping Cart', category: 'Commerce', size: '24x24' },
  { id: 3, name: 'Heart', category: 'Social', size: '24x24' },
  { id: 4, name: 'Star', category: 'Rating', size: '24x24' },
  { id: 5, name: 'Home', category: 'Navigation', size: '24x24' },
  { id: 6, name: 'Settings', category: 'System', size: '24x24' },
  { id: 7, name: 'Mail', category: 'Communication', size: '24x24' },
  { id: 8, name: 'Calendar', category: 'Time', size: '24x24' },
];

export const svgCategories = ['All', 'Users', 'Commerce', 'Social', 'Navigation', 'System', 'Communication', 'Time'];

export const svgMetrics: MetricItem[] = [
  { label: 'Total Icons', value: '2,458', accent: 'green' },
  { label: 'Categories', value: 28, accent: 'blue' },
  { label: 'Downloads', value: '15.2K', accent: 'yellow' },
  { label: 'Contributors', value: 142, accent: 'gray' },
];
