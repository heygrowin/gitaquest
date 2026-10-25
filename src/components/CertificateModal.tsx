import React, { useState } from 'react';
import { X, Download, Award, Lock, Sparkles, ArrowRight } from 'lucide-react';

import type { UserProgress } from '../types';
import { shareOrDownloadCertificate } from '../services/certificate';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: UserProgress;
  onUpdateUserName: (name: string) => void;
  onOpenReader?: (chapterNumber: number, verseNumber: number) => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  progress,
  onUpdateUserName,
  onOpenReader,
}) => {
  const [nameInput, setNameInput] = useState(progress.userName || '');
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const isUnlocked = progress.completedChapters.length === 18;
  const completedCount = progress.completedChapters.length;
  const remainingCount = 18 - completedCount;

  // Find next uncompleted chapter
  let nextChapter = 1;
  for (let c = 1; c <= 18; c++) {
    if (!progress.completedChapters.includes(c)) {
      nextChapter = c;
      break;
    }
  }

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

  const handleDownload = async () => {
    if (!isUnlocked) return;
    setIsGenerating(true);
    try {
      if (nameInput.trim() && nameInput.trim() !== progress.userName) {
        onUpdateUserName(nameInput.trim());
      }
      await shareOrDownloadCertificate({
        readerName: nameInput.trim() || 'Devoted Seeker',
        completionDate,
      });
    } catch (e) {
      console.error('Error generating certificate:', e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleContinueChapters = () => {
    onClose();
    if (onOpenReader) {
      onOpenReader(nextChapter, 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#FBF8F2] dark:bg-[#121A16] pt-safe pb-safe animate-fade-in overflow-y-auto">
      {/* Top Bar */}
      <div className="p-4 border-b border-[#EAE5DA] dark:border-[#2C3B33] flex items-center justify-between bg-white dark:bg-[#1E2923] sticky top-0 z-10">
        <div className="flex items-center gap-2">
          {isUnlocked ? (
            <Award size={20} className="text-[#D4A359]" />
          ) : (
            <Lock size={18} className="text-[#8C9892]" />
          )}
          <h2 className="text-base font-bold text-[#1E3A2F] dark:text-[#E8F0EC]">
            Completion Certificate
          </h2>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-full text-[#8C9892] hover:text-[#1E3A2F] dark:hover:text-white"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>
      </div>

      <div className="p-4 space-y-4 max-w-md mx-auto w-full pb-20">
        {/* Status Card */}
        {isUnlocked ? (
          <div className="p-4 rounded-3xl bg-[#FFF8EE] border border-[#D4A359] space-y-1.5">
            <div className="flex items-center gap-2 text-[#D4A359] font-bold text-xs uppercase tracking-wide">
              <Sparkles size={16} />
              <span>Milestone Achieved!</span>
            </div>
            <p className="text-xs text-[#1E3A2F] leading-relaxed">
              Congratulations! You have read and reflected on all 18 chapters of Srimad Bhagavad Gita. Personalize your name below to download your official A4 PDF certificate.
            </p>
          </div>
        ) : (
          <div className="p-4 rounded-3xl bg-white dark:bg-[#1E2923] border border-[#EAE5DA] dark:border-[#2C3B33] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#1E3A2F] dark:text-[#E8F0EC]">
                {completedCount} of 18 chapters completed
              </span>
              <span className="font-mono text-xs font-bold text-[#D4A359]">
                {Math.round((completedCount / 18) * 100)}%
              </span>
            </div>

            <div className="w-full bg-[#F2ECE1] dark:bg-[#28362F] rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-[#1E3A2F] dark:bg-[#64B587] h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.round((completedCount / 18) * 100)}%` }}
              />
            </div>

            <p className="text-[11px] text-[#8C9892]">
              {remainingCount} more chapters to complete before unlocking your verified keepsake.
            </p>

            {/* Action button to continue reading chapters instead of fake demo */}
            <button
              type="button"
              onClick={handleContinueChapters}
              className="w-full py-3 px-4 rounded-2xl bg-[#1E3A2F] hover:bg-[#163125] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.99]"
            >
              <span>Continue Reading Chapter {nextChapter}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        )}

        {/* When Locked: Clean Locked Notice */}
        {!isUnlocked && (
          <div className="rounded-3xl p-6 bg-[#FAF6EE] dark:bg-[#1A2620] border border-[#EAE5DA] dark:border-[#2C3B33] text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-white dark:bg-[#22332B] border border-[#EAE5DA] dark:border-[#2C3B33] flex items-center justify-center text-[#8C9892]">
              <Lock size={20} />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif-heading text-sm font-bold text-[#1E3A2F] dark:text-[#E8F0EC]">
                Certificate Locked
              </h3>
              <p className="text-xs text-[#69756F] dark:text-[#A2B3AA] max-w-xs mx-auto leading-relaxed">
                Your official printable certificate unlocks automatically after you finish reading all 18 chapters and 701 authentic verses.
              </p>
            </div>
          </div>
        )}

        {/* When Unlocked: Name Input & Full Downloadable Certificate */}
        {isUnlocked && (
          <>
            {/* Name input */}
            <div className="p-4 rounded-3xl bg-white dark:bg-[#1E2923] border border-[#EAE5DA] dark:border-[#2C3B33] space-y-1.5">
              <label className="text-xs font-semibold text-[#1E3A2F] dark:text-[#E8F0EC] block">
                Name on Certificate
              </label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Enter your name (e.g. Priyanshu Sharma)"
                className="w-full p-2.5 rounded-xl border border-[#EAE5DA] dark:border-[#2C3B33] bg-[#FBF8F2] dark:bg-[#121A16] text-xs text-[#1E3A2F] dark:text-[#E8F0EC] focus:outline-none focus:border-[#1E3A2F]"
              />
            </div>

            {/* Certificate Mockup Preview */}
            <div className="relative rounded-3xl p-5 bg-[#FAF6EE] text-[#1E3A2F] border-2 border-[#D4A359] space-y-3 text-center overflow-hidden">
              <div className="border border-[#D4A359]/50 p-4 rounded-2xl space-y-2.5 bg-white/70">
                <div className="w-8 h-8 mx-auto flex items-center justify-center">
                  <img src="/gitaquest_logo.svg" alt="" className="w-7 h-7 object-contain" />
                </div>

                <div className="space-y-0.5">
                  <span className="text-[11px] font-serif font-bold text-[#1E3A2F] block">
                    GitaQuest
                  </span>
                  <p className="text-[9px] uppercase tracking-wider text-[#D4A359] font-bold">
                    Bhagavad Gita Reading Journey
                  </p>
                  <h4 className="font-serif-heading text-sm font-bold text-[#1E3A2F]">
                    Certificate of Completion
                  </h4>
                </div>

                <p className="text-[9px] text-[#8C9892]">Presented to</p>

                <div className="py-1 border-b border-[#D4A359]/50 max-w-[180px] mx-auto">
                  <span className="font-serif-heading text-sm font-bold text-[#1E3A2F]">
                    {nameInput.trim() || 'Your Name'}
                  </span>
                </div>

                <p className="text-[9px] text-[#69756F] max-w-xs mx-auto leading-relaxed">
                  For reading all 18 chapters of the Bhagavad Gita
                </p>

                <div className="inline-block px-3 py-1 rounded bg-[#FFFCF7] border border-[#D4A359]/40 text-[8px] font-bold text-[#D4A359]">
                  18 CHAPTERS • 701 AUTHENTIC VERSES
                </div>

                <div className="pt-2 flex items-center justify-between text-[7.5px] text-[#8C9892] border-t border-[#D4A359]/30 px-2">
                  <span>{completionDate}</span>
                  <span className="italic text-[#D4A359]">A personal reading milestone</span>
                </div>
              </div>
            </div>

            {/* Download Button */}
            <button
              onClick={handleDownload}
              disabled={isGenerating}
              className="w-full py-3.5 px-4 rounded-full bg-[#1E3A2F] hover:bg-[#163125] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99] disabled:opacity-50"
            >
              <Download size={16} />
              <span>{isGenerating ? 'Generating PDF...' : 'Download Certificate (PDF)'}</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};
