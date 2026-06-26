import { useEffect, useMemo, useState } from 'react';
import type { AppLanguage } from '../../context/LanguageContext';
import { chromeExtensionText, getPreviewNoteCopy, initialPreviewNotes } from './data';
import type { PreviewNote, PreviewTab } from './types';

export function usePopupPreview(language: AppLanguage) {
  const text = chromeExtensionText[language].notes;
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<PreviewTab>('All');
  const [items, setItems] = useState<PreviewNote[]>(initialPreviewNotes);
  const [status, setStatus] = useState<string>(text.ready);

  useEffect(() => {
    setStatus(text.ready);
  }, [text.ready]);

  const filteredNotes = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return items.filter((note) => {
      const noteCopy = getPreviewNoteCopy(language, note);
      const searchableText = `${noteCopy.title} ${noteCopy.body}`.toLowerCase();
      const matchesQuery = !normalizedQuery || searchableText.includes(normalizedQuery);
      const matchesTab = activeTab === 'All' || (activeTab === 'Pinned' ? note.pinned : note.id > initialPreviewNotes.length);

      return matchesQuery && matchesTab;
    });
  }, [activeTab, items, language, query]);

  const addNote = () => {
    const nextNote = {
      id: Math.max(0, ...items.map((note) => note.id)) + 1,
      title: text.newTitle(items.length + 1),
      body: text.newBody,
      pinned: false,
    };

    setItems((current) => [nextNote, ...current]);
    setActiveTab('Recent');
    setQuery('');
    setStatus(text.added(nextNote.title));
  };

  return {
    activeTab,
    addNote,
    filteredNotes,
    query,
    setActiveTab,
    setQuery,
    status,
  };
}
