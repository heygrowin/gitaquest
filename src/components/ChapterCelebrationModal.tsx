import React, { useState } from 'react';
import { ArrowRight, Award } from 'lucide-react';
import type { Chapter } from '../types';

interface ChapterCelebrationModalProps {
  isOpen: boolean;
  chapter: Chapter;
  completedChaptersCount: number;
  totalChapters?: number;
  onSaveReflection: (reflection: string) => void;
  onContinueNextChapter: () => void;
  onReturnHome: () => void;
}

export const ChapterCelebrationModal: React.FC<ChapterCelebrationModalProps> = ({
  isOpen,
  chapter,
  completedChaptersCount,
  totalChapters = 18,
  onSaveReflection,
  onContinueNextChapter,
  onReturnHome,
}) => {
  const [reflectionText, setReflectionText] = useState('');

  if (!isOpen) return null;

  const handleNext = () => {
    if (reflectionText.trim()) {
      onSaveReflection(reflectionText.trim());
    }
    onContinueNextChapter();
  };

  const handleHome = () => {
    if (reflectionText.trim()) {
      onSaveReflection(reflectionText.trim());
    }
    onReturnHome();
  };

  const percent = Math.round((completedChaptersCount / totalChapters) * 100);
  const remaining = Math.max(0, totalChapters - completedChaptersCount);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      {/* Container matching Screen 9 */}
      <div className="relative rounded-3xl max-w-sm w-full p-6 text-center text-white overflow-hidden shadow-2xl border border-[#D4A359]/30 space-y-4 bg-[#0F241B] max-h-[92vh] overflow-y-auto">
        {/* Background art */}
        <div className="absolute inset-0 pointer-events-none opacity-60">
          <img
            src="/gitaquest_celebration_bg.svg"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>

        {/* Top Gold Logo Emblem */}
        <div className="relative z-10 pt-1">
          <div className="w-12 h-12 mx-auto flex items-center justify-center">
            <img
              src="/gitaquest_logo.svg"
              alt="GitaQuest"
              className="w-11 h-11 object-contain filter drop-shadow-[0_2px_8px_rgba(212,163,89,0.5)]"
            />
          </div>
        </div>

        {/* Headline & Subtitle */}
        <div className="relative z-10 space-y-0.5">
          <h2 className="font-serif-heading text-xl font-bold text-[#FBF8F2] tracking-wide">
            Chapter Complete!
          </h2>
          <p className="text-xs text-[#E8C582] font-medium">
            Chapter {chapter.chapter_number} • {chapter.translation}
          </p>
        </div>

        {/* Milestone Circle */}
        <div className="relative z-10 mx-auto w-24 h-24 rounded-full border-2 border-[#D4A359]/60 bg-[#163629]/80 flex flex-col items-center justify-center shadow-[0_0_20px_rgba(212,163,89,0.2)]">
          <span className="text-base font-bold font-mono text-[#FBF8F2]">
            {completedChaptersCount} / {totalChapters}
          </span>
          <span className="text-[10px] text-[#A2B3AA] uppercase tracking-wider">
            chapters
          </span>
        </div>

        {/* Inspiring Certificate Milestone Card */}
        <div className="relative z-10 p-3 rounded-2xl bg-gradient-to-b from-[#183B2D]/90 to-[#10291F]/90 border border-[#D4A359]/35 text-left space-y-1.5 shadow-md">
          <div className="flex items-center gap-2 text-xs font-bold text-[#E8C582]">
            <Award size={16} className="text-[#D4A359] shrink-0" />
            <span>
              {remaining <= 1
                ? 'Almost at your Sacred Certificate!'
                : completedChaptersCount >= 9
                  ? 'Approaching your Official Certificate!'
                  : 'Advancing Towards your Certificate!'}
            </span>
          </div>
          <p className="text-[11px] text-[#C4D5CC] leading-relaxed">
            {remaining <= 1
              ? 'Only 1 chapter remaining! You are very close to finishing the entire Bhagavad Gita and claiming your Certificate of Completion.'
              : completedChaptersCount >= 9
                ? `You have conquered ${completedChaptersCount} chapters! You are over halfway through and rapidly approaching completion of the entire scripture.`
                : `You are ${percent}% through! Keep this divine momentum burning as you journey towards completing the whole book and earning your Certificate.`}
          </p>
          <div className="w-full bg-black/40 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#D4A359] to-[#F3DCA7] h-full rounded-full transition-all duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>
          <div className="flex justify-between text-[9px] text-[#A2B3AA] font-mono">
            <span>{percent}% Completed</span>
            <span>{remaining} to Certificate</span>
          </div>
        </div>

        {/* Reflection Card */}
        <div className="relative z-10 p-3.5 rounded-2xl bg-white text-left space-y-1.5 shadow-md">
          <label className="text-xs font-bold text-[#1E3A2F] block">
            What stayed with you?
          </label>
          <textarea
            value={reflectionText}
            onChange={(e) => setReflectionText(e.target.value)}
            rows={2}
            placeholder="Write a short reflection..."
            className="w-full p-2.5 rounded-xl border border-[#EAE5DA] bg-[#FBF8F2] text-xs text-[#1E3A2F] placeholder:text-[#8C9892] focus:outline-none focus:border-[#1E3A2F]"
          />
        </div>

        {/* Actions (Matching Screen 9) */}
        <div className="relative z-10 space-y-2.5 pt-1">
          <button
            onClick={chapter.chapter_number < 18 ? handleNext : handleHome}
            className="w-full py-3 px-4 rounded-full bg-gradient-to-r from-[#D4A359] to-[#C79140] hover:opacity-95 text-[#1E3A2F] font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-[0.99]"
          >
            <span>Continue journey</span>
            <ArrowRight size={15} strokeWidth={2.5} />
          </button>

          <button
            onClick={handleHome}
            className="text-[11px] text-[#A2B3AA] hover:text-white transition-colors"
          >
            View chapter summary
          </button>
        </div>
      </div>
    </div>
  );
};
