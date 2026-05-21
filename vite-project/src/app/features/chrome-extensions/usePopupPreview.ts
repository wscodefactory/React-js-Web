import { useMemo, useState } from 'react';
import { initialPreviewNotes } from './data';
import type { PreviewNote, PreviewTab } from './types';

export function usePopupPreview() {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<PreviewTab>('All');
  const [items, setItems] = useState<PreviewNote[]>(initialPreviewNotes);
  const [status, setStatus] = useState('Popup preview ready.');

  const filteredNotes = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return items.filter((note) => {
      const searchableText = `${note.title} ${note.body}`.toLowerCase();
      const matchesQuery = !normalizedQuery || searchableText.includes(normalizedQuery);
      const matchesTab = activeTab === 'All' || (activeTab === 'Pinned' ? note.pinned : note.id > initialPreviewNotes.length);

      return matchesQuery && matchesTab;
    });
  }, [activeTab, items, query]);

  const addNote = () => {
    const nextNote = {
      id: Math.max(0, ...items.map((note) => note.id)) + 1,
      title: `New note ${items.length + 1}`,
      body: 'Drafted from the popup preview.',
      pinned: false,
    };

    setItems((current) => [nextNote, ...current]);
    setActiveTab('Recent');
    setQuery('');
    setStatus(`${nextNote.title} added.`);
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
