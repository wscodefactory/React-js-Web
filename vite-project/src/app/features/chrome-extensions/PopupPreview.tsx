import { Plus, Search } from 'lucide-react';
import { previewTabs } from './data';
import { usePopupPreview } from './usePopupPreview';
import type { PreviewTheme } from './types';

type PopupPreviewProps = {
  theme: PreviewTheme;
};

export function PopupPreview({ theme }: PopupPreviewProps) {
  const isDark = theme === 'dark';
  const preview = usePopupPreview();

  return (
    <div className={`mx-auto w-full max-w-sm overflow-hidden rounded-3xl border shadow-xl ${isDark ? 'border-gray-700 bg-gray-950' : 'border-gray-200 bg-white'}`}>
      <div className="p-4">
        <label className={`mb-3 flex items-center gap-2 rounded-xl px-3 py-2 ${isDark ? 'bg-gray-900 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
          <Search className="h-4 w-4" />
          <input
            value={preview.query}
            onChange={(event) => preview.setQuery(event.target.value)}
            placeholder="Search notes"
            className={`w-full bg-transparent text-sm outline-none placeholder:text-gray-400 ${isDark ? 'text-white' : 'text-gray-900'}`}
          />
        </label>
        <div className="mb-3 flex gap-2">
          {previewTabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => preview.setActiveTab(tab)}
              className={`rounded-full px-3 py-1 text-xs ${preview.activeTab === tab ? 'bg-green-600 text-white' : isDark ? 'bg-gray-900 text-gray-400' : 'bg-gray-100 text-gray-600'}`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="space-y-2">
          {preview.filteredNotes.map((note) => (
            <article key={note.title} className={`rounded-2xl border p-3 ${isDark ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-gray-50'}`}>
              <div className="flex items-start justify-between gap-2">
                <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{note.title}</h3>
                {note.pinned ? <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] text-green-700">Pinned</span> : null}
              </div>
              <p className="text-xs text-gray-500">{note.body}</p>
            </article>
          ))}
          {preview.filteredNotes.length === 0 ? (
            <div className={`rounded-2xl border p-4 text-center text-xs ${isDark ? 'border-gray-800 text-gray-500' : 'border-gray-200 text-gray-500'}`}>
              No notes match this view.
            </div>
          ) : null}
        </div>
        <p className="mt-3 text-xs text-gray-500">{preview.status}</p>
      </div>
      <div className="flex justify-end p-4 pt-0">
        <button type="button" onClick={preview.addNote} className="flex h-10 w-10 items-center justify-center rounded-full bg-green-600 text-white shadow-lg" aria-label="Add preview note">
          <Plus className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
