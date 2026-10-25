import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  Sparkles,
  Flame,
  Award,
  Check,
} from 'lucide-react';
import type { UserProgress, LanguagePreference, VisibleLanguages } from '../types';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (updatedProgress: UserProgress) => void;
  onClose?: () => void;
  progress: UserProgress;
  initialStep?: number;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onComplete,
  onClose,
  progress,
  initialStep = 0,
}) => {
  // Steps: 0: Welcome, 1: Daily goal, 2: Reading languages, 3: Visual tour
  const [step, setStep] = useState<number>(initialStep);

  // Sync step when initialStep changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setStep(initialStep);
      setTourSlide(0);
    }
  }, [isOpen, initialStep]);

  // Goal state (3, 5, 10 verses)
  const [dailyTarget, setDailyTarget] = useState<number>(progress.dailyGoal?.target || 5);

  // Language state (Sanskrit, Hindi, English toggles)
  const [sanskritOn, setSanskritOn] = useState<boolean>(
    progress.settings.visibleLanguages?.sanskrit ?? true
  );
  const [hindiOn, setHindiOn] = useState<boolean>(
    progress.settings.visibleLanguages?.hindi ?? true
  );
  const [englishOn, setEnglishOn] = useState<boolean>(
    progress.settings.visibleLanguages?.english ?? true
  );

  // Tour slide state
  const [tourSlide, setTourSlide] = useState<number>(0);

  if (!isOpen) return null;

  const handleFinish = () => {
    // Ensure at least one language is active
    const finalSanskrit = sanskritOn || (!hindiOn && !englishOn);
    const finalHindi = hindiOn;
    const finalEnglish = englishOn || (!sanskritOn && !hindiOn);

    let pref: LanguagePreference = 'all';
    if (finalSanskrit && finalHindi && finalEnglish) pref = 'all';
    else if (finalSanskrit && finalHindi) pref = 'sanskrit_hindi';
    else if (finalSanskrit && finalEnglish) pref = 'sanskrit_english';
    else if (finalHindi && !finalSanskrit && !finalEnglish) pref = 'hindi_only';
    else if (finalEnglish && !finalSanskrit && !finalHindi) pref = 'english_only';
    else if (finalSanskrit && !finalHindi && !finalEnglish) pref = 'sanskrit_only';
    else pref = 'custom';

    const visibleLanguages: VisibleLanguages = {
      sanskrit: finalSanskrit,
      transliteration: finalSanskrit,
      hindi: finalHindi,
      english: finalEnglish,
      wordMeaning: false,
    };

    const finalName = progress.userName?.trim() || 'Devoted Seeker';

    const updated: UserProgress = {
      ...progress,
      userName: finalName,
      userProfile: {
        name: finalName,
        email: '',
        authProvider: 'guest',
      },
      dailyGoal: {
        enabled: true,
        target: dailyTarget,
        purpose: 'Read. Reflect. Grow.',
      },
      hasCompletedOnboarding: true,
      settings: {
        ...progress.settings,
        languagePreference: pref,
        visibleLanguages,
      },
    };
    onComplete(updated);
    onClose?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#FBF8F2] dark:bg-[#121A16] text-[#1E3A2F] dark:text-[#E8F0EC] pt-safe pb-safe animate-fade-in font-sans">
      <div className="flex-1 max-w-sm mx-auto w-full px-5 py-4 flex flex-col justify-between overflow-hidden">
        
        {/* ================= SCREEN 1: WELCOME (Pure Guest, Zero Friction) ================= */}
        {step === 0 && (
          <div className="flex-1 flex flex-col justify-between animate-fade-in overflow-y-auto pb-4">
            {/* Top Branding */}
            <div className="text-center pt-2 space-y-1.5 shrink-0">
              <div className="w-14 h-14 mx-auto flex items-center justify-center">
                <img src="/gitaquest_logo.svg" alt="GitaQuest Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <h1 className="font-serif-heading text-2xl font-bold tracking-tight text-[#1E3A2F] dark:text-[#E8F0EC]">
                  GitaQuest
                </h1>
                <p className="text-xs text-[#69756F] dark:text-[#D4A359] font-medium tracking-wide mt-0.5">
                  Read. Reflect. Grow.
                </p>
              </div>
            </div>

            {/* Serene Mountain Artwork */}
            <div className="my-4 rounded-2xl overflow-hidden shadow-sm border border-[#EAE5DA] dark:border-[#2C3B33] shrink-0">
              <img
                src="/gitaquest_welcome_art.svg"
                alt="Sacred landscape"
                className="w-full h-44 object-cover"
              />
            </div>

            {/* Direct Guest Start Button */}
            <div className="space-y-3 pt-2 shrink-0">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full py-3.5 px-4 rounded-2xl bg-[#1E3A2F] hover:bg-[#163125] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99]"
              >
                <span>Begin Journey</span>
                <ArrowRight size={15} />
              </button>

              <p className="text-[11px] text-center text-[#8C9892] dark:text-[#A2B3AA]">
                Your journey. Your pace. Always private.
              </p>
            </div>
          </div>
        )}

        {/* ================= SCREEN 2: CHOOSE GOAL ================= */}
        {step === 1 && (
          <div className="flex-1 flex flex-col justify-between animate-fade-in overflow-y-auto pb-4">
            <div className="space-y-5 pt-2">
              {/* Header Icon */}
              <div className="w-8 h-8 mx-auto rounded-full bg-[#1E3A2F]/10 dark:bg-[#D4A359]/20 flex items-center justify-center text-[#1E3A2F] dark:text-[#D4A359]">
                <img src="/gitaquest_logo.svg" alt="" className="w-5 h-5 object-contain" />
              </div>

              <div className="text-center space-y-1">
                <h2 className="font-serif-heading text-xl font-bold text-[#1E3A2F] dark:text-[#E8F0EC]">
                  Daily goal
                </h2>
                <p className="text-xs text-[#69756F] dark:text-[#A2B3AA]">
                  How many verses do you want to read each day?
                </p>
              </div>

              {/* 3 Goal Cards Side by Side */}
              <div className="grid grid-cols-3 gap-2.5 pt-2">
                {[
                  { verses: 3, label: 'Gentle start', icon: '🌱' },
                  { verses: 5, label: 'Balanced', icon: '🪔' },
                  { verses: 10, label: 'Deep dive', icon: '🌊' },
                ].map((item) => {
                  const isSelected = dailyTarget === item.verses;
                  return (
                    <button
                      key={item.verses}
                      type="button"
                      onClick={() => setDailyTarget(item.verses)}
                      className={`py-5 px-2 rounded-2xl border text-center transition-all flex flex-col items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-white dark:bg-[#1E2923] border-[#1E3A2F] dark:border-[#D4A359] shadow-md ring-2 ring-[#1E3A2F] dark:ring-[#D4A359]'
                          : 'bg-white/90 dark:bg-[#1E2923]/90 border-[#EAE5DA] dark:border-[#2C3B33] hover:border-[#1E3A2F]/40'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <span className="font-serif-heading text-2xl font-bold text-[#1E3A2F] dark:text-[#E8F0EC] block leading-none">
                          {item.verses}
                        </span>
                        <span className="text-[11px] text-[#69756F] dark:text-[#A2B3AA] block">
                          verses
                        </span>
                      </div>

                      <div className="space-y-1">
                        <span className="text-lg block">{item.icon}</span>
                        <span className="text-[10px] font-semibold text-[#1E3A2F] dark:text-[#E8F0EC] block leading-tight">
                          {item.label}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Prominent Continue Button */}
            <div className="pt-6 shrink-0">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full py-3.5 rounded-2xl bg-[#1E3A2F] hover:bg-[#163125] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99]"
              >
                <span>Continue</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        )}

        {/* ================= SCREEN 3: READING LANGUAGES ================= */}
        {step === 2 && (
          <div className="flex-1 flex flex-col justify-between animate-fade-in overflow-y-auto pb-4">
            <div className="space-y-5 pt-2">
              {/* Header Icon */}
              <div className="w-8 h-8 mx-auto rounded-full bg-[#1E3A2F]/10 dark:bg-[#D4A359]/20 flex items-center justify-center text-[#1E3A2F] dark:text-[#D4A359]">
                <img src="/gitaquest_logo.svg" alt="" className="w-5 h-5 object-contain" />
              </div>

              <div className="text-center space-y-1">
                <h2 className="font-serif-heading text-xl font-bold text-[#1E3A2F] dark:text-[#E8F0EC]">
                  Reading languages
                </h2>
                <p className="text-xs text-[#69756F] dark:text-[#A2B3AA]">
                  Choose which languages to show in the reader.
                </p>
              </div>

              {/* 3 Prominent, Tactile Toggle Cards */}
              <div className="space-y-3 pt-1">
                {/* Sanskrit Toggle */}
                <div
                  className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                    sanskritOn
                      ? 'bg-white dark:bg-[#1E2923] border-[#1E3A2F] shadow-sm'
                      : 'bg-white/70 dark:bg-[#1E2923]/70 border-[#EAE5DA] dark:border-[#2C3B33] opacity-80'
                  }`}
                  onClick={() => setSanskritOn(!sanskritOn)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#FAF6EE] dark:bg-[#28362F] border border-[#EAE5DA] dark:border-[#2C3B33] flex items-center justify-center font-shloka font-bold text-xs text-[#1E3A2F] dark:text-[#D4A359]">
                      सं
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#1E3A2F] dark:text-[#E8F0EC] block leading-tight">
                        Sanskrit
                      </span>
                      <span className="text-[11px] text-[#8C9892] dark:text-[#A2B3AA]">
                        Original shloka
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold uppercase ${sanskritOn ? 'text-[#1E3A2F] dark:text-[#64B587]' : 'text-stone-400'}`}>
                      {sanskritOn ? 'ON' : 'OFF'}
                    </span>
                    {/* Big tactile switch */}
                    <div
                      className={`w-12 h-7 rounded-full transition-colors relative p-0.5 shadow-inner ${
                        sanskritOn ? 'bg-[#1E3A2F]' : 'bg-[#D5DDD8] dark:bg-stone-700'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full bg-white shadow-md transition-transform flex items-center justify-center ${
                          sanskritOn ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      >
                        {sanskritOn && <Check size={11} className="text-[#1E3A2F]" strokeWidth={3} />}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hindi Toggle */}
                <div
                  className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                    hindiOn
                      ? 'bg-white dark:bg-[#1E2923] border-[#1E3A2F] shadow-sm'
                      : 'bg-white/70 dark:bg-[#1E2923]/70 border-[#EAE5DA] dark:border-[#2C3B33] opacity-80'
                  }`}
                  onClick={() => setHindiOn(!hindiOn)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#FAF6EE] dark:bg-[#28362F] border border-[#EAE5DA] dark:border-[#2C3B33] flex items-center justify-center font-shloka font-bold text-xs text-[#1E3A2F] dark:text-[#D4A359]">
                      अ
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#1E3A2F] dark:text-[#E8F0EC] block leading-tight">
                        Hindi
                      </span>
                      <span className="text-[11px] text-[#8C9892] dark:text-[#A2B3AA]">
                        Meaning in Hindi
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold uppercase ${hindiOn ? 'text-[#1E3A2F] dark:text-[#64B587]' : 'text-stone-400'}`}>
                      {hindiOn ? 'ON' : 'OFF'}
                    </span>
                    <div
                      className={`w-12 h-7 rounded-full transition-colors relative p-0.5 shadow-inner ${
                        hindiOn ? 'bg-[#1E3A2F]' : 'bg-[#D5DDD8] dark:bg-stone-700'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full bg-white shadow-md transition-transform flex items-center justify-center ${
                          hindiOn ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      >
                        {hindiOn && <Check size={11} className="text-[#1E3A2F]" strokeWidth={3} />}
                      </div>
                    </div>
                  </div>
                </div>

                {/* English Toggle */}
                <div
                  className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                    englishOn
                      ? 'bg-white dark:bg-[#1E2923] border-[#1E3A2F] shadow-sm'
                      : 'bg-white/70 dark:bg-[#1E2923]/70 border-[#EAE5DA] dark:border-[#2C3B33] opacity-80'
                  }`}
                  onClick={() => setEnglishOn(!englishOn)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#FAF6EE] dark:bg-[#28362F] border border-[#EAE5DA] dark:border-[#2C3B33] flex items-center justify-center font-sans font-bold text-xs text-[#1E3A2F] dark:text-[#D4A359]">
                      A
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#1E3A2F] dark:text-[#E8F0EC] block leading-tight">
                        English
                      </span>
                      <span className="text-[11px] text-[#8C9892] dark:text-[#A2B3AA]">
                        Meaning in English
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold uppercase ${englishOn ? 'text-[#1E3A2F] dark:text-[#64B587]' : 'text-stone-400'}`}>
                      {englishOn ? 'ON' : 'OFF'}
                    </span>
                    <div
                      className={`w-12 h-7 rounded-full transition-colors relative p-0.5 shadow-inner ${
                        englishOn ? 'bg-[#1E3A2F]' : 'bg-[#D5DDD8] dark:bg-stone-700'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full bg-white shadow-md transition-transform flex items-center justify-center ${
                          englishOn ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      >
                        {englishOn && <Check size={11} className="text-[#1E3A2F]" strokeWidth={3} />}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Prominent Continue Button */}
            <div className="pt-6 shrink-0">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="w-full py-3.5 rounded-2xl bg-[#1E3A2F] hover:bg-[#163125] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99]"
              >
                <span>Continue</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        )}

        {/* ================= SCREEN 4: VISUAL TOUR ================= */}
        {step === 3 && (
          <div className="flex-1 flex flex-col justify-between animate-fade-in overflow-y-auto pb-4">
            <div className="space-y-4 pt-2">
              {/* Header Icon */}
              <div className="w-8 h-8 mx-auto rounded-full bg-[#1E3A2F]/10 dark:bg-[#D4A359]/20 flex items-center justify-center text-[#1E3A2F] dark:text-[#D4A359]">
                <img src="/gitaquest_logo.svg" alt="" className="w-5 h-5 object-contain" />
              </div>

              {/* Slide 0: Read Three Ways */}
              {tourSlide === 0 && (
                <div className="space-y-4 animate-fade-in text-center">
                  <div>
                    <h2 className="font-serif-heading text-lg font-bold text-[#1E3A2F] dark:text-[#E8F0EC]">
                      Read three ways
                    </h2>
                    <p className="text-xs text-[#69756F] dark:text-[#A2B3AA] mt-0.5">
                      Sanskrit, Hindi, and English in a clean layout.
                    </p>
                  </div>

                  <div className="rounded-2xl p-4 bg-white dark:bg-[#1E2923] border border-[#EAE5DA] dark:border-[#2C3B33] shadow-sm space-y-3 text-left">
                    <p className="font-shloka text-center text-xs font-bold text-[#1E3A2F] dark:text-[#E8F0EC] leading-relaxed">
                      योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय ॥
                    </p>

                    <div className="space-y-2 pt-1 text-[11px]">
                      <div className="p-2 rounded-xl bg-[#FAF6EE] dark:bg-[#28362F] border border-[#EAE5DA] dark:border-[#2C3B33] flex items-center gap-2 text-[#1E3A2F] dark:text-[#D4A359] font-semibold">
                        <span>सं</span>
                        <span>Sanskrit original</span>
                      </div>
                      <div className="p-2 rounded-xl bg-[#FAF6EE] dark:bg-[#28362F] border border-[#EAE5DA] dark:border-[#2C3B33] flex items-center gap-2 text-[#69756F] dark:text-[#A2B3AA]">
                        <span>अ</span>
                        <span>Hindi meaning</span>
                      </div>
                      <div className="p-2 rounded-xl bg-[#FAF6EE] dark:bg-[#28362F] border border-[#EAE5DA] dark:border-[#2C3B33] flex items-center gap-2 text-[#69756F] dark:text-[#A2B3AA]">
                        <span>A</span>
                        <span>English meaning</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Slide 1: Daily Streak & Goals */}
              {tourSlide === 1 && (
                <div className="space-y-4 animate-fade-in text-center">
                  <div>
                    <h2 className="font-serif-heading text-lg font-bold text-[#1E3A2F] dark:text-[#E8F0EC]">
                      Daily streak & goals
                    </h2>
                    <p className="text-xs text-[#69756F] dark:text-[#A2B3AA] mt-0.5">
                      Never break your reading flame.
                    </p>
                  </div>

                  <div className="rounded-2xl p-5 bg-white dark:bg-[#1E2923] border border-[#EAE5DA] dark:border-[#2C3B33] shadow-sm space-y-4">
                    <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-[#FFF6E5] dark:bg-[#2C2317] border border-[#F3DCA7] dark:border-[#4B3923] text-[#C76A24] dark:text-[#D4A359]">
                      <Flame size={20} className="fill-[#C76A24] dark:fill-[#D4A359]" />
                      <span className="font-serif-heading font-bold text-sm">
                        7 Days Sacred Streak
                      </span>
                    </div>

                    <div className="flex justify-around items-center pt-1">
                      {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
                        <div key={idx} className="flex flex-col items-center gap-1">
                          <span className="text-[10px] text-[#8C9892] font-mono">{day}</span>
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                              idx < 5
                                ? 'bg-[#1E3A2F] text-white shadow-xs'
                                : 'bg-[#EAE5DA] dark:bg-stone-700 text-[#8C9892]'
                            }`}
                          >
                            {idx < 5 ? '✓' : ''}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Slide 2: Journey & Certificate */}
              {tourSlide === 2 && (
                <div className="space-y-4 animate-fade-in text-center">
                  <div>
                    <h2 className="font-serif-heading text-lg font-bold text-[#1E3A2F] dark:text-[#E8F0EC]">
                      Journey & certificate
                    </h2>
                    <p className="text-xs text-[#69756F] dark:text-[#A2B3AA] mt-0.5">
                      Earn your printable A4 milestone certificate.
                    </p>
                  </div>

                  <div className="rounded-2xl p-4 bg-white dark:bg-[#1E2923] border border-[#EAE5DA] dark:border-[#2C3B33] shadow-sm space-y-3">
                    <div className="w-12 h-12 mx-auto rounded-full bg-[#FAF6EE] dark:bg-[#28362F] border-2 border-[#D4A359] flex items-center justify-center text-[#D4A359] shadow-sm">
                      <Award size={24} />
                    </div>

                    <div className="space-y-1">
                      <span className="text-xs font-bold text-[#1E3A2F] dark:text-[#E8F0EC] block">
                        Completion Certificate
                      </span>
                      <p className="text-[11px] text-[#8C9892] leading-tight">
                        Unlocks exclusively after reading all 18 chapters and 701 authentic verses.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Dots Indicator */}
              <div className="flex items-center justify-center gap-1.5 pt-2">
                {[0, 1, 2].map((idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setTourSlide(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      tourSlide === idx
                        ? 'w-6 bg-[#1E3A2F] dark:bg-[#D4A359]'
                        : 'w-1.5 bg-[#D5DDD8] dark:bg-stone-700'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Bottom Row: Skip & Next / Finish (Always Visible) */}
            <div className="flex items-center justify-between gap-4 pt-4 shrink-0">
              <button
                type="button"
                onClick={handleFinish}
                className="text-xs font-semibold text-[#69756F] dark:text-[#A2B3AA] hover:text-[#1E3A2F] py-3 px-2"
              >
                Skip
              </button>

              {tourSlide < 2 ? (
                <button
                  type="button"
                  onClick={() => setTourSlide(tourSlide + 1)}
                  className="py-3 px-6 rounded-2xl bg-[#1E3A2F] hover:bg-[#163125] text-white font-semibold text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-[0.99]"
                >
                  <span>Next</span>
                  <ArrowRight size={14} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleFinish}
                  className="py-3 px-6 rounded-2xl bg-[#1E3A2F] hover:bg-[#163125] text-white font-semibold text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-[0.99]"
                >
                  <span>Get Started</span>
                  <Sparkles size={14} />
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
