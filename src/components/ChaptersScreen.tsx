import React, { useState } from 'react';
import { Check, ChevronRight, Search, X } from 'lucide-react';

import type { UserProgress } from '../types';
import { scriptureData, getChapterProgress } from '../services/storage';

interface ChaptersScreenProps {
  progress: UserProgress;
  onOpenReader: (chapterNumber: number, verseNumber: number) => void;
}

export const ChaptersScreen: React.FC<ChaptersScreenProps> = ({
  progress,
  onOpenReader,
}) => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const chaptersWithStats = scriptureData.chapters.map((ch) => {
    const stats = getChapterProgress(progress, ch.chapter_number);
    const isCompleted = stats.isComplete;
    const isInProgress = !isCompleted && stats.completedCount > 0;
    return {
      chapter: ch,
      stats,
      isCompleted,
      isInProgress,
    };
  });

  const filteredChapters = chaptersWithStats.filter(({ chapter }) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const matchName = chapter.translation.toLowerCase().includes(q);
    const matchSanskrit = chapter.name.toLowerCase().includes(q);
    const matchMeaning = chapter.meaning.en.toLowerCase().includes(q);
    const matchNum = String(chapter.chapter_number) === q.replace(/\D/g, '');
    return matchName || matchSanskrit || matchMeaning || matchNum;
  });

  return (
    <div className="p-4 space-y-4 max-w-md mx-auto pb-24 animate-fade-in">
      {/* 1. Header (Matching Screen 6) */}
      <div className="flex items-center justify-between pt-1">
        <h2 className="text-xl font-bold text-[#1E3A2F] dark:text-[#E8F0EC] tracking-tight">
          Chapters
        </h2>

        <button
          onClick={() => {
            setShowSearch(!showSearch);
            if (showSearch) setSearchQuery('');
          }}
          className="p-2 rounded-full text-[#1E3A2F] dark:text-[#E8F0EC] hover:bg-[#EAE5DA]/50 transition-colors"
          aria-label="Search chapters"
        >
          {showSearch ? <X size={20} /> : <Search size={20} />}
        </button>
      </div>

      {/* Optional Search Input bar if toggled */}
      {showSearch && (
        <div className="relative animate-fade-in">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C9892]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, meaning or chapter number..."
            className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-white dark:bg-[#1E2923] border border-[#EAE5DA] dark:border-[#2C3B33] text-xs text-[#1E3A2F] dark:text-[#E8F0EC] placeholder:text-[#8C9892] focus:outline-none focus:border-[#1E3A2F]"
            autoFocus
          />
        </div>
      )}

      {/* 2. List of 18 Chapters (Matching Screen 6) */}
      <div className="space-y-2.5">
        {filteredChapters.map(({ chapter, stats, isCompleted, isInProgress }) => {
          // Find first unread verse or verse 1
          let targetVerse = 1;
          for (let v = 1; v <= chapter.verses_count; v++) {
            if (!progress.readVerses[`${chapter.chapter_number}:${v}`]) {
              targetVerse = v;
              break;
            }
          }

          return (
            <div
              key={chapter.chapter_number}
              onClick={() => onOpenReader(chapter.chapter_number, targetVerse)}
              className="p-3.5 rounded-2xl bg-white dark:bg-[#1E2923] border border-[#EAE5DA] dark:border-[#2C3B33] shadow-xs flex items-center justify-between gap-3 cursor-pointer hover:border-[#1E3A2F]/40 transition-all group active:scale-[0.99]"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                {/* Circular Number Badge */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                    isCompleted
                      ? 'bg-[#1E3A2F] text-white'
                      : isInProgress
                      ? 'bg-[#F2ECE1] dark:bg-[#2C3B33] text-[#1E3A2F] dark:text-[#E8F0EC] border border-[#1E3A2F]/30'
                      : 'bg-[#F5F0E6] dark:bg-[#26312B] text-[#55635C] dark:text-[#A2B3AA]'
                  }`}
                >
                  {chapter.chapter_number}
                </div>

                <div className="min-w-0 space-y-0.5">
                  <h3 className="text-xs font-bold text-[#1E3A2F] dark:text-[#E8F0EC] truncate leading-tight group-hover:text-[#2A5242] transition-colors">
                    {chapter.translation}
                  </h3>
                  <p className="text-[11px] text-[#8C9892] dark:text-[#A2B3AA] truncate">
                    {chapter.verses_count} verses
                  </p>

                  {/* Slim progress bar for in-progress chapters */}
                  {isInProgress && (
                    <div className="w-24 bg-[#EAE5DA] dark:bg-[#2C3B33] rounded-full h-1 overflow-hidden mt-1">
                      <div
                        className="bg-[#1E3A2F] dark:bg-[#64B587] h-full rounded-full transition-all"
                        style={{ width: `${stats.percentage}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Right Indicator (Green Checkmark if completed, Chevron otherwise) */}
              <div className="shrink-0 pl-2">
                {isCompleted ? (
                  <div className="w-6 h-6 rounded-full bg-[#1E3A2F] text-white flex items-center justify-center shadow-xs">
                    <Check size={14} strokeWidth={2.5} />
                  </div>
                ) : (
                  <ChevronRight size={18} className="text-[#B5BEB8] group-hover:text-[#1E3A2F] transition-colors" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
