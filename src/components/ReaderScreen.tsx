import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Bookmark as BookmarkIcon,
  Menu,
  Check,
  PenTool,
  X,
} from 'lucide-react';
import type { UserProgress } from '../types';
import {
  scriptureData,
  toggleVerseRead,
  toggleBookmark,
  saveVerseNote,
} from '../services/storage';

interface ReaderScreenProps {
  initialChapter: number;
  initialVerse: number;
  progress: UserProgress;
  onUpdateProgress: (updated: UserProgress | ((prev: UserProgress) => UserProgress)) => void;
  onClose: () => void;
  onChapterCompleted: (chapterNumber: number) => void;
}

export const ReaderScreen: React.FC<ReaderScreenProps> = ({
  initialChapter,
  initialVerse,
  progress,
  onUpdateProgress,
  onClose,
  onChapterCompleted,
}) => {
  const [chapterNumber, setChapterNumber] = useState(initialChapter);
  const [verseNumber, setVerseNumber] = useState(initialVerse);
  const [showVersePicker, setShowVersePicker] = useState(false);
  const [showNoteDrawer, setShowNoteDrawer] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'huge'>(progress.settings.fontSize || 'normal');

  // Accordion open/closed states
  const [hindiOpen, setHindiOpen] = useState(true);
  const [englishOpen, setEnglishOpen] = useState(true);

  const chapter = scriptureData.chapters.find((c) => c.chapter_number === chapterNumber) || scriptureData.chapters[0];
  const verse = chapter.verses.find((v) => v.verse === verseNumber) || chapter.verses[0];

  const verseId = `${chapterNumber}:${verseNumber}`;
  const isRead = !!progress.readVerses[verseId];
  const isBookmarked = progress.bookmarks.some((b) => b.id === verseId);
  const currentNote = progress.notes[verseId]?.note || '';

  // Synchronize lastRead and local note cleanly without stale closure overwrite
  useEffect(() => {
    onUpdateProgress((prev) => {
      if (prev.lastRead.chapter === chapterNumber && prev.lastRead.verse === verseNumber) {
        return prev;
      }
      return {
        ...prev,
        lastRead: { chapter: chapterNumber, verse: verseNumber },
      };
    });

    setNoteText(progress.notes[verseId]?.note || '');
  }, [chapterNumber, verseNumber]);

  // Auto-mark verse as read after 1.5 seconds of contemplation if enabled
  useEffect(() => {
    if (!progress.readVerses[verseId] && progress.settings.autoMarkRead) {
      const timer = setTimeout(() => {
        onUpdateProgress((prev) => {
          if (prev.readVerses[verseId]) return prev;
          const { updatedProgress, newlyCompletedChapter } = toggleVerseRead(prev, chapterNumber, verseNumber);
          if (newlyCompletedChapter) {
            onChapterCompleted(newlyCompletedChapter);
          }
          return updatedProgress;
        });
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [verseId, progress.readVerses, progress.settings.autoMarkRead]);

  // Handle previous verse
  const handlePrevVerse = () => {
    if (verseNumber > 1) {
      const prevV = verseNumber - 1;
      onUpdateProgress((prev) => ({
        ...prev,
        lastRead: { chapter: chapterNumber, verse: prevV },
      }));
      setVerseNumber(prevV);
    } else if (chapterNumber > 1) {
      const prevChNum = chapterNumber - 1;
      const prevCh = scriptureData.chapters.find((c) => c.chapter_number === prevChNum)!;
      const prevV = prevCh.verses_count;
      onUpdateProgress((prev) => ({
        ...prev,
        lastRead: { chapter: prevChNum, verse: prevV },
      }));
      setChapterNumber(prevChNum);
      setVerseNumber(prevV);
    }
  };

  // Handle next verse (auto-marks current verse as read on advance atomically)
  const handleNextVerse = () => {
    let nextCh = chapterNumber;
    let nextV = verseNumber;

    if (verseNumber < chapter.verses_count) {
      nextV = verseNumber + 1;
    } else if (chapterNumber < 18) {
      nextCh = chapterNumber + 1;
      nextV = 1;
    }

    onUpdateProgress((prev) => {
      let currentP = prev;
      if (!currentP.readVerses[verseId]) {
        const { updatedProgress, newlyCompletedChapter } = toggleVerseRead(currentP, chapterNumber, verseNumber);
        currentP = updatedProgress;
        if (newlyCompletedChapter) {
          onChapterCompleted(newlyCompletedChapter);
        }
      }
      return {
        ...currentP,
        lastRead: { chapter: nextCh, verse: nextV },
      };
    });

    if (nextCh !== chapterNumber) setChapterNumber(nextCh);
    if (nextV !== verseNumber) setVerseNumber(nextV);
  };

  // Toggle read state manually
  const handleToggleRead = () => {
    onUpdateProgress((prev) => {
      const { updatedProgress, newlyCompletedChapter } = toggleVerseRead(prev, chapterNumber, verseNumber);
      if (newlyCompletedChapter) {
        onChapterCompleted(newlyCompletedChapter);
      }
      return updatedProgress;
    });
  };

  // Toggle bookmark
  const handleToggleBookmark = () => {
    const snippet = `${verse.sanskrit.split('\n')[0]} — ${verse.english.slice(0, 90)}`;
    const updated = toggleBookmark(progress, chapterNumber, verseNumber, snippet);
    onUpdateProgress(updated);
  };

  // Save personal note
  const handleSaveNote = () => {
    const updated = saveVerseNote(progress, chapterNumber, verseNumber, noteText);
    onUpdateProgress(updated);
    setShowNoteDrawer(false);
  };

  // Text sizes
  const fontClasses = {
    normal: {
      sanskrit: 'text-lg sm:text-xl',
      translit: 'text-xs',
      translation: 'text-xs sm:text-sm',
    },
    large: {
      sanskrit: 'text-xl sm:text-2xl',
      translit: 'text-sm',
      translation: 'text-sm sm:text-base',
    },
    huge: {
      sanskrit: 'text-2xl sm:text-3xl',
      translit: 'text-base',
      translation: 'text-base sm:text-lg',
    },
  }[fontSize];

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#FBF8F2] dark:bg-[#121A16] text-[#1E3A2F] dark:text-[#E8F0EC] select-text animate-fade-in">
      {/* 1. Header (Matching Screen 7) */}
      <header className="pt-safe px-4 py-3 bg-white/90 dark:bg-[#1E2923]/90 backdrop-blur-md border-b border-[#EAE5DA] dark:border-[#2C3B33] flex items-center justify-between z-10">
        <button
          onClick={onClose}
          className="p-1.5 -ml-1.5 rounded-full text-[#1E3A2F] dark:text-[#E8F0EC] hover:bg-[#EAE5DA]/50 transition-colors"
          aria-label="Back to home"
        >
          <ArrowLeft size={20} />
        </button>

        {/* Center Title */}
        <div className="text-center">
          <h2 className="text-xs font-bold text-[#1E3A2F] dark:text-[#E8F0EC] tracking-tight">
            Chapter {chapterNumber} • Verse {verseNumber}
          </h2>
          <p className="text-[10px] text-[#8C9892] dark:text-[#A2B3AA] font-mono">
            {verseNumber} of {chapter.verses_count}
          </p>
        </div>

        {/* Right Action Icons: Bookmark & Menu */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleToggleBookmark}
            className={`p-1.5 rounded-full transition-colors ${
              isBookmarked
                ? 'text-[#D4A359]'
                : 'text-[#8C9892] hover:text-[#1E3A2F]'
            }`}
            aria-label="Bookmark verse"
          >
            <BookmarkIcon
              size={19}
              fill={isBookmarked ? 'currentColor' : 'none'}
              strokeWidth={isBookmarked ? 0 : 2}
            />
          </button>

          <button
            onClick={() => setShowVersePicker(true)}
            className="p-1.5 rounded-full text-[#1E3A2F] dark:text-[#E8F0EC] hover:bg-[#EAE5DA]/50 transition-colors"
            aria-label="Menu and jump to verse"
          >
            <Menu size={20} />
          </button>
        </div>
      </header>

      {/* 2. Main Reading Canvas (Matching Screen 7) */}
      <main className="flex-1 overflow-y-auto px-4 py-4 max-w-md mx-auto w-full space-y-3 pb-28">
        {/* Sanskrit Shloka Card */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#1E2923] border border-[#EAE5DA] dark:border-[#2C3B33] shadow-xs space-y-3">
          <p
            className={`font-shloka font-bold text-[#1E3A2F] dark:text-[#E8F0EC] ${fontClasses.sanskrit} leading-relaxed text-center select-text`}
          >
            {verse.sanskrit}
          </p>

          {verse.transliteration && (
            <p
              className={`font-serif italic text-[#69756F] dark:text-[#A2B3AA] ${fontClasses.translit} leading-relaxed text-center pt-1 border-t border-[#F2ECE1] dark:border-[#2C3B33] select-text`}
            >
              {verse.transliteration}
            </p>
          )}
        </div>

        {/* Accordion Card 1: Hindi Meaning (Matching Screen 7) */}
        <div className="rounded-3xl bg-white dark:bg-[#1E2923] border border-[#EAE5DA] dark:border-[#2C3B33] shadow-xs overflow-hidden transition-all">
          <button
            onClick={() => setHindiOpen(!hindiOpen)}
            className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-[#FAF6EE] dark:hover:bg-[#25332B] transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm">📙</span>
              <span className="text-xs font-bold text-[#1E3A2F] dark:text-[#E8F0EC]">
                हिंदी अर्थ
              </span>
            </div>
            {hindiOpen ? (
              <ChevronUp size={16} className="text-[#8C9892]" />
            ) : (
              <ChevronDown size={16} className="text-[#8C9892]" />
            )}
          </button>

          {hindiOpen && (
            <div className="px-4 pb-4 pt-1 border-t border-[#F5EFE6] dark:border-[#2C3B33]">
              <p
                className={`font-shloka text-[#3D4C44] dark:text-[#CFDBD5] ${fontClasses.translation} leading-relaxed select-text`}
              >
                {verse.hindi}
              </p>
            </div>
          )}
        </div>

        {/* Accordion Card 2: English Meaning (Matching Screen 7) */}
        <div className="rounded-3xl bg-white dark:bg-[#1E2923] border border-[#EAE5DA] dark:border-[#2C3B33] shadow-xs overflow-hidden transition-all">
          <button
            onClick={() => setEnglishOpen(!englishOpen)}
            className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-[#FAF6EE] dark:hover:bg-[#25332B] transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm">📗</span>
              <span className="text-xs font-bold text-[#1E3A2F] dark:text-[#E8F0EC]">
                English Meaning
              </span>
            </div>
            {englishOpen ? (
              <ChevronUp size={16} className="text-[#8C9892]" />
            ) : (
              <ChevronDown size={16} className="text-[#8C9892]" />
            )}
          </button>

          {englishOpen && (
            <div className="px-4 pb-4 pt-1 border-t border-[#F5EFE6] dark:border-[#2C3B33]">
              <p
                className={`font-sans text-[#3D4C44] dark:text-[#CFDBD5] ${fontClasses.translation} leading-relaxed select-text`}
              >
                {verse.english}
              </p>
            </div>
          )}
        </div>

        {/* Personal Note / Reflection Section */}
        {currentNote ? (
          <div className="p-3.5 rounded-2xl bg-[#F0F5F2] dark:bg-[#1A2620] border border-[#D5E2DB] dark:border-[#263B30] text-xs space-y-1">
            <div className="flex items-center justify-between font-semibold text-[#1E3A2F] dark:text-[#64B587]">
              <span>Personal reflection</span>
              <button
                onClick={() => setShowNoteDrawer(true)}
                className="text-[11px] underline hover:opacity-80"
              >
                Edit
              </button>
            </div>
            <p className="italic text-[#3D4C44] dark:text-[#CFDBD5]">"{currentNote}"</p>
          </div>
        ) : (
          <button
            onClick={() => setShowNoteDrawer(true)}
            className="w-full py-2.5 px-3 rounded-2xl border border-dashed border-[#D5E2DB] dark:border-[#2C3B33] text-[11px] text-[#69756F] dark:text-[#A2B3AA] hover:border-[#1E3A2F] flex items-center justify-center gap-1.5 transition-colors"
          >
            <PenTool size={13} />
            <span>Add private reflection</span>
          </button>
        )}
      </main>

      {/* 3. Floating Bottom Bar (Matching Screen 7) */}
      <footer className="fixed bottom-4 left-4 right-4 max-w-md mx-auto z-20">
        <div className="bg-white/95 dark:bg-[#1E2923]/95 backdrop-blur-md rounded-full px-3 py-2 border border-[#EAE5DA] dark:border-[#2C3B33] shadow-lg flex items-center justify-between gap-3">
          {/* Previous Verse Button */}
          <button
            onClick={handlePrevVerse}
            disabled={chapterNumber === 1 && verseNumber === 1}
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#1E3A2F] dark:text-[#E8F0EC] hover:bg-[#FAF6EE] dark:hover:bg-[#25332B] disabled:opacity-30 disabled:pointer-events-none transition-colors"
            aria-label="Previous verse"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Mark / Unmark Center Pill Button */}
          <button
            onClick={handleToggleRead}
            className={`flex-1 py-2.5 px-4 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-[0.98] ${
              isRead
                ? 'bg-[#F2ECE1] hover:bg-[#EAE5DA] text-[#69756F] dark:bg-[#2C3B33] dark:text-[#A2B3AA] border border-[#EAE5DA] dark:border-[#3D4C44]'
                : 'bg-[#1E3A2F] hover:bg-[#163125] text-white'
            }`}
          >
            {isRead ? (
              <>
                <span className="text-xs">↩</span>
                <span>Unmark as read</span>
              </>
            ) : (
              <>
                <Check size={14} strokeWidth={2.5} />
                <span>Mark as read</span>
              </>
            )}
          </button>

          {/* Next Verse Button */}
          <button
            onClick={handleNextVerse}
            disabled={chapterNumber === 18 && verseNumber === chapter.verses_count}
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#1E3A2F] dark:text-[#E8F0EC] hover:bg-[#FAF6EE] dark:hover:bg-[#25332B] disabled:opacity-30 disabled:pointer-events-none transition-colors"
            aria-label="Next verse"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </footer>

      {/* Note Drawer Modal */}
      {showNoteDrawer && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-[#1E2923] rounded-t-3xl sm:rounded-3xl p-5 space-y-4 border border-[#EAE5DA] dark:border-[#2C3B33] shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-[#EAE5DA] dark:border-[#2C3B33]">
              <div className="flex items-center gap-2">
                <PenTool size={16} className="text-[#1E3A2F] dark:text-[#64B587]" />
                <h3 className="text-xs font-bold text-[#1E3A2F] dark:text-[#E8F0EC]">
                  Reflection for Verse {chapterNumber}:{verseNumber}
                </h3>
              </div>
              <button onClick={() => setShowNoteDrawer(false)} className="text-[#8C9892]">
                <X size={18} />
              </button>
            </div>

            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              rows={4}
              placeholder="What insight or realization does this verse awaken in you?"
              className="w-full p-3 rounded-2xl border border-[#EAE5DA] dark:border-[#2C3B33] bg-[#FBF8F2] dark:bg-[#121A16] text-xs text-[#1E3A2F] dark:text-[#E8F0EC] focus:outline-none focus:border-[#1E3A2F]"
              autoFocus
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowNoteDrawer(false)}
                className="px-4 py-2 rounded-xl text-xs text-[#69756F] dark:text-[#A2B3AA]"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNote}
                className="px-5 py-2 rounded-xl bg-[#1E3A2F] text-white text-xs font-medium"
              >
                Save reflection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chapter & Verse Picker Modal */}
      {showVersePicker && (
        <div className="fixed inset-0 z-50 flex flex-col bg-[#FBF8F2] dark:bg-[#121A16] pt-safe pb-safe animate-fade-in">
          <div className="p-4 border-b border-[#EAE5DA] dark:border-[#2C3B33] flex items-center justify-between bg-white dark:bg-[#1E2923]">
            <h3 className="text-sm font-bold text-[#1E3A2F] dark:text-[#E8F0EC]">
              Jump to verse
            </h3>
            <button onClick={() => setShowVersePicker(false)} className="text-[#8C9892]">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 max-w-md mx-auto w-full">
            {/* Font Size Toggle option */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-[#1E2923] border border-[#EAE5DA] dark:border-[#2C3B33]">
              <span className="text-xs font-medium text-[#1E3A2F] dark:text-[#E8F0EC]">Text size</span>
              <div className="flex gap-1">
                {(['normal', 'large', 'huge'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setFontSize(s)}
                    className={`px-3 py-1 rounded-xl text-xs capitalize ${
                      fontSize === s
                        ? 'bg-[#1E3A2F] text-white font-bold'
                        : 'bg-[#F2ECE1] dark:bg-[#2C3B33] text-[#69756F] dark:text-[#A2B3AA]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Chapter Selector Dropdown */}
            <div>
              <label className="text-xs font-semibold text-[#1E3A2F] dark:text-[#E8F0EC] block mb-1.5">
                Select chapter
              </label>
              <select
                value={chapterNumber}
                onChange={(e) => {
                  const ch = parseInt(e.target.value, 10);
                  setChapterNumber(ch);
                  setVerseNumber(1);
                }}
                className="w-full p-2.5 rounded-2xl border border-[#EAE5DA] dark:border-[#2C3B33] bg-white dark:bg-[#1E2923] text-xs font-medium text-[#1E3A2F] dark:text-[#E8F0EC] focus:outline-none focus:border-[#1E3A2F]"
              >
                {scriptureData.chapters.map((c) => (
                  <option key={c.chapter_number} value={c.chapter_number}>
                    Chapter {c.chapter_number}: {c.translation} ({c.verses_count} verses)
                  </option>
                ))}
              </select>
            </div>

            {/* Verse Grid */}
            <div>
              <label className="text-xs font-semibold text-[#1E3A2F] dark:text-[#E8F0EC] block mb-2">
                Verses in Chapter {chapterNumber}
              </label>
              <div className="grid grid-cols-6 gap-2">
                {Array.from({ length: chapter.verses_count }, (_, i) => i + 1).map((v) => {
                  const id = `${chapterNumber}:${v}`;
                  const isCurrent = v === verseNumber;
                  const isVRead = !!progress.readVerses[id];

                  return (
                    <button
                      key={v}
                      onClick={() => {
                        setVerseNumber(v);
                        setShowVersePicker(false);
                      }}
                      className={`h-9 rounded-xl text-xs font-bold font-mono transition-all ${
                        isCurrent
                          ? 'bg-[#1E3A2F] text-white shadow-sm'
                          : isVRead
                          ? 'bg-[#EAE5DA] text-[#1E3A2F] dark:bg-[#2C3B33] dark:text-[#64B587]'
                          : 'bg-white dark:bg-[#1E2923] border border-[#EAE5DA] dark:border-[#2C3B33] text-[#69756F] dark:text-[#A2B3AA]'
                      }`}
                    >
                      {v}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
