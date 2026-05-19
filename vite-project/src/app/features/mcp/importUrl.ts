import type { ParsedImportUrl } from './types';

export function parseImportUrl(value: string): ParsedImportUrl {
  try {
    const url = new URL(value);
    const protocol = url.protocol.replace(':', '');
    const validProtocol = protocol === 'https' || protocol === 'file';
    const name = url.pathname.split('/').filter(Boolean).pop() || url.hostname || 'local-file';

    return {
      valid: validProtocol,
      name,
      host: url.hostname || 'local file',
      protocol,
      href: url.href,
    };
  } catch {
    return {
      valid: false,
      name: '',
      host: '',
      protocol: '',
      href: '',
    };
  }
}
