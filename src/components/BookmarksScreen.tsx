import React, { useState } from 'react';
import { Bookmark, PenTool, Trash2 } from 'lucide-react';
import type { UserProgress } from '../types';
import { toggleBookmark, saveVerseNote, scriptureData } from '../services/storage';

interface BookmarksScreenProps {
  progress: UserProgress;
  onUpdateProgress: (progress: UserProgress) => void;
  onOpenReader: (chapterNumber: number, verseNumber: number) => void;
}

export const BookmarksScreen: React.FC<BookmarksScreenProps> = ({
  progress,
  onUpdateProgress,
  onOpenReader,
}) => {
  const [activeTab, setActiveTab] = useState<'bookmarks' | 'notes'>('bookmarks');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  const handleRemoveBookmark = (ch: number, v: number, snippet: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = toggleBookmark(progress, ch, v, snippet);
    onUpdateProgress(updated);
  };

  const handleDeleteNote = (ch: number, v: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = saveVerseNote(progress, ch, v, '');
    onUpdateProgress(updated);
  };

  const handleStartEdit = (note: { verseId: string; note: string }, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingNoteId(note.verseId);
    setEditContent(note.note);
  };

  const handleSaveEdit = (ch: number, v: number) => {
    const updated = saveVerseNote(progress, ch, v, editContent);
    onUpdateProgress(updated);
    setEditingNoteId(null);
  };

  const notesList = Object.values(progress.notes).sort((a, b) => b.updatedAt - a.updatedAt);

  return (
    <div className="p-4 space-y-4 max-w-md mx-auto pb-24 animate-fade-in">
      {/* 1. Header (Matching Screen 8) */}
      <div className="pt-1">
        <h2 className="text-xl font-bold text-[#1E3A2F] dark:text-[#E8F0EC] tracking-tight">
          Saved Verses
        </h2>
      </div>

      {/* 2. Segmented Pill Control (Matching Screen 8) */}
      <div className="inline-flex p-1 rounded-full bg-[#EAE5DA]/60 dark:bg-[#2C3B33] text-xs font-medium">
        <button
          onClick={() => setActiveTab('bookmarks')}
          className={`px-4 py-1.5 rounded-full transition-all ${
            activeTab === 'bookmarks'
              ? 'bg-[#1E3A2F] text-white shadow-xs font-semibold'
              : 'text-[#69756F] dark:text-[#A2B3AA] hover:text-[#1E3A2F]'
          }`}
        >
          Bookmarks
        </button>
        <button
          onClick={() => setActiveTab('notes')}
          className={`px-4 py-1.5 rounded-full transition-all ${
            activeTab === 'notes'
              ? 'bg-[#1E3A2F] text-white shadow-xs font-semibold'
              : 'text-[#69756F] dark:text-[#A2B3AA] hover:text-[#1E3A2F]'
          }`}
        >
          Notes
        </button>
      </div>

      {/* 3. Bookmarks List (Matching Screen 8) */}
      {activeTab === 'bookmarks' && (
        <div className="space-y-2.5">
          {progress.bookmarks.length === 0 ? (
            <div className="text-center py-12 px-6 rounded-3xl bg-white dark:bg-[#1E2923] border border-[#EAE5DA] dark:border-[#2C3B33] space-y-2">
              <Bookmark size={28} className="mx-auto text-[#B5BEB8]" />
              <p className="text-xs font-medium text-[#1E3A2F] dark:text-[#E8F0EC]">
                No bookmarks saved yet
              </p>
              <p className="text-[11px] text-[#8C9892]">
                Tap the bookmark ribbon while reading any verse to save it here.
              </p>
            </div>
          ) : (
            progress.bookmarks.map((b) => {
              // Extract snippet title & meaning
              const raw = b.snippet || '';
              const parts = raw.split('—');
              const sanskritSnippet = parts[0]?.trim() || 'कर्मण्येवाधिकारस्ते...';
              const meaningSnippet = parts[1]?.trim() || `Chapter ${b.chapter} • Verse ${b.verse}`;

              return (
                <div
                  key={b.id}
                  onClick={() => onOpenReader(b.chapter, b.verse)}
                  className="p-3.5 rounded-2xl bg-white dark:bg-[#1E2923] border border-[#EAE5DA] dark:border-[#2C3B33] shadow-xs flex items-center justify-between gap-3 cursor-pointer hover:border-[#D4A359]/60 transition-all group active:scale-[0.99]"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Verse Badge Box (Screen 8 Style) */}
                    <div className="w-11 h-11 rounded-xl bg-[#FFF6E5] dark:bg-[#2C2317] border border-[#F3DCA7] dark:border-[#4B3923] flex items-center justify-center font-mono text-xs font-bold text-[#C76A24] dark:text-[#D4A359] shrink-0">
                      {b.chapter}:{b.verse}
                    </div>

                    <div className="min-w-0 space-y-0.5">
                      <p className="font-shloka text-xs font-bold text-[#1E3A2F] dark:text-[#E8F0EC] truncate leading-tight">
                        {sanskritSnippet}
                      </p>
                      <p className="text-[11px] text-[#8C9892] dark:text-[#A2B3AA] truncate">
                        {meaningSnippet}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={(e) => handleRemoveBookmark(b.chapter, b.verse, b.snippet, e)}
                      className="p-1 text-[#D4A359] hover:opacity-75 transition-opacity"
                      title="Remove bookmark"
                    >
                      <Bookmark size={18} fill="currentColor" strokeWidth={0} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* 4. Notes List (Matching Screen 8) */}
      {activeTab === 'notes' && (
        <div className="space-y-2.5">
          {notesList.length === 0 ? (
            <div className="text-center py-12 px-6 rounded-3xl bg-white dark:bg-[#1E2923] border border-[#EAE5DA] dark:border-[#2C3B33] space-y-2">
              <PenTool size={28} className="mx-auto text-[#B5BEB8]" />
              <p className="text-xs font-medium text-[#1E3A2F] dark:text-[#E8F0EC]">
                No private reflections yet
              </p>
              <p className="text-[11px] text-[#8C9892]">
                Write personal thoughts while reading verses to reflect on your journey.
              </p>
            </div>
          ) : (
            notesList.map((n) => {
              const ch = scriptureData.chapters.find((c) => c.chapter_number === n.chapter);
              const isEditing = editingNoteId === n.verseId;

              return (
                <div
                  key={n.id}
                  onClick={() => !isEditing && onOpenReader(n.chapter, n.verse)}
                  className="p-3.5 rounded-2xl bg-white dark:bg-[#1E2923] border border-[#EAE5DA] dark:border-[#2C3B33] shadow-xs cursor-pointer hover:border-[#1E3A2F]/40 transition-all space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#1E3A2F] dark:text-[#E8F0EC]">
                        Verse {n.chapter}:{n.verse}
                      </span>
                      <span className="text-[11px] text-[#8C9892]">
                        {ch?.translation}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={(e) => handleStartEdit(n, e)}
                        className="text-[11px] text-[#1E3A2F] dark:text-[#64B587] font-semibold hover:underline px-1"
                      >
                        Edit
                      </button>
                      <button
                        onClick={(e) => handleDeleteNote(n.chapter, n.verse, e)}
                        className="p-1 text-[#8C9892] hover:text-red-500 transition-colors"
                        title="Delete note"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {isEditing ? (
                    <div className="space-y-2 pt-1" onClick={(e) => e.stopPropagation()}>
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        rows={3}
                        className="w-full p-2.5 rounded-xl border border-[#1E3A2F] bg-[#FBF8F2] dark:bg-[#121A16] text-xs text-[#1E3A2F] dark:text-[#E8F0EC] focus:outline-none"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setEditingNoteId(null)}
                          className="px-3 py-1 rounded-lg text-xs text-[#69756F]"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveEdit(n.chapter, n.verse)}
                          className="px-3 py-1 rounded-lg bg-[#1E3A2F] text-white text-xs font-medium"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-[#3D4C44] dark:text-[#CFDBD5] italic bg-[#FBF8F2] dark:bg-[#121A16] p-2.5 rounded-xl border border-[#EAE5DA] dark:border-[#2C3B33] leading-relaxed">
                      "{n.note}"
                    </p>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
