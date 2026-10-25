import React, { useState, useEffect } from 'react';
import {
  X,
  Smartphone,
  Download,
  CheckCircle2,
  Share2,
  Sparkles,
  WifiOff,
  Zap,
  ExternalLink,
} from 'lucide-react';

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PLAY_STORE_TESTING_URL = 'https://play.google.com/apps/testing/com.gitaquest.app';

export const InstallAppModal: React.FC<InstallAppModalProps> = ({ isOpen, onClose }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isAppleDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isAppleDevice);

    // Detect if already running in standalone mode (PWA installed)
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    setIsInstalled(isStandalone);

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  if (!isOpen) return null;

  const handleInstallPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
        setDeferredPrompt(null);
      }
    } else {
      if (isIOS) {
        alert("To install on iOS: Tap the Share button (⎙) in Safari, then select 'Add to Home Screen' (+).");
      } else {
        alert("To install on your device: Open your browser's menu (⋮) and tap 'Install app' or 'Add to Home Screen'.");
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="install-dialog-title"
    >
      <div className="relative w-full max-w-sm rounded-3xl bg-warmIvory dark:bg-darkCard border border-[#EAE5DA] dark:border-darkBorder shadow-2xl p-5 text-left overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors"
          aria-label="Close dialog"
        >
          <X size={18} />
        </button>

        {/* Title & Header */}
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-9 h-9 rounded-xl bg-white dark:bg-[#1A2620] border border-[#EAE5DA] dark:border-darkBorder flex items-center justify-center p-1.5 shadow-2xs">
            <img src="./gitaquest_logo.svg" alt="GitaQuest" className="w-full h-full object-contain" />
          </div>
          <div>
            <h3
              id="install-dialog-title"
              className="font-serif-heading text-base font-bold text-deepForest dark:text-darkText leading-tight"
            >
              Get GitaQuest App
            </h3>
            <p className="text-[11px] text-stone-500 dark:text-darkMuted">
              Play Store Beta • Web App • Direct APK
            </p>
          </div>
        </div>

        {/* Highlights */}
        <div className="flex items-center justify-around py-2.5 my-3 rounded-2xl bg-white/70 dark:bg-darkBg/60 border border-[#EAE5DA] dark:border-darkBorder text-[11px] text-stone-600 dark:text-darkMuted">
          <div className="flex items-center gap-1">
            <WifiOff size={13} className="text-antiqueGold" />
            <span>100% Offline</span>
          </div>
          <span className="text-stone-300 dark:text-stone-700">•</span>
          <div className="flex items-center gap-1">
            <Zap size={13} className="text-[#E07A28]" />
            <span>Instant Load</span>
          </div>
          <span className="text-stone-300 dark:text-stone-700">•</span>
          <div className="flex items-center gap-1">
            <Sparkles size={13} className="text-deepForest dark:text-[#64B587]" />
            <span>Ad-Free</span>
          </div>
        </div>

        <div className="space-y-2.5">
          {/* Option 1: Google Play Store Early Access */}
          <div className="p-3.5 rounded-2xl bg-white dark:bg-[#1E2923] border border-[#D4A359]/40 shadow-2xs space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-deepForest dark:text-[#64B587] flex items-center justify-center">
                  <Smartphone size={15} />
                </div>
                <span className="text-xs font-bold text-deepForest dark:text-darkText">
                  Google Play Early Access
                </span>
              </div>
              <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                Play Store
              </span>
            </div>

            <p className="text-[11px] text-stone-500 dark:text-darkMuted leading-relaxed">
              Join the official Google Play closed test group to test and receive automatic updates through the Play Store.
            </p>

            <a
              href={PLAY_STORE_TESTING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-3 rounded-xl bg-deepForest hover:bg-[#163125] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-2xs transition-colors"
            >
              <span>Join on Google Play</span>
              <ExternalLink size={13} className="text-white/80" />
            </a>
          </div>

          {/* Option 2: PWA Web App */}
          <div className="p-3.5 rounded-2xl bg-white dark:bg-[#1E2923] border border-[#EAE5DA] dark:border-darkBorder shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 flex items-center justify-center">
                  <Sparkles size={15} />
                </div>
                <span className="text-xs font-bold text-deepForest dark:text-darkText">
                  Web App (PWA)
                </span>
              </div>
              <span className="text-[10px] font-semibold text-antiqueGold bg-antiqueGold/10 px-2 py-0.5 rounded-full">
                Instant • 0 MB
              </span>
            </div>

            <p className="text-[11px] text-stone-500 dark:text-darkMuted leading-relaxed">
              Adds GitaQuest to your home screen or desktop. Works on any phone or PC, 100% offline.
            </p>

            {isInstalled ? (
              <div className="flex items-center gap-1.5 py-1 text-xs text-emerald-700 dark:text-emerald-400 font-semibold">
                <CheckCircle2 size={15} />
                <span>Already installed on this device!</span>
              </div>
            ) : isIOS ? (
              <div className="p-2 rounded-xl bg-[#FAF6EE] dark:bg-[#16221B] border border-[#EAE5DA] dark:border-darkBorder text-[11px] text-stone-700 dark:text-darkMuted space-y-0.5">
                <div className="flex items-center gap-1 font-semibold text-deepForest dark:text-antiqueGold">
                  <Share2 size={12} />
                  <span>iOS Safari Install:</span>
                </div>
                <p>Tap Share (⎙) → <strong>Add to Home Screen</strong> (+)</p>
              </div>
            ) : (
              <button
                onClick={handleInstallPWA}
                className="w-full py-2 px-3 rounded-xl border border-deepForest text-deepForest dark:text-[#E8F0EC] dark:border-darkBorder hover:bg-black/5 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <Smartphone size={14} />
                <span>Add Web App to Home Screen</span>
              </button>
            )}
          </div>

          {/* Option 3: Direct APK Download */}
          <div className="p-3.5 rounded-2xl bg-white dark:bg-[#1E2923] border border-[#EAE5DA] dark:border-darkBorder shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 flex items-center justify-center">
                  <Download size={15} />
                </div>
                <span className="text-xs font-bold text-deepForest dark:text-darkText">
                  Direct Android APK
                </span>
              </div>
              <span className="text-[10px] text-stone-400 font-mono">4.3 MB</span>
            </div>

            <p className="text-[11px] text-stone-500 dark:text-darkMuted leading-relaxed">
              Directly download the signed release package to install on Android without stores.
            </p>

            <a
              href="./GitaQuest.apk"
              download="GitaQuest.apk"
              className="w-full py-2 px-3 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-200 hover:bg-black/5 text-xs font-medium flex items-center justify-center gap-2 transition-colors text-center"
            >
              <Download size={13} />
              <span>Download GitaQuest.apk</span>
            </a>
          </div>
        </div>

        <p className="text-[10px] text-center text-stone-400 dark:text-stone-500 mt-3 font-mono">
          Safe • Offline • Clean • Ad-Free
        </p>
      </div>
    </div>
  );
};
