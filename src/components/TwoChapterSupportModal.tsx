import React from 'react';
import { Heart, Sparkles, Flame, X, ExternalLink } from 'lucide-react';

export interface SupportModalProps {
  isOpen: boolean;
  reason?: 'chapters' | 'streak';
  chaptersCount?: number;
  streakDays?: number;
  onConfirmSupport: () => void;
  onDecline: () => void;
}

export const TwoChapterSupportModal: React.FC<SupportModalProps> = ({
  isOpen,
  reason = 'chapters',
  chaptersCount = 2,
  streakDays = 3,
  onConfirmSupport,
  onDecline,
}) => {
  if (!isOpen) return null;

  const isStreak = reason === 'streak';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="support-dialog-title"
    >
      <div className="relative w-full max-w-sm rounded-3xl bg-warmIvory dark:bg-darkCard border border-[#EAE5DA] dark:border-darkBorder shadow-2xl p-6 text-center overflow-hidden">
        {/* Subtle decorative aura */}
        <div className="absolute -top-16 -right-16 w-36 h-36 rounded-full bg-antiqueGold/15 dark:bg-antiqueGold/10 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-36 h-36 rounded-full bg-deepForest/10 dark:bg-emerald-950/20 blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onDecline}
          className="absolute top-4 right-4 p-1.5 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors"
          aria-label="Close dialog"
        >
          <X size={18} />
        </button>

        {/* Icon & Milestone Badge */}
        <div className="flex flex-col items-center mb-3">
          <div className="w-14 h-14 rounded-2xl bg-white dark:bg-[#1A2620] border border-[#EAE5DA] dark:border-darkBorder shadow-xs flex items-center justify-center p-2 mb-2 relative">
            <img src="./gitaquest_logo.svg" alt="GitaQuest" className="w-full h-full object-contain" />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#E07A28] flex items-center justify-center text-white shadow-xs">
              {isStreak ? <Flame size={13} fill="currentColor" /> : <Heart size={13} fill="currentColor" />}
            </div>
          </div>

          {isStreak ? (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-300 text-[11px] font-semibold tracking-wide">
              <Flame size={12} className="text-[#E07A28] fill-[#E07A28]" />
              {streakDays}-Day Sadhana Streak!
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-antiqueGold/15 text-deepForest dark:text-[#E8F0EC] text-[11px] font-semibold tracking-wide">
              <Sparkles size={12} className="text-antiqueGold" />
              {chaptersCount} Chapters Completed!
            </span>
          )}
        </div>

        {/* Title */}
        <h3
          id="support-dialog-title"
          className="font-serif-heading text-lg font-bold text-deepForest dark:text-darkText tracking-tight mb-2"
        >
          {isStreak ? 'Support the Developer' : 'Support GitaQuest & Creator'}
        </h3>

        {/* Prompt Body */}
        <p className="text-xs text-stone-600 dark:text-darkMuted leading-relaxed mb-5">
          {isStreak ? (
            <>
              You have maintained your sacred Gita reading streak for <strong>{streakDays} days</strong>! 🙏
              <br /><br />
              Would you like to support the developer to maintain this app, server costs, and make more useful apps?
              <br /><br />
              <span className="italic text-stone-500 dark:text-stone-400">
                If not, it's completely okay — you can continue reading 100% free forever.
              </span>
            </>
          ) : (
            <>
              You have completed <strong>{chaptersCount} chapters</strong> of the Bhagavad Gita! 🙏
              <br /><br />
              Would you like to support the developer to maintain this software and create more useful spiritual tools?
              <br /><br />
              <span className="italic text-stone-500 dark:text-stone-400">
                If not, that is completely okay — GitaQuest is and will always remain 100% free.
              </span>
            </>
          )}
        </p>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <button
            onClick={onConfirmSupport}
            className="w-full py-3 px-4 rounded-2xl bg-deepForest hover:bg-[#163125] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all transform active:scale-[0.99]"
          >
            <Heart size={15} className="text-[#F3DCA7] fill-[#F3DCA7]" />
            <span>Yes, Support (Razorpay / UPI)</span>
            <ExternalLink size={13} className="text-white/70" />
          </button>

          <button
            onClick={onDecline}
            className="w-full py-2.5 px-4 rounded-2xl border border-stone-200 dark:border-darkBorder text-stone-600 dark:text-darkMuted hover:bg-black/5 dark:hover:bg-white/5 text-xs font-medium transition-colors"
          >
            Continue for Free
          </button>
        </div>

        <p className="text-[10px] text-stone-400 dark:text-stone-500 mt-3 font-mono">
          Supports GPay, PhonePe, Paytm, Cards & UPI
        </p>
      </div>
    </div>
  );
};
