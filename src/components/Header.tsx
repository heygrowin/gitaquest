import React from 'react';
import { Search, Settings, Smartphone } from 'lucide-react';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenSettings: () => void;
  onOpenInstall?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSearch, onOpenSettings, onOpenInstall }) => {
  return (
    <header className="sticky top-0 z-30 bg-warmIvory/90 dark:bg-darkBg/90 backdrop-blur-md pt-safe border-b border-[#EAE5DA] dark:border-darkBorder px-4 py-3 flex items-center justify-between transition-colors">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-white dark:bg-darkCard border border-[#EAE5DA] dark:border-darkBorder flex items-center justify-center p-1 shadow-xs">
          <img src="/gitaquest_logo.svg" alt="GitaQuest" className="w-full h-full object-contain" />
        </div>
        <div>
          <h1 className="font-serif-heading text-base font-bold tracking-tight text-deepForest dark:text-darkText leading-none">
            GitaQuest
          </h1>
          <p className="text-[10px] text-sageMuted dark:text-antiqueGold font-medium tracking-wide mt-0.5">
            Read. Reflect. Grow.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        {onOpenInstall && (
          <button
            onClick={onOpenInstall}
            className="p-2 rounded-xl text-deepForest dark:text-antiqueGold hover:bg-black/5 dark:hover:bg-white/5 transition-colors relative"
            aria-label="Install App or Download APK"
            title="Install App / Download APK"
          >
            <Smartphone size={19} strokeWidth={1.8} />
          </button>
        )}
        <button
          onClick={onOpenSearch}
          className="p-2 rounded-xl text-stone-600 dark:text-darkText hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          aria-label="Search scripture"
        >
          <Search size={19} strokeWidth={1.8} />
        </button>
        <button
          onClick={onOpenSettings}
          className="p-2 rounded-xl text-stone-600 dark:text-darkText hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          aria-label="Settings"
        >
          <Settings size={19} strokeWidth={1.8} />
        </button>
      </div>
    </header>
  );
};
