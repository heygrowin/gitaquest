import React, { useState, useEffect } from 'react';
import type { UserProgress, ActiveTab } from './types';
import {
  loadUserProgress,
  saveUserProgress,
  saveChapterReflection,
  markChapterCelebrated,
  markTwoChapterPromptShown,
  markStreakPromptShown,
  scriptureData,
} from './services/storage';
import { openDonationPage } from './services/donation';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { HomeScreen } from './components/HomeScreen';
import { ChaptersScreen } from './components/ChaptersScreen';
import { BookmarksScreen } from './components/BookmarksScreen';
import { JourneyScreen } from './components/JourneyScreen';
import { ReaderScreen } from './components/ReaderScreen';
import { SearchModal } from './components/SearchModal';
import { SettingsModal } from './components/SettingsModal';
import { ChapterCelebrationModal } from './components/ChapterCelebrationModal';
import { CertificateModal } from './components/CertificateModal';
import { OnboardingModal } from './components/OnboardingModal';
import { InstallAppModal } from './components/InstallAppModal';
import { TwoChapterSupportModal } from './components/TwoChapterSupportModal';
import { App as CapApp } from '@capacitor/app';

export const App: React.FC = () => {
  const [progress, setProgress] = useState<UserProgress>(loadUserProgress);
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [readingLocation, setReadingLocation] = useState<{ chapter: number; verse: number } | null>(null);

  // Modals
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(!progress.hasCompletedOnboarding);
  const [onboardingInitialStep, setOnboardingInitialStep] = useState<number>(0);
  const [celebrationChapter, setCelebrationChapter] = useState<number | null>(null);
  const [isInstallAppOpen, setIsInstallAppOpen] = useState(false);
  const [supportModalState, setSupportModalState] = useState<{
    isOpen: boolean;
    reason: 'chapters' | 'streak';
    chaptersCount?: number;
    streakDays?: number;
  }>({
    isOpen: false,
    reason: 'chapters',
    chaptersCount: 2,
    streakDays: 3,
  });

  // Synchronize dark theme class on body
  useEffect(() => {
    if (progress.settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [progress.settings.theme]);

  // Android Hardware / Gesture Navigation Back Button Handler
  useEffect(() => {
    let listenerHandle: any = null;

    const registerBack = async () => {
      try {
        listenerHandle = await CapApp.addListener('backButton', () => {
          // 1. Close any open modal first
          if (isOnboardingOpen) {
            setIsOnboardingOpen(false);
          } else if (isInstallAppOpen) {
            setIsInstallAppOpen(false);
          } else if (supportModalState.isOpen) {
            setSupportModalState((prev) => ({ ...prev, isOpen: false }));
          } else if (isSettingsOpen) {
            setIsSettingsOpen(false);
          } else if (isSearchOpen) {
            setIsSearchOpen(false);
          } else if (isCertificateOpen) {
            setIsCertificateOpen(false);
          } else if (celebrationChapter !== null) {
            setCelebrationChapter(null);
          }
          // 2. If Reader is open, exit reader and return to Home!
          else if (readingLocation !== null) {
            setReadingLocation(null);
            setActiveTab('home');
          }
          // 3. If in another tab (chapters, bookmarks, journey), return to Home tab!
          else if (activeTab !== 'home') {
            setActiveTab('home');
          }
          // 4. If already on Home tab with nothing open, exit app cleanly
          else {
            CapApp.exitApp();
          }
        });
      } catch (err) {
        // Fallback for non-native web preview
      }
    };

    registerBack();

    return () => {
      if (listenerHandle) {
        listenerHandle.remove();
      }
    };
  }, [
    isOnboardingOpen,
    isInstallAppOpen,
    supportModalState.isOpen,
    isSettingsOpen,
    isSearchOpen,
    isCertificateOpen,
    celebrationChapter,
    readingLocation,
    activeTab,
  ]);

  const handleUpdateProgress = (updated: UserProgress | ((prev: UserProgress) => UserProgress)) => {
    setProgress((prev) => {
      const next = typeof updated === 'function' ? updated(prev) : updated;
      saveUserProgress(next);
      return next;
    });
  };

  const handleOpenReader = (chapter: number, verse: number) => {
    setReadingLocation({ chapter, verse });
  };

  const handleCloseReader = () => {
    setReadingLocation(null);
    setActiveTab('home');
  };

  const handleChapterCompleted = (chapterNumber: number) => {
    // If not already celebrated, trigger celebration modal!
    if (!progress.celebratedChapters.includes(chapterNumber)) {
      setCelebrationChapter(chapterNumber);
    }
  };

  const handleSaveCelebrationReflection = (reflection: string) => {
    if (celebrationChapter) {
      let updated = saveChapterReflection(progress, celebrationChapter, reflection);
      updated = markChapterCelebrated(updated, celebrationChapter);
      handleUpdateProgress(updated);
    }
  };

  const handleCelebrationContinueNext = () => {
    if (celebrationChapter) {
      const updated = markChapterCelebrated(progress, celebrationChapter);
      handleUpdateProgress(updated);
      const nextCh = celebrationChapter + 1;
      setCelebrationChapter(null);

      // Check if user has now completed an every-2-chapters milestone (2, 4, 6...)
      const completedLen = updated.completedChapters.length;
      if (completedLen >= 2 && completedLen % 2 === 0 && completedLen > (updated.lastChaptersSupportMilestone || 0)) {
        setSupportModalState({
          isOpen: true,
          reason: 'chapters',
          chaptersCount: completedLen,
        });
      } else if (nextCh <= 18) {
        setReadingLocation({ chapter: nextCh, verse: 1 });
      } else {
        setIsCertificateOpen(true);
      }
    }
  };

  const handleCelebrationReturnHome = () => {
    if (celebrationChapter) {
      const updated = markChapterCelebrated(progress, celebrationChapter);
      handleUpdateProgress(updated);
      setCelebrationChapter(null);
      setReadingLocation(null);
      setActiveTab('home');

      // Check if user has now completed an every-2-chapters milestone (2, 4, 6...)
      const completedLen = updated.completedChapters.length;
      if (completedLen >= 2 && completedLen % 2 === 0 && completedLen > (updated.lastChaptersSupportMilestone || 0)) {
        setSupportModalState({
          isOpen: true,
          reason: 'chapters',
          chaptersCount: completedLen,
        });
      }
    }
  };

  // Passive check: Prompt on calm Home screen if user completed every 2 chapters or reached 3+ days streak
  useEffect(() => {
    if (isOnboardingOpen || celebrationChapter || readingLocation || supportModalState.isOpen) {
      return;
    }

    const streakVal = progress.streak?.current || 0;
    const completedLen = progress.completedChapters.length;

    // 1. Check every 2 chapters milestone (2, 4, 6...)
    if (
      completedLen >= 2 &&
      completedLen % 2 === 0 &&
      completedLen > (progress.lastChaptersSupportMilestone || 0)
    ) {
      const timer = setTimeout(() => {
        setSupportModalState({
          isOpen: true,
          reason: 'chapters',
          chaptersCount: completedLen,
        });
      }, 700);
      return () => clearTimeout(timer);
    }

    // 2. Check 3+ days streak milestone with 3-day gap intervals (Day 3, Day 6, Day 9... never on consecutive days)
    const lastPromptStreak = progress.lastStreakPromptStreak || 0;
    const isStreakEligible =
      streakVal >= 3 &&
      (lastPromptStreak === 0 || streakVal >= lastPromptStreak + 3);

    if (isStreakEligible) {
      const timer = setTimeout(() => {
        setSupportModalState({
          isOpen: true,
          reason: 'streak',
          streakDays: streakVal,
        });
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [
    progress.completedChapters.length,
    progress.lastChaptersSupportMilestone,
    progress.streak?.current,
    progress.lastStreakPromptStreak,
    isOnboardingOpen,
    celebrationChapter,
    readingLocation,
    supportModalState.isOpen,
  ]);

  const handleConfirmSupport = () => {
    let updated = progress;
    if (supportModalState.reason === 'streak') {
      updated = markStreakPromptShown(progress, supportModalState.streakDays);
    } else {
      updated = markTwoChapterPromptShown(progress, supportModalState.chaptersCount);
    }
    handleUpdateProgress(updated);
    setSupportModalState((prev) => ({ ...prev, isOpen: false }));
    openDonationPage();
  };

  const handleDeclineSupport = () => {
    let updated = progress;
    if (supportModalState.reason === 'streak') {
      updated = markStreakPromptShown(progress, supportModalState.streakDays);
    } else {
      updated = markTwoChapterPromptShown(progress, supportModalState.chaptersCount);
    }
    handleUpdateProgress(updated);
    setSupportModalState((prev) => ({ ...prev, isOpen: false }));
  };

  const celebratingChapterObj = celebrationChapter
    ? scriptureData.chapters.find((c) => c.chapter_number === celebrationChapter)
    : null;

  return (
    <div className="min-h-screen bg-warmIvory dark:bg-darkBg text-deepBrown dark:text-darkText flex flex-col justify-between transition-colors">
      {/* Top Header */}
      {!readingLocation && (
        <Header
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenInstall={() => setIsInstallAppOpen(true)}
        />
      )}

      {/* Main Tab Content */}
      {!readingLocation && (
        <main className="flex-1 w-full max-w-md mx-auto">
          {activeTab === 'home' && (
            <HomeScreen
              progress={progress}
              onOpenReader={handleOpenReader}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onOpenCertificate={() => setIsCertificateOpen(true)}
              onOpenTutorial={() => {
                setOnboardingInitialStep(3);
                setIsOnboardingOpen(true);
              }}
              onOpenInstall={() => setIsInstallAppOpen(true)}
            />
          )}

          {activeTab === 'chapters' && (
            <ChaptersScreen
              progress={progress}
              onOpenReader={handleOpenReader}
            />
          )}

          {activeTab === 'bookmarks' && (
            <BookmarksScreen
              progress={progress}
              onUpdateProgress={handleUpdateProgress}
              onOpenReader={handleOpenReader}
            />
          )}

          {activeTab === 'journey' && (
            <JourneyScreen
              progress={progress}
              onOpenReader={handleOpenReader}
              onOpenCertificate={() => setIsCertificateOpen(true)}
            />
          )}
        </main>
      )}

      {/* Bottom Navigation */}
      {!readingLocation && (
        <Navigation
          activeTab={activeTab}
          onSelectTab={(tab) => setActiveTab(tab)}
        />
      )}

      {/* Fullscreen Reader Screen */}
      {readingLocation && (
        <ReaderScreen
          initialChapter={readingLocation.chapter}
          initialVerse={readingLocation.verse}
          progress={progress}
          onUpdateProgress={handleUpdateProgress}
          onClose={handleCloseReader}
          onChapterCompleted={handleChapterCompleted}
        />
      )}

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectVerse={(ch, v) => handleOpenReader(ch, v)}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        progress={progress}
        onUpdateProgress={handleUpdateProgress}
        onOpenTutorial={() => {
          setIsSettingsOpen(false);
          setOnboardingInitialStep(3);
          setIsOnboardingOpen(true);
        }}
        onOpenInstall={() => setIsInstallAppOpen(true)}
      />

      {/* Chapter Completion Celebration Modal */}
      {celebratingChapterObj && (
        <ChapterCelebrationModal
          isOpen={true}
          chapter={celebratingChapterObj}
          completedChaptersCount={progress.completedChapters.length}
          onSaveReflection={handleSaveCelebrationReflection}
          onContinueNextChapter={handleCelebrationContinueNext}
          onReturnHome={handleCelebrationReturnHome}
        />
      )}

      {/* Certificate Modal */}
      <CertificateModal
        isOpen={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
        progress={progress}
        onOpenReader={handleOpenReader}
        onUpdateUserName={(name) => {
          handleUpdateProgress({ ...progress, userName: name });
        }}
      />

      {/* First-time Onboarding & Interactive Visual Tutorial Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        initialStep={onboardingInitialStep}
        onComplete={(updated) => {
          handleUpdateProgress(updated);
          setIsOnboardingOpen(false);
        }}
        onClose={() => setIsOnboardingOpen(false)}
        progress={progress}
      />

      {/* PWA Install & Direct APK Download Modal */}
      <InstallAppModal
        isOpen={isInstallAppOpen}
        onClose={() => setIsInstallAppOpen(false)}
      />

      {/* Milestone Seva Support Modal (After every 2 chapters or 3-day streak) */}
      <TwoChapterSupportModal
        isOpen={supportModalState.isOpen}
        reason={supportModalState.reason}
        chaptersCount={supportModalState.chaptersCount}
        streakDays={supportModalState.streakDays}
        onConfirmSupport={handleConfirmSupport}
        onDecline={handleDeclineSupport}
      />

    </div>
  );
};

export default App;
