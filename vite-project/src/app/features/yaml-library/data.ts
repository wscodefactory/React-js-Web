import type { YamlTemplate } from './types';

export const yamlFeatureCards = ['Typed upload state', 'Reusable template cards', 'Clipboard feedback'];

export const yamlTemplates: YamlTemplate[] = [
  {
    id: 'app-config',
    title: 'Application config',
    description: 'Environment, feature flags, and API endpoints.',
    code: `app:
  name: storefront
  version: 1.0.0
api:
  baseUrl: https://api.example.com
features:
  analytics: true
  betaCheckout: false`,
  },
  {
    id: 'docker-compose',
    title: 'Docker Compose service',
    description: 'Small web and database stack for local development.',
    code: `services:
  web:
    image: nginx:latest
    ports:
      - "8080:80"
  database:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: local`,
  },
  {
    id: 'github-action',
    title: 'GitHub Actions workflow',
    description: 'Install dependencies, typecheck, and build on push.',
    code: `name: build
on:
  push:
    branches: [main]
jobs:
  web:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run build`,
  },
];

export const jsonConverterSample = {
  app: { name: 'storefront', version: '1.0.0' },
  features: { analytics: true },
};
