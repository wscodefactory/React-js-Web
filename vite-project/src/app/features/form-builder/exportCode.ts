import type { BuilderField } from './types';

export function buildExportCode(formName: string, submitText: string, showLabels: boolean, fields: BuilderField[]) {
  const fieldMarkup = fields.map((field) => {
    const label = showLabels ? `      <label>${field.label}${field.required ? ' *' : ''}</label>\n` : '';
    const required = field.required ? ' required' : '';

    if (field.type === 'textarea') {
      return `${label}      <textarea name="${field.label}"${required} />`;
    }

    if (field.type === 'select') {
      return `${label}      <select name="${field.label}"${required}>
        <option>Option 1</option>
        <option>Option 2</option>
      </select>`;
    }

    if (field.type === 'checkbox' || field.type === 'radio') {
      return `      <label><input type="${field.type}" name="${field.label}"${required} /> ${field.label}</label>`;
    }

    return `${label}      <input type="${field.type}" name="${field.label}"${required} />`;
  }).join('\n\n');

  return `<form aria-label="${formName}">
${fieldMarkup}

      <button type="submit">${submitText}</button>
    </form>`;
}
