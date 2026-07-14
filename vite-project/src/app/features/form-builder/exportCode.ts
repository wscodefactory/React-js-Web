import type { BuilderField } from './types';

function escapeAttribute(value: string) {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function toFieldName(label: string) {
  const normalized = label.trim().replace(/[^a-z0-9]+/gi, ' ').trim();
  const [first = 'field', ...rest] = normalized.split(' ');

  return [
    first.toLowerCase(),
    ...rest.map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1).toLowerCase()}`),
  ].join('');
}

function buildInputAttributes(field: BuilderField) {
  const placeholder = field.placeholder ? ` placeholder="${escapeAttribute(field.placeholder)}"` : '';
  const minLength = field.minLength && ['text', 'textarea', 'email'].includes(field.type) ? ` minlength="${field.minLength}"` : '';
  const required = field.required ? ' required' : '';

  return `${placeholder}${minLength}${required}`;
}

export function buildExportCode(formName: string, submitText: string, showLabels: boolean, fields: BuilderField[]) {
  const fieldMarkup = fields.map((field) => {
    const label = showLabels ? `      <label>${field.label}${field.required ? ' *' : ''}</label>\n` : '';
    const attributes = buildInputAttributes(field);
    const help = field.helperText ? `\n      <small>${field.helperText}</small>` : '';

    if (field.type === 'textarea') {
      return `${label}      <textarea name="${field.label}"${attributes} />${help}`;
    }

    if (field.type === 'select') {
      return `${label}      <select name="${field.label}"${attributes}>
        <option>Option 1</option>
        <option>Option 2</option>
      </select>${help}`;
    }

    if (field.type === 'checkbox' || field.type === 'radio') {
      return `      <label><input type="${field.type}" name="${field.label}"${attributes} /> ${field.label}</label>${help}`;
    }

    return `${label}      <input type="${field.type}" name="${field.label}"${attributes} />${help}`;
  }).join('\n\n');

  return `<form aria-label="${formName}">
${fieldMarkup}

      <button type="submit">${submitText}</button>
    </form>`;
}

export function buildZodSchema(formName: string, fields: BuilderField[]) {
  const schemaName = `${toFieldName(formName || 'Generated Form')}Schema`;
  const entries = fields.map((field) => {
    const fieldName = toFieldName(field.label);
    let schema = 'z.string()';

    if (field.type === 'email') {
      schema = 'z.string().email()';
    } else if (field.type === 'number') {
      schema = 'z.coerce.number()';
    } else if (field.type === 'checkbox' || field.type === 'radio') {
      schema = 'z.boolean()';
    } else if (field.type === 'date') {
      schema = 'z.string().date()';
    }

    if (field.minLength && ['text', 'textarea', 'email'].includes(field.type)) {
      schema += `.min(${field.minLength})`;
    }

    if (!field.required) {
      schema += '.optional()';
    }

    return `  ${fieldName}: ${schema},`;
  }).join('\n');

  return `import { z } from 'zod';

export const ${schemaName} = z.object({
${entries}
});

export type ${schemaName.charAt(0).toUpperCase()}${schemaName.slice(1)}Values = z.infer<typeof ${schemaName}>;`;
}
