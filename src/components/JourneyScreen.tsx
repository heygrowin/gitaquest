import React from 'react';
import { Lock, BarChart2, Award, Flame, CheckCircle2, BookOpen, Calendar, Heart, ExternalLink } from 'lucide-react';
import type { UserProgress } from '../types';
import { getOverallProgress, calculateStreak, getTodayProgress } from '../services/storage';
import { openDonationPage } from '../services/donation';

interface JourneyScreenProps {
  progress: UserProgress;
  onOpenReader: (chapterNumber: number, verseNumber: number) => void;
  onOpenCertificate: () => void;
}

export const JourneyScreen: React.FC<JourneyScreenProps> = ({
  progress,
  onOpenReader,
  onOpenCertificate,
}) => {
  const overall = getOverallProgress(progress);
  const streakInfo = calculateStreak(progress.dailyHistory, progress.dailyGoal?.target || 5);
  const todayProgress = getTodayProgress(progress);
  const totalReadCount = Object.keys(progress.readVerses).length;
  const isUnlocked = overall.completedChaptersCount === 18;
  const userName = progress.userName || 'Your Name';

  const completionDate = progress.certificateUnlockedAt
    ? new Date(progress.certificateUnlockedAt).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
    : new Date().toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

  return (
    <div className="p-4 space-y-4 max-w-md mx-auto pb-24 animate-fade-in">
      {/* 1. Header (Matching Screen 10) */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h2 className="text-xl font-bold text-[#1E3A2F] dark:text-[#E8F0EC] tracking-tight">
            My Journey
          </h2>
          <p className="text-xs text-[#69756F] dark:text-[#A2B3AA] font-mono mt-0.5">
            {overall.completedChaptersCount} / 18 chapters • {totalReadCount} / 700 verses
          </p>
        </div>

        <div className="p-2 text-[#8C9892]">
          <BarChart2 size={20} />
        </div>
      </div>

      {/* 2. Sadhana Streak & Reading Statistics Card */}
      <div className="p-4 rounded-3xl bg-white dark:bg-[#1E2923] border border-[#EAE5DA] dark:border-[#2C3B33] shadow-xs space-y-3.5">
        {/* Top metrics row */}
        <div className="grid grid-cols-2 gap-3">
          {/* Streak pill & counter */}
          <div className="p-3.5 rounded-2xl bg-[#FFF8EE] dark:bg-[#2A2118] border border-[#F3DCA7]/60 dark:border-[#523B18] space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-[#8A6A3D] dark:text-[#D4A359]">
                Reading Streak
              </span>
              <Flame size={16} className="text-[#E07A28] fill-[#E07A28]" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold font-mono text-[#1E3A2F] dark:text-[#F3DCA7]">
                {streakInfo.currentStreak}
              </span>
              <span className="text-xs text-[#8A6A3D] dark:text-[#A2B3AA]">
                {streakInfo.currentStreak === 1 ? 'day' : 'days'}
              </span>
            </div>
            <span className="text-[10px] text-[#A2845E] dark:text-[#83958B] block">
              Best: {streakInfo.longestStreak} {streakInfo.longestStreak === 1 ? 'day' : 'days'}
            </span>
          </div>

          {/* Today's Verses Read */}
          <div className="p-3.5 rounded-2xl bg-[#F0F5F2] dark:bg-[#16291F] border border-[#D5E2DB] dark:border-[#263B30] space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-[#4D6B5C] dark:text-[#64B587]">
                Today's Goal
              </span>
              <BookOpen size={15} className="text-[#1E3A2F] dark:text-[#64B587]" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold font-mono text-[#1E3A2F] dark:text-[#E8F0EC]">
                {todayProgress.count}
              </span>
              <span className="text-xs text-[#69756F] dark:text-[#A2B3AA]">
                / {todayProgress.target} verses
              </span>
            </div>
            <span className="text-[10px] text-[#69756F] dark:text-[#83958B] block">
              Progress: {overall.percentage}% completed
            </span>
          </div>
        </div>

        {/* 7-Day Activity Week Tracker */}
        <div className="pt-2 border-t border-[#F2ECE1] dark:border-[#2C3B33] space-y-2">
          <div className="flex items-center justify-between text-[11px] font-semibold text-[#1E3A2F] dark:text-[#E8F0EC]">
            <span className="flex items-center gap-1.5">
              <Calendar size={13} className="text-[#8C9892]" />
              <span>Past 7 Days Sadhana</span>
            </span>
            <span className="text-[10px] font-mono text-[#8C9892]">
              {todayProgress.count > 0 ? `${todayProgress.count} read today` : '0 read today'}
            </span>
          </div>

          <div className="grid grid-cols-7 gap-1.5 text-center">
            {streakInfo.weekActivity.map((day, idx) => (
              <div
                key={idx}
                className={`py-2 px-1 rounded-xl flex flex-col items-center gap-1 transition-all ${day.isToday
                    ? 'ring-2 ring-[#1E3A2F] dark:ring-[#64B587] bg-[#FAF6EE] dark:bg-[#1C2C23]'
                    : 'bg-[#F9F6F0] dark:bg-[#25332B]'
                  }`}
              >
                <span className="text-[9px] font-medium text-[#8C9892]">
                  {day.dayLabel}
                </span>
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${day.count > 0
                      ? 'bg-[#1E3A2F] text-white shadow-xs'
                      : 'bg-transparent text-[#8C9892]'
                    }`}
                >
                  {day.count > 0 ? (
                    <CheckCircle2 size={13} className="text-white" />
                  ) : (
                    '·'
                  )}
                </div>
                <span className="text-[8px] font-mono text-[#8C9892]">
                  {day.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. 18-Chapter Circular Grid (6 columns × 3 rows) (Matching Screen 10) */}
      <div className="p-4 rounded-3xl bg-white dark:bg-[#1E2923] border border-[#EAE5DA] dark:border-[#2C3B33] shadow-xs">
        <div className="grid grid-cols-6 gap-2.5 sm:gap-3 py-1">
          {Array.from({ length: 18 }, (_, i) => i + 1).map((chNum) => {
            const isCompleted = progress.completedChapters.includes(chNum);
            const isCurrent = progress.lastRead?.chapter === chNum;

            return (
              <button
                key={chNum}
                onClick={() => onOpenReader(chNum, 1)}
                className={`w-11 h-11 mx-auto rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all active:scale-95 ${isCompleted
                    ? 'bg-[#1E3A2F] text-white shadow-xs'
                    : isCurrent
                      ? 'border-2 border-[#1E3A2F] bg-white dark:bg-[#16221B] text-[#1E3A2F] dark:text-[#E8F0EC]'
                      : 'bg-[#F2ECE1] dark:bg-[#28362F] text-[#8C9892] dark:text-[#83958B] hover:border hover:border-[#1E3A2F]/30'
                  }`}
                title={`Chapter ${chNum}${isCompleted ? ' (Completed)' : ''}`}
              >
                {chNum}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Completion Certificate Section (Matching Screen 10) */}
      <div className="space-y-3 pt-1">
        {/* Section Header */}
        <div className="flex items-center gap-2 px-1">
          {isUnlocked ? (
            <Award size={16} className="text-[#D4A359]" />
          ) : (
            <Lock size={15} className="text-[#8C9892]" />
          )}
          <div>
            <h3 className="text-xs font-bold text-[#1E3A2F] dark:text-[#E8F0EC]">
              Completion Certificate
            </h3>
            <p className="text-[10px] text-[#8C9892]">
              {isUnlocked
                ? 'Unlocked! Tap to download your personalized A4 PDF'
                : 'Unlock after completing all 18 chapters'}
            </p>
          </div>
        </div>

        {/* Certificate Card Mockup (Screen 10 Visual Mockup) */}
        <div
          onClick={onOpenCertificate}
          className="relative rounded-3xl p-5 bg-[#FAF6EE] text-[#1E3A2F] border-2 border-[#D4A359]/70 shadow-sm cursor-pointer hover:border-[#D4A359] transition-all group active:scale-[0.99] text-center overflow-hidden"
        >
          {/* Subtle Corner Accents */}
          <div className="border border-[#D4A359]/40 p-4 rounded-2xl space-y-2 bg-white/70">
            {/* Top Logo */}
            <div className="w-8 h-8 mx-auto flex items-center justify-center">
              <img
                src="/gitaquest_logo.svg"
                alt=""
                className="w-7 h-7 object-contain"
              />
            </div>

            <div className="space-y-0.5">
              <span className="text-[11px] font-serif font-bold text-[#1E3A2F] block">
                GitaQuest
              </span>
              <p className="text-[9px] uppercase tracking-wider text-[#D4A359] font-bold">
                Bhagavad Gita Reading Journey
              </p>
              <h4 className="font-serif-heading text-xs font-bold text-[#1E3A2F]">
                Certificate of Completion
              </h4>
            </div>

            <div className="w-12 h-px bg-[#D4A359]/50 mx-auto" />

            <div className="space-y-0.5">
              <span className="text-[8px] text-[#8C9892] uppercase tracking-widest block">
                Presented to
              </span>
              <span className="font-serif-heading text-sm font-bold text-[#1E3A2F] block">
                {userName}
              </span>
              <p className="text-[8px] text-[#69756F] max-w-xs mx-auto">
                For reading all 18 chapters of the Bhagavad Gita
              </p>
            </div>

            <div className="pt-1.5 flex items-center justify-between text-[7.5px] text-[#8C9892] border-t border-[#D4A359]/25 px-2">
              <span>{completionDate}</span>
              <span className="italic text-[#D4A359]">A personal reading milestone</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Sacred Seva & Support Card (सेवा एवं दान) */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-2 px-1">
          <Heart size={16} className="text-[#E07A28] fill-[#E07A28]" />
          <div>
            <h3 className="text-xs font-bold text-[#1E3A2F] dark:text-[#E8F0EC]">
              Support GitaQuest • सेवा एवं दान
            </h3>
            <p className="text-[10px] text-[#8C9892]">
              100% Free, Pure & Ad-Free Forever
            </p>
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-gradient-to-b from-[#FFFDF9] to-[#FAF6EE] dark:from-[#1E2923] dark:to-[#17221C] border border-[#EAE5DA] dark:border-[#2C3B33] shadow-xs space-y-3">
          <p className="text-xs text-[#526359] dark:text-[#B8C7BF] leading-relaxed">
            GitaQuest is a sacred spiritual initiative dedicated to keeping the Bhagavad Gita pure and accessible to all seekers without ads or paywalls. If this journey brings peace or clarity to your life, consider offering a heartfelt contribution (दान) to support development and server costs.
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[10px] font-semibold text-[#8C9892] uppercase tracking-wider">
              Offerings:
            </span>
            {['₹51', '₹101', '₹251', '₹501'].map((amt) => (
              <button
                key={amt}
                onClick={openDonationPage}
                className="px-2.5 py-1 rounded-full bg-white dark:bg-[#25332B] border border-[#EAE5DA] dark:border-[#3D4C44] text-[11px] font-mono font-bold text-[#1E3A2F] dark:text-[#F3DCA7] hover:border-[#D4A359] active:scale-95 transition-all shadow-2xs"
              >
                {amt}
              </button>
            ))}
          </div>

          <button
            onClick={openDonationPage}
            className="w-full py-3 px-4 rounded-2xl bg-[#1E3A2F] hover:bg-[#163125] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm active:scale-[0.99] transition-all group"
          >
            <Heart size={15} className="text-[#F3DCA7] fill-[#F3DCA7] group-hover:scale-110 transition-transform" />
            <span>Contribute via Razorpay / UPI</span>
            <ExternalLink size={14} className="text-white/70" />
          </button>

          <p className="text-[9.5px] text-center text-[#8C9892] dark:text-[#7A8A82]">
            Secured by Razorpay • Supports Google Pay, PhonePe, Paytm, UPI & Cards
          </p>
        </div>
      </div>
    </div>
  );
};
