import React, { useState } from 'react';
import {
  X,
  Moon,
  Sun,
  Type,
  Target,
  Download,
  Upload,
  ShieldCheck,
  Check,
  Info,
  Languages,
  HelpCircle,
  Heart,
  ExternalLink,
  Smartphone,
} from 'lucide-react';
import type { UserProgress } from '../types';
import { exportUserData, importUserData, getLanguagesForPreference } from '../services/storage';
import { openDonationPage } from '../services/donation';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: UserProgress;
  onUpdateProgress: (updated: UserProgress) => void;
  onShowValidationReport?: () => void;
  onOpenTutorial?: () => void;
  onOpenInstall?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  progress,
  onUpdateProgress,
  onOpenTutorial,
  onOpenInstall,
}) => {
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [showIntegrity, setShowIntegrity] = useState(false);

  if (!isOpen) return null;

  const handleFontSizeChange = (size: 'normal' | 'large' | 'huge') => {
    onUpdateProgress({
      ...progress,
      settings: { ...progress.settings, fontSize: size },
    });
  };

  const handleThemeToggle = () => {
    const nextTheme = progress.settings.theme === 'dark' ? 'temple' : 'dark';
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    onUpdateProgress({
      ...progress,
      settings: { ...progress.settings, theme: nextTheme },
    });
  };

  const handleDailyGoalChange = (target: number, enabled = true) => {
    onUpdateProgress({
      ...progress,
      dailyGoal: { enabled, target },
    });
  };

  const handleExport = () => {
    const jsonStr = exportUserData(progress);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GitaQuest_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const restored = importUserData(content);
        onUpdateProgress(restored);
        setImportStatus('Backup restored successfully!');
        setTimeout(() => setImportStatus(null), 3500);
      } catch (err) {
        setImportStatus('Failed to restore backup: Invalid file.');
        setTimeout(() => setImportStatus(null), 4000);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#FBF8F2] dark:bg-[#121A16] pt-safe pb-safe animate-fade-in overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-[#EAE5DA] dark:border-[#2C3B33] flex items-center justify-between bg-white dark:bg-[#1E2923] sticky top-0 z-10">
        <h2 className="text-base font-bold text-[#1E3A2F] dark:text-[#E8F0EC]">
          Settings
        </h2>
        <button
          onClick={onClose}
          className="p-1.5 rounded-full text-[#8C9892] hover:text-[#1E3A2F] dark:hover:text-white"
          aria-label="Close settings"
        >
          <X size={20} />
        </button>
      </div>

      <div className="p-4 space-y-4 max-w-md mx-auto w-full pb-20">
        {/* Reading Appearance */}
        <div className="p-4 rounded-3xl bg-white dark:bg-[#1E2923] border border-[#EAE5DA] dark:border-[#2C3B33] shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#1E3A2F] dark:text-[#E8F0EC]">
            <Type size={16} className="text-[#1E3A2F] dark:text-[#64B587]" />
            <span>Reading appearance</span>
          </div>

          {/* Theme Mode */}
          <div className="flex items-center justify-between py-1">
            <span className="text-xs text-[#69756F] dark:text-[#A2B3AA]">Theme</span>
            <button
              onClick={handleThemeToggle}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#EAE5DA] dark:border-[#2C3B33] bg-[#FBF8F2] dark:bg-[#121A16] text-xs font-medium text-[#1E3A2F] dark:text-[#E8F0EC]"
            >
              {progress.settings.theme === 'dark' ? (
                <>
                  <Moon size={14} className="text-[#D4A359]" />
                  <span>Night Dark</span>
                </>
              ) : (
                <>
                  <Sun size={14} className="text-[#D4A359]" />
                  <span>Warm Ivory</span>
                </>
              )}
            </button>
          </div>

          {/* Text Size */}
          <div className="space-y-1.5 pt-1">
            <span className="text-xs text-[#69756F] dark:text-[#A2B3AA]">Text size</span>
            <div className="grid grid-cols-3 gap-2">
              {(['normal', 'large', 'huge'] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => handleFontSizeChange(size)}
                  className={`py-1.5 px-2 text-xs rounded-xl font-medium border transition-colors capitalize ${
                    progress.settings.fontSize === size
                      ? 'border-[#1E3A2F] bg-[#1E3A2F] text-white font-bold'
                      : 'border-[#EAE5DA] dark:border-[#2C3B33] text-[#69756F] dark:text-[#A2B3AA]'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* English Transliteration Toggle */}
          <div className="flex items-center justify-between py-1 border-t border-[#F2ECE1] dark:border-[#2C3B33]">
            <span className="text-xs text-[#69756F] dark:text-[#A2B3AA]">English transliteration</span>
            <button
              onClick={() =>
                onUpdateProgress({
                  ...progress,
                  settings: {
                    ...progress.settings,
                    showTransliteration: !progress.settings.showTransliteration,
                  },
                })
              }
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                progress.settings.showTransliteration ? 'bg-[#1E3A2F]' : 'bg-[#EAE5DA] dark:bg-stone-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  progress.settings.showTransliteration ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Auto-mark read */}
          <div className="flex items-center justify-between py-1">
            <span className="text-xs text-[#69756F] dark:text-[#A2B3AA]">Auto-mark read on view</span>
            <button
              onClick={() =>
                onUpdateProgress({
                  ...progress,
                  settings: {
                    ...progress.settings,
                    autoMarkRead: !progress.settings.autoMarkRead,
                  },
                })
              }
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                progress.settings.autoMarkRead ? 'bg-[#1E3A2F]' : 'bg-[#EAE5DA] dark:bg-stone-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  progress.settings.autoMarkRead ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Daily Goal */}
        <div className="p-4 rounded-3xl bg-white dark:bg-[#1E2923] border border-[#EAE5DA] dark:border-[#2C3B33] shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#1E3A2F] dark:text-[#E8F0EC]">
            <Target size={16} className="text-[#1E3A2F] dark:text-[#64B587]" />
            <span>Daily goal</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[3, 5, 10].map((t) => (
              <button
                key={t}
                onClick={() => handleDailyGoalChange(t, true)}
                className={`py-2 px-2 text-xs rounded-xl font-medium border transition-colors ${
                  progress.dailyGoal?.enabled && progress.dailyGoal?.target === t
                    ? 'border-[#1E3A2F] bg-[#1E3A2F] text-white font-bold'
                    : 'border-[#EAE5DA] dark:border-[#2C3B33] text-[#69756F] dark:text-[#A2B3AA]'
                }`}
              >
                {t} verses
              </button>
            ))}
          </div>
        </div>

        {/* Reading Languages */}
        <div className="p-4 rounded-3xl bg-white dark:bg-[#1E2923] border border-[#EAE5DA] dark:border-[#2C3B33] shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#1E3A2F] dark:text-[#E8F0EC]">
            <Languages size={16} className="text-[#1E3A2F] dark:text-[#64B587]" />
            <span>Reading languages</span>
          </div>

          <div className="space-y-2">
            {[
              { key: 'sanskrit' as const, label: 'Sanskrit original' },
              { key: 'hindi' as const, label: 'Hindi meaning' },
              { key: 'english' as const, label: 'English meaning' },
            ].map((item) => {
              const currentVis = progress.settings.visibleLanguages || getLanguagesForPreference('all');
              const isEnabled = currentVis[item.key] !== false;
              return (
                <div key={item.key} className="flex items-center justify-between py-1">
                  <span className="text-xs text-[#69756F] dark:text-[#A2B3AA]">{item.label}</span>
                  <button
                    onClick={() => {
                      const updated = { ...currentVis, [item.key]: !isEnabled };
                      onUpdateProgress({
                        ...progress,
                        settings: {
                          ...progress.settings,
                          languagePreference: 'custom',
                          visibleLanguages: updated,
                        },
                      });
                    }}
                    className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                      isEnabled ? 'bg-[#1E3A2F]' : 'bg-[#EAE5DA] dark:bg-stone-700'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white transition-transform ${
                        isEnabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Visual Tour Shortcut */}
        {onOpenTutorial && (
          <div className="p-4 rounded-3xl bg-white dark:bg-[#1E2923] border border-[#EAE5DA] dark:border-[#2C3B33] shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#F0F5F2] dark:bg-[#16291F] text-[#1E3A2F] dark:text-[#64B587] flex items-center justify-center">
                <HelpCircle size={17} />
              </div>
              <div>
                <span className="text-xs font-bold text-[#1E3A2F] dark:text-[#E8F0EC] block">
                  Visual Tour
                </span>
                <span className="text-[11px] text-[#8C9892]">
                  How to use GitaQuest
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenTutorial();
              }}
              className="px-3.5 py-1.5 rounded-full bg-[#1E3A2F] text-white text-xs font-semibold hover:opacity-90"
            >
              Start
            </button>
          </div>
        )}

        {/* Data Backup */}
        <div className="p-4 rounded-3xl bg-white dark:bg-[#1E2923] border border-[#EAE5DA] dark:border-[#2C3B33] shadow-xs space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-bold text-[#1E3A2F] dark:text-[#E8F0EC]">
            <Download size={16} className="text-[#1E3A2F] dark:text-[#64B587]" />
            <span>Data backup</span>
          </div>

          {importStatus && (
            <div className="p-2 rounded-xl bg-[#F0F5F2] border border-[#D5E2DB] text-xs text-[#1E3A2F] font-medium flex items-center gap-1.5">
              <Check size={14} />
              <span>{importStatus}</span>
            </div>
          )}

          <div className="flex gap-2 pt-1">
            <button
              onClick={handleExport}
              className="flex-1 py-2 px-3 rounded-xl border border-[#EAE5DA] dark:border-[#2C3B33] text-xs font-semibold text-[#1E3A2F] dark:text-[#E8F0EC] hover:border-[#1E3A2F] flex items-center justify-center gap-1.5"
            >
              <Download size={14} />
              <span>Export</span>
            </button>

            <label className="flex-1 py-2 px-3 rounded-xl border border-[#EAE5DA] dark:border-[#2C3B33] text-xs font-semibold text-[#1E3A2F] dark:text-[#E8F0EC] hover:border-[#1E3A2F] flex items-center justify-center gap-1.5 cursor-pointer">
              <Upload size={14} />
              <span>Restore</span>
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>
          </div>
        </div>

        {/* App & Offline Access (PWA & APK) */}
        {onOpenInstall && (
          <div className="p-4 rounded-3xl bg-white dark:bg-[#1E2923] border border-[#EAE5DA] dark:border-[#2C3B33] shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-deepForest dark:text-[#64B587] flex items-center justify-center">
                <Smartphone size={17} />
              </div>
              <div>
                <span className="text-xs font-bold text-[#1E3A2F] dark:text-[#E8F0EC] block">
                  Install App / Download APK
                </span>
                <span className="text-[11px] text-[#8C9892]">
                  Web App (PWA) or direct Android APK
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenInstall();
              }}
              className="px-3 py-1.5 rounded-full bg-[#1E3A2F] text-white text-xs font-semibold hover:opacity-90 shrink-0"
            >
              Get App
            </button>
          </div>
        )}

        {/* Support & Seva Card */}
        <div className="p-4 rounded-3xl bg-gradient-to-b from-[#FFFDF9] to-[#FAF6EE] dark:from-[#1E2923] dark:to-[#17221C] border border-[#EAE5DA] dark:border-[#2C3B33] shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart size={16} className="text-[#E07A28] fill-[#E07A28]" />
              <span className="text-xs font-bold text-[#1E3A2F] dark:text-[#E8F0EC]">Support GitaQuest (सेवा एवं दान)</span>
            </div>
            <span className="text-[10px] text-[#8C9892] font-mono">100% Ad-Free</span>
          </div>
          <p className="text-[11px] text-[#69756F] dark:text-[#A2B3AA] leading-relaxed">
            Support the ongoing development, servers, and mission to keep the sacred Gita free and accessible for all.
          </p>
          <button
            onClick={openDonationPage}
            className="w-full py-2.5 px-3 rounded-xl bg-[#1E3A2F] hover:bg-[#163125] text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-2xs transition-all"
          >
            <Heart size={13} className="text-[#F3DCA7] fill-[#F3DCA7]" />
            <span>Contribute via Razorpay / UPI</span>
            <ExternalLink size={13} className="text-white/70" />
          </button>
        </div>

        {/* Scripture Source & Integrity */}
        <div className="p-4 rounded-3xl bg-white dark:bg-[#1E2923] border border-[#EAE5DA] dark:border-[#2C3B33] shadow-xs space-y-2">
          <button
            onClick={() => setShowIntegrity(!showIntegrity)}
            className="w-full flex items-center justify-between text-xs font-bold text-[#1E3A2F] dark:text-[#E8F0EC]"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-[#1E3A2F] dark:text-[#64B587]" />
              <span>Scripture integrity</span>
            </div>
            <Info size={15} className="text-[#8C9892]" />
          </button>

          {showIntegrity && (
            <div className="text-xs text-[#69756F] dark:text-[#A2B3AA] space-y-1.5 pt-2 border-t border-[#F2ECE1] dark:border-[#2C3B33]">
              <p>
                <strong>GitaQuest Library:</strong> All 18 chapters and 701 authentic verses verified.
              </p>
              <p>
                <strong>Sanskrit:</strong> Traditional Devanagari recension.
              </p>
              <p>
                <strong>Hindi Meaning:</strong> Revered commentaries of Swami Tejomayananda & Swami Ramsukhdas.
              </p>
              <p>
                <strong>English Meaning:</strong> Revered translations by Shri Purohit Swami & Swami Sivananda.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
