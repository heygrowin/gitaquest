import React from 'react';
import {
  ArrowRight,
  Bookmark,
  BookOpen,
  Flame,
  Leaf,
  Smartphone,
} from 'lucide-react';

import type { UserProgress, ActiveTab } from '../types';
import {
  scriptureData,
  getOverallProgress,
  getTodayProgress,
  calculateStreak,
} from '../services/storage';

interface HomeScreenProps {
  progress: UserProgress;
  onOpenReader: (chapterNumber: number, verseNumber: number) => void;
  onNavigateTab: (tab: ActiveTab) => void;
  onOpenCertificate?: () => void;
  onOpenTutorial?: () => void;
  onOpenInstall?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  progress,
  onOpenReader,
  onNavigateTab,
  onOpenInstall,
}) => {
  const hasStartedReading = Object.keys(progress.readVerses).length > 0;
  const lastChNum = hasStartedReading ? (progress.lastRead?.chapter || 1) : 1;
  const lastVNum = hasStartedReading ? (progress.lastRead?.verse || 1) : 1;

  const currentChapter =
    scriptureData.chapters.find((c) => c.chapter_number === lastChNum) ||
    scriptureData.chapters[0];
  const currentVerse =
    currentChapter.verses.find((v) => v.verse === lastVNum) ||
    currentChapter.verses[0];

  const overall = getOverallProgress(progress);
  const today = getTodayProgress(progress);
  const streakInfo = calculateStreak(progress.dailyHistory, progress.dailyGoal?.target || 5);

  // Time-based greeting
  const currentHour = new Date().getHours();
  let greeting = 'Good morning ☀️';
  if (currentHour >= 12 && currentHour < 17) {
    greeting = 'Good afternoon ☀️';
  } else if (currentHour >= 17 || currentHour < 5) {
    greeting = 'Good evening 🌙';
  }

  // Calculate circular progress ring stroke
  const ringRadius = 18;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const targetPct = Math.min(100, Math.round((today.count / Math.max(1, today.target)) * 100));
  const strokeDashoffset = ringCircumference - (targetPct / 100) * ringCircumference;

  // Most recent bookmark
  const recentBookmark = progress.bookmarks.length > 0
    ? progress.bookmarks[progress.bookmarks.length - 1]
    : null;

  return (
    <div className="p-4 space-y-4 max-w-md mx-auto pb-24 animate-fade-in">
      {/* 1. Top Greeting & Streak Pill (Matching Screen 5) */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h2 className="text-base font-bold text-[#1E3A2F] dark:text-[#E8F0EC] tracking-tight">
            {greeting}
          </h2>
          <p className="text-xs text-[#69756F] dark:text-[#A2B3AA] font-normal">
            Stay on your path
          </p>
        </div>

        {/* Streak Pill */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFF5E6] dark:bg-[#2A2118] border border-[#F3DCA7]/60 dark:border-[#523B18] shadow-sm">
          <Flame size={15} className="text-[#E07A28] fill-[#E07A28]" />
          <span className="text-xs font-bold font-mono text-[#4A3828] dark:text-[#F3DCA7]">
            {streakInfo.currentStreak} {streakInfo.currentStreak === 1 ? 'day' : 'days'}
          </span>
        </div>
      </div>

      {/* 2. Hero "Continue Reading" Card (Matching Screen 5) */}
      <div
        onClick={() => onOpenReader(lastChNum, lastVNum)}
        className="relative rounded-3xl p-5 overflow-hidden shadow-md cursor-pointer group transition-transform active:scale-[0.99] min-h-[160px] flex flex-col justify-between"
      >
        {/* Background artwork */}
        <div className="absolute inset-0 z-0">
          <img
            src="/gitaquest_hero_bg.svg"
            alt=""
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#10241B]/90 via-[#163327]/70 to-[#10241B]/80" />
        </div>

        {/* Card Header */}
        <div className="relative z-10 flex items-center gap-1.5 text-white/80 text-[11px] font-medium">
          <BookOpen size={13} className="text-[#D4A359]" />
          <span>{hasStartedReading ? 'Continue reading' : 'Begin your reading journey'}</span>
        </div>

        {/* Middle Content */}
        <div className="relative z-10 my-2.5 space-y-1">
          <h3 className="font-serif-heading text-lg font-bold text-white tracking-wide">
            Chapter {lastChNum} • Verse {lastVNum}
          </h3>
          <p className="font-shloka text-xs text-white/90 line-clamp-1 italic">
            {currentVerse.sanskrit.split('\n')[0]}
          </p>
        </div>

        {/* Circular Action Button */}
        <div className="relative z-10 self-end">
          <div className="w-10 h-10 rounded-full bg-white text-[#1E3A2F] flex items-center justify-center shadow-lg group-hover:bg-[#FBF8F2] group-hover:translate-x-0.5 transition-all">
            <ArrowRight size={18} strokeWidth={2.2} />
          </div>
        </div>
      </div>

      {/* 3. Dual Metrics Row: Today's Goal & Your Journey (Matching Screen 5) */}
      <div className="grid grid-cols-2 gap-3">
        {/* Today's Goal Card */}
        <div className="p-4 rounded-3xl bg-white dark:bg-[#1E2923] border border-[#EAE5DA] dark:border-[#2C3B33] shadow-sm flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[11px] font-medium text-[#69756F] dark:text-[#A2B3AA] block">
              Today's goal
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-base font-bold font-mono text-[#1E3A2F] dark:text-[#E8F0EC]">
                {today.count} / {today.target}
              </span>
            </div>
            <span className="text-[10px] text-[#8C9892] block">
              verses
            </span>
          </div>

          {/* Clean Progress Ring */}
          <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
            <svg className="w-12 h-12 -rotate-90">
              <circle
                cx="24"
                cy="24"
                r={ringRadius}
                stroke="currentColor"
                strokeWidth="3.5"
                fill="transparent"
                className="text-[#EAE5DA] dark:text-[#2C3B33]"
              />
              <circle
                cx="24"
                cy="24"
                r={ringRadius}
                stroke="currentColor"
                strokeWidth="3.5"
                strokeDasharray={ringCircumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="text-[#1E3A2F] dark:text-[#64B587] transition-all duration-500"
              />
            </svg>
          </div>
        </div>

        {/* Your Journey Card */}
        <div
          onClick={() => onNavigateTab('journey')}
          className="p-4 rounded-3xl bg-white dark:bg-[#1E2923] border border-[#EAE5DA] dark:border-[#2C3B33] shadow-sm flex items-center justify-between cursor-pointer hover:border-[#1E3A2F]/40 transition-colors"
        >
          <div className="space-y-0.5">
            <span className="text-[11px] font-medium text-[#69756F] dark:text-[#A2B3AA] block">
              Your journey
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-base font-bold font-mono text-[#1E3A2F] dark:text-[#E8F0EC]">
                {overall.completedChaptersCount} / 18
              </span>
            </div>
            <span className="text-[10px] text-[#8C9892] block">
              chapters
            </span>
          </div>

          <div className="w-11 h-11 rounded-2xl bg-[#F0F5F2] dark:bg-[#16291F] flex items-center justify-center text-[#1E3A2F] dark:text-[#64B587] shrink-0">
            <Leaf size={20} strokeWidth={1.8} />
          </div>
        </div>
      </div>

      {/* 4. Recently Saved Section (Matching Screen 5) */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold text-[#1E3A2F] dark:text-[#E8F0EC] tracking-tight">
            Recently saved
          </h3>
          <button
            onClick={() => onNavigateTab('bookmarks')}
            className="text-[11px] font-medium text-[#69756F] dark:text-[#A2B3AA] hover:text-[#1E3A2F]"
          >
            View all
          </button>
        </div>

        {recentBookmark ? (
          <div
            onClick={() => onOpenReader(recentBookmark.chapter, recentBookmark.verse)}
            className="p-3.5 rounded-2xl bg-white dark:bg-[#1E2923] border border-[#EAE5DA] dark:border-[#2C3B33] shadow-sm flex items-center justify-between gap-3 cursor-pointer hover:border-[#D4A359]/60 transition-all group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-[#FFF6E5] dark:bg-[#2C2317] border border-[#F3DCA7] dark:border-[#4B3923] flex items-center justify-center text-xs font-bold font-shloka text-[#C76A24] dark:text-[#D4A359] shrink-0">
                सं
              </div>
              <div className="min-w-0">
                <span className="font-mono text-[10px] font-bold text-[#8C9892] block">
                  {recentBookmark.chapter}:{recentBookmark.verse}
                </span>
                <p className="font-shloka text-xs text-[#1E3A2F] dark:text-[#E8F0EC] font-semibold truncate leading-tight">
                  {recentBookmark.snippet.split('—')[0]?.trim() || 'श्रीमद्भगवद्गीता'}
                </p>
              </div>
            </div>

            <div className="text-[#D4A359] shrink-0 p-1">
              <Bookmark size={18} fill="currentColor" strokeWidth={0} />
            </div>
          </div>
        ) : (
          <div
            onClick={() => onOpenReader(1, 1)}
            className="p-3.5 rounded-2xl bg-white/70 dark:bg-[#1E2923]/70 border border-dashed border-[#EAE5DA] dark:border-[#2C3B33] flex items-center justify-between gap-3 cursor-pointer hover:border-[#1E3A2F]/40 transition-all group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-[#F4EFE6] dark:bg-[#25332B] flex items-center justify-center text-[#8C9892] shrink-0">
                <Bookmark size={16} strokeWidth={1.8} />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-semibold text-[#1E3A2F] dark:text-[#E8F0EC] block">
                  No saved verses yet
                </span>
                <p className="text-[10px] text-[#8C9892] truncate">
                  Bookmark verses you cherish while reading to view them here
                </p>
              </div>
            </div>

            <span className="text-[11px] font-semibold text-[#1E3A2F] dark:text-[#64B587] group-hover:translate-x-0.5 transition-transform shrink-0">
              Read Ch 1 →
            </span>
          </div>
        )}
      </div>

      {/* 5. Get App Card (PWA & APK Download) */}
      {onOpenInstall && (
        <div
          onClick={onOpenInstall}
          className="p-3.5 rounded-2xl bg-white dark:bg-[#1E2923] border border-[#EAE5DA] dark:border-[#2C3B33] shadow-xs flex items-center justify-between gap-3 cursor-pointer hover:border-[#1E3A2F]/40 transition-all group"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-deepForest dark:text-[#64B587] flex items-center justify-center shrink-0">
              <Smartphone size={17} />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-semibold text-[#1E3A2F] dark:text-[#E8F0EC] block">
                Install App or Download APK
              </span>
              <p className="text-[10px] text-[#8C9892] truncate">
                Add to your home screen (PWA) or download Android APK
              </p>
            </div>
          </div>
          <span className="text-[11px] font-semibold text-[#1E3A2F] dark:text-[#64B587] group-hover:translate-x-0.5 transition-transform shrink-0">
            Get App →
          </span>
        </div>
      )}
    </div>
  );
};
