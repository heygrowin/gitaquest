import React from 'react';
import { Home, BookOpen, Bookmark, Compass } from 'lucide-react';
import type { ActiveTab } from '../types';

interface NavigationProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  unreadCount?: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onSelectTab,
}) => {
  const tabs = [
    { id: 'home' as ActiveTab, label: 'Home', icon: Home },
    { id: 'chapters' as ActiveTab, label: 'Chapters', icon: BookOpen },
    { id: 'bookmarks' as ActiveTab, label: 'Saved', icon: Bookmark },
    { id: 'journey' as ActiveTab, label: 'Journey', icon: Compass },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-darkSurface/95 backdrop-blur-md border-t border-[#EAE5DA] dark:border-darkBorder bottom-bar-safe max-w-md mx-auto shadow-subtle"
      aria-label="Main Navigation"
    >
      <div className="flex items-center justify-around h-16 px-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-2xl transition-all duration-200 relative ${
                isActive
                  ? 'text-forestGreen dark:text-antiqueGold font-semibold'
                  : 'text-stone-400 dark:text-stone-500 hover:text-stone-700 dark:hover:text-stone-300'
              }`}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="relative">
                <Icon
                  size={20}
                  strokeWidth={isActive ? 2.4 : 1.8}
                  className={`transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}
                />
                {isActive && (
                  <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-forestGreen dark:bg-antiqueGold" />
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-1">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
