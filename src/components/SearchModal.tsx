import React, { useState, useEffect, useRef } from 'react';
import { Search as SearchIcon, X, ArrowRight, BookOpen } from 'lucide-react';
import { searchScripture } from '../services/search';
import type { SearchResult } from '../services/search';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectVerse: (chapterNumber: number, verseNumber: number) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectVerse,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.trim().length >= 2) {
      const res = searchScripture(query);
      setResults(res);
    } else {
      setResults([]);
    }
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#FBF8F2] dark:bg-[#121A16] pt-safe pb-safe animate-fade-in">
      {/* Header bar */}
      <div className="p-4 border-b border-[#EAE5DA] dark:border-[#2C3B33] flex items-center gap-3 bg-white dark:bg-[#1E2923]">
        <SearchIcon size={18} className="text-[#1E3A2F] dark:text-[#E8F0EC]" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search verses, '2:47', 'कर्म', 'duty'..."
          className="flex-1 bg-transparent text-sm text-[#1E3A2F] dark:text-[#E8F0EC] placeholder:text-[#8C9892] focus:outline-none"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="p-1 text-[#8C9892] hover:text-[#1E3A2F]"
          >
            <X size={16} />
          </button>
        )}
        <button
          onClick={onClose}
          className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#F2ECE1] dark:bg-[#2C3B33] text-[#1E3A2F] dark:text-[#E8F0EC]"
        >
          Cancel
        </button>
      </div>

      {/* Results list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2.5 max-w-md mx-auto w-full">
        {query.trim().length < 2 && (
          <div className="text-center py-12 px-6 text-[#69756F] dark:text-[#A2B3AA] space-y-1">
            <BookOpen size={28} className="mx-auto mb-2 text-[#8C9892] stroke-[1.5]" />
            <p className="text-xs font-medium text-[#1E3A2F] dark:text-[#E8F0EC]">Search across 18 chapters</p>
            <p className="text-[11px] text-[#8C9892]">
              Type a verse like <span className="font-mono font-bold text-[#1E3A2F] dark:text-[#64B587]">2:47</span> or keywords in English, Hindi, or Sanskrit.
            </p>
          </div>
        )}

        {query.trim().length >= 2 && results.length === 0 && (
          <div className="text-center py-12 px-6 text-[#69756F] space-y-1">
            <p className="text-xs font-medium text-[#1E3A2F] dark:text-[#E8F0EC]">No verses found matching "{query}"</p>
            <p className="text-[11px] text-[#8C9892]">
              Try searching with another spelling or reference (e.g., 2:47).
            </p>
          </div>
        )}

        {results.map((res, idx) => (
          <button
            key={`${res.chapterNumber}:${res.verseNumber}-${idx}`}
            onClick={() => {
              onSelectVerse(res.chapterNumber, res.verseNumber);
              onClose();
            }}
            className="w-full text-left p-3.5 rounded-2xl bg-white dark:bg-[#1E2923] border border-[#EAE5DA] dark:border-[#2C3B33] shadow-xs hover:border-[#1E3A2F]/40 transition-colors flex items-start justify-between gap-3 group"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-[#F2ECE1] text-[#1E3A2F] dark:bg-[#2C3B33] dark:text-[#64B587]">
                  {res.chapterNumber}:{res.verseNumber}
                </span>
                <span className="text-xs text-[#8C9892] truncate font-medium">
                  Ch {res.chapterNumber}: {res.chapterTitle}
                </span>
              </div>
              <p className="text-xs text-[#1E3A2F] dark:text-[#E8F0EC] line-clamp-2 leading-relaxed">
                {res.snippet}
              </p>
            </div>
            <ArrowRight
              size={15}
              className="text-[#8C9892] group-hover:text-[#1E3A2F] group-hover:translate-x-0.5 transition-all mt-1 shrink-0"
            />
          </button>
        ))}
      </div>
    </div>
  );
};
