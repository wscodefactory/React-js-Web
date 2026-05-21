export const supportedPlatforms = [
  {
    id: 'canvas',
    label: 'Canvas',
    status: 'Design-ready',
    description: 'Package reusable canvas patterns and component notes.',
    assets: ['Screen schema', 'Theme tokens', 'Usage notes'],
  },
  {
    id: 'ui-library',
    label: 'UI Library',
    status: 'Component-ready',
    description: 'Publish preview metadata, examples, and implementation status.',
    assets: ['Component manifest', 'Preview entries', 'Variant map'],
  },
  {
    id: 'github',
    label: 'GitHub',
    status: 'Source-ready',
    description: 'Track external source repositories before library publishing.',
    assets: ['Repository URL', 'Import summary', 'Review checklist'],
  },
] as const;
