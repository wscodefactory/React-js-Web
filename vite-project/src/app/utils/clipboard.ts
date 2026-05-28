function copyTextWithTextarea(text: string) {
  if (typeof document === 'undefined') {
    return false;
  }

  let copyEventHandled = false;
  const textArea = document.createElement('textarea');
  const handleCopy = (event: ClipboardEvent) => {
    event.clipboardData?.setData('text/plain', text);
    event.preventDefault();
    copyEventHandled = true;
  };

  textArea.value = text;
  textArea.setAttribute('readonly', '');
  textArea.style.border = '0';
  textArea.style.height = '1px';
  textArea.style.left = '0';
  textArea.style.opacity = '0';
  textArea.style.padding = '0';
  textArea.style.position = 'fixed';
  textArea.style.top = '0';
  textArea.style.width = '1px';

  try {
    document.addEventListener('copy', handleCopy);
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    textArea.setSelectionRange(0, text.length);

    return document.execCommand('copy') || copyEventHandled;
  } catch {
    return false;
  } finally {
    textArea.remove();
    document.removeEventListener('copy', handleCopy);
  }
}

export async function copyTextToClipboard(text: string) {
  const clipboard = globalThis.navigator?.clipboard;

  if (clipboard?.writeText) {
    try {
      await clipboard.writeText(text);
      return true;
    } catch {
      return copyTextWithTextarea(text);
    }
  }

  return copyTextWithTextarea(text);
}
