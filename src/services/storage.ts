import type {
  UserProgress,
  Bookmark,
  LanguagePreference,
  VisibleLanguages,
  UserStreak,
  ScriptureDataset,
} from '../types';

import gitaDataRaw from '../data/gita_data.json';

export const scriptureData = gitaDataRaw as ScriptureDataset;

const STORAGE_KEY = 'gitaquest_user_progress_v2';
const LEGACY_STORAGE_KEY = 'gita_sadhana_user_progress_v1';

export function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getTodayKey(): string {
  return formatDateKey(new Date());
}

export function getLanguagesForPreference(pref: LanguagePreference): VisibleLanguages {
  switch (pref) {
    case 'sanskrit_english':
      return { sanskrit: true, transliteration: true, hindi: false, english: true, wordMeaning: false };
    case 'sanskrit_hindi':
      return { sanskrit: true, transliteration: false, hindi: true, english: false, wordMeaning: false };
    case 'hindi_only':
      return { sanskrit: false, transliteration: false, hindi: true, english: false, wordMeaning: false };
    case 'english_only':
      return { sanskrit: false, transliteration: false, hindi: false, english: true, wordMeaning: false };
    case 'sanskrit_only':
      return { sanskrit: true, transliteration: true, hindi: false, english: false, wordMeaning: false };
    case 'all':
    default:
      return { sanskrit: true, transliteration: true, hindi: true, english: true, wordMeaning: false };
  }
}

export function calculateStreak(dailyHistory: Record<string, string[]> = {}, target = 5) {
  const today = new Date();
  const todayKey = formatDateKey(today);
  const todayVerses = dailyHistory[todayKey] || [];
  const todayCount = todayVerses.length;
  const isActiveToday = todayCount > 0;

  // Calculate current streak
  let currentStreak = 0;
  if (isActiveToday) {
    currentStreak = 1;
    let dayOffset = 1;
    while (dayOffset < 365) {
      const prevDate = new Date();
      prevDate.setDate(today.getDate() - dayOffset);
      const prevKey = formatDateKey(prevDate);
      if ((dailyHistory[prevKey] || []).length > 0) {
        currentStreak++;
        dayOffset++;
      } else {
        break;
      }
    }
  } else {
    // Check if yesterday was active
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const yesterdayKey = formatDateKey(yesterday);
    if ((dailyHistory[yesterdayKey] || []).length > 0) {
      currentStreak = 1;
      let dayOffset = 2;
      while (dayOffset < 365) {
        const prevDate = new Date();
        prevDate.setDate(today.getDate() - dayOffset);
        const prevKey = formatDateKey(prevDate);
        if ((dailyHistory[prevKey] || []).length > 0) {
          currentStreak++;
          dayOffset++;
        } else {
          break;
        }
      }
    }
  }

  // Calculate longest streak across entire history
  const activeDates = Object.keys(dailyHistory)
    .filter((k) => (dailyHistory[k] || []).length > 0)
    .sort();

  let longestStreak = currentStreak;
  let runningStreak = 0;
  let prevDateObj: Date | null = null;

  for (const dateStr of activeDates) {
    const parts = dateStr.split('-').map(Number);
    const currDateObj = new Date(parts[0], parts[1] - 1, parts[2]);

    if (!prevDateObj) {
      runningStreak = 1;
    } else {
      const diffMs = currDateObj.getTime() - prevDateObj.getTime();
      const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        runningStreak++;
      } else if (diffDays > 1) {
        runningStreak = 1;
      }
    }
    prevDateObj = currDateObj;
    if (runningStreak > longestStreak) {
      longestStreak = runningStreak;
    }
  }

  // Past 7 days activity
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weekActivity: {
    date: string;
    dayLabel: string;
    count: number;
    completed: boolean;
    isToday: boolean;
  }[] = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const k = formatDateKey(d);
    const count = (dailyHistory[k] || []).length;
    weekActivity.push({
      date: k,
      dayLabel: dayNames[d.getDay()],
      count,
      completed: count >= (target || 1),
      isToday: k === todayKey,
    });
  }

  return {
    currentStreak,
    longestStreak,
    isActiveToday,
    todayCount,
    weekActivity,
  };
}

export const DEFAULT_USER_PROGRESS: UserProgress = {
  lastRead: {
    chapter: 1,
    verse: 1,
  },
  readVerses: {},
  completedChapters: [],
  celebratedChapters: [],
  chapterReflections: {},
  bookmarks: [],
  notes: {},
  dailyGoal: {
    enabled: true,
    target: 5,
    purpose: 'Spiritual Peace & Clarity',
  },
  dailyHistory: {},
  userName: '',
  userProfile: {
    name: '',
    email: '',
    authProvider: 'guest',
  },
  certificateUnlockedAt: null,
  hasCompletedOnboarding: false,
  hasShownTwoChapterSupportPrompt: false,
  hasShownStreakSupportPrompt: false,
  lastStreakPromptStreak: 0,
  lastStreakPromptDate: undefined,
  lastChaptersSupportMilestone: 0,
  streak: {
    current: 0,
    longest: 0,
    lastActiveDate: null,
  },
  settings: {
    fontSize: 'normal',
    theme: 'temple',
    distractionFree: false,
    showTransliteration: true,
    showWordMeaning: false,
    autoMarkRead: true,
    languagePreference: 'all',
    visibleLanguages: {
      sanskrit: true,
      transliteration: true,
      hindi: true,
      english: true,
      wordMeaning: false,
    },
  },
};

export function createDefaultProgress(): UserProgress {
  return {
    ...DEFAULT_USER_PROGRESS,
    completedChapters: [],
    celebratedChapters: [],
    bookmarks: [],
    notes: {},
    readVerses: {},
    dailyHistory: {},
    streak: {
      current: 0,
      longest: 0,
      lastActiveDate: null,
    },
    dailyGoal: {
      ...DEFAULT_USER_PROGRESS.dailyGoal,
    },
    settings: {
      ...DEFAULT_USER_PROGRESS.settings,
      visibleLanguages: {
        ...DEFAULT_USER_PROGRESS.settings.visibleLanguages!,
      },
    },
  };
}

export function loadUserProgress(): UserProgress {
  const fallback = createDefaultProgress();
  try {
    let raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      raw = localStorage.getItem(LEGACY_STORAGE_KEY);
    }
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    const mergedSettings = {
      ...fallback.settings,
      ...(parsed.settings || {}),
      visibleLanguages: {
        ...fallback.settings.visibleLanguages,
        ...((parsed.settings && parsed.settings.visibleLanguages) || {}),
      },
    };

    const mergedDailyHistory = parsed.dailyHistory || {};
    const streakInfo = calculateStreak(mergedDailyHistory, parsed.dailyGoal?.target || 5);
    const readVerses = parsed.readVerses ? { ...parsed.readVerses } : {};
    const hasAnyRead = Object.keys(readVerses).length > 0;

    const initialLastRead = hasAnyRead && parsed.lastRead?.chapter
      ? { chapter: parsed.lastRead.chapter, verse: parsed.lastRead.verse || 1 }
      : { chapter: 1, verse: 1 };

    return {
      ...fallback,
      ...parsed,
      lastRead: initialLastRead,
      completedChapters: parsed.completedChapters ? [...parsed.completedChapters] : [],
      celebratedChapters: parsed.celebratedChapters ? [...parsed.celebratedChapters] : [],
      bookmarks: parsed.bookmarks ? [...parsed.bookmarks] : [],
      notes: parsed.notes ? { ...parsed.notes } : {},
      readVerses,
      dailyHistory: mergedDailyHistory,
      streak: {
        current: streakInfo.currentStreak,
        longest: streakInfo.longestStreak,
        lastActiveDate: streakInfo.isActiveToday ? getTodayKey() : parsed.streak?.lastActiveDate || null,
      },
      settings: mergedSettings,
      dailyGoal: {
        ...fallback.dailyGoal,
        ...(parsed.dailyGoal || {}),
      },
    };
  } catch (e) {
    console.error('Failed to load user progress from storage:', e);
    return fallback;
  }
}



export function saveUserProgress(progress: UserProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error('Failed to save user progress:', e);
  }
}

/**
 * Checks if a chapter has all verses read
 */
export function isChapterFullyRead(progress: UserProgress, chapterNumber: number): boolean {
  const chapter = scriptureData.chapters.find((c) => c.chapter_number === chapterNumber);
  if (!chapter) return false;
  for (let v = 1; v <= chapter.verses_count; v++) {
    if (!progress.readVerses[`${chapterNumber}:${v}`]) {
      return false;
    }
  }
  return true;
}

/**
 * Marks a verse as read or toggles it, updates daily reading history and chapter completion
 */
export function toggleVerseRead(
  progress: UserProgress,
  chapterNumber: number,
  verseNumber: number
): { updatedProgress: UserProgress; newlyCompletedChapter?: number } {
  const verseId = `${chapterNumber}:${verseNumber}`;
  const isAlreadyRead = !!progress.readVerses[verseId];
  const newReadVerses = { ...progress.readVerses };

  const todayKey = getTodayKey();
  const currentTodayVerses = progress.dailyHistory[todayKey] || [];
  let newTodayVerses = [...currentTodayVerses];

  if (isAlreadyRead) {
    delete newReadVerses[verseId];
    newTodayVerses = newTodayVerses.filter((id) => id !== verseId);
  } else {
    newReadVerses[verseId] = true;
    if (!newTodayVerses.includes(verseId)) {
      newTodayVerses.push(verseId);
    }
  }

  const updatedDailyHistory = {
    ...progress.dailyHistory,
    [todayKey]: newTodayVerses,
  };

  // Check chapter completion status
  const tempProgress: UserProgress = {
    ...progress,
    readVerses: newReadVerses,
  };

  const isComplete = isChapterFullyRead(tempProgress, chapterNumber);
  const completedChapters = [...progress.completedChapters];
  let newlyCompletedChapter: number | undefined = undefined;

  if (isComplete && !completedChapters.includes(chapterNumber)) {
    completedChapters.push(chapterNumber);
    completedChapters.sort((a, b) => a - b);
    newlyCompletedChapter = chapterNumber;
  } else if (!isComplete && completedChapters.includes(chapterNumber)) {
    const idx = completedChapters.indexOf(chapterNumber);
    if (idx > -1) completedChapters.splice(idx, 1);
  }

  // Check 18 chapters completion for certificate
  let certUnlockedAt = progress.certificateUnlockedAt;
  if (completedChapters.length === 18 && !certUnlockedAt) {
    certUnlockedAt = new Date().toISOString();
  }

  const streakInfo = calculateStreak(updatedDailyHistory, progress.dailyGoal?.target || 5);
  const updatedStreak: UserStreak = {
    current: streakInfo.currentStreak,
    longest: streakInfo.longestStreak,
    lastActiveDate: todayKey,
  };

  const updatedProgress: UserProgress = {
    ...progress,
    readVerses: newReadVerses,
    completedChapters,
    dailyHistory: updatedDailyHistory,
    streak: updatedStreak,
    certificateUnlockedAt: certUnlockedAt,
    lastRead: { chapter: chapterNumber, verse: verseNumber },
  };

  saveUserProgress(updatedProgress);
  return { updatedProgress, newlyCompletedChapter };
}

/**
 * Marks verse read automatically upon view if autoMarkRead setting is enabled
 */
export function ensureVerseRead(
  progress: UserProgress,
  chapterNumber: number,
  verseNumber: number
): { updatedProgress: UserProgress; newlyCompletedChapter?: number } {
  const verseId = `${chapterNumber}:${verseNumber}`;
  if (progress.readVerses[verseId]) {
    // Already read, just update lastRead
    if (progress.lastRead.chapter !== chapterNumber || progress.lastRead.verse !== verseNumber) {
      const p = {
        ...progress,
        lastRead: { chapter: chapterNumber, verse: verseNumber },
      };
      saveUserProgress(p);
      return { updatedProgress: p };
    }
    return { updatedProgress: progress };
  }
  return toggleVerseRead(progress, chapterNumber, verseNumber);
}

export function toggleBookmark(
  progress: UserProgress,
  chapterNumber: number,
  verseNumber: number,
  snippet: string
): UserProgress {
  const id = `${chapterNumber}:${verseNumber}`;
  const exists = progress.bookmarks.find((b) => b.id === id);
  let updatedBookmarks: Bookmark[];

  if (exists) {
    updatedBookmarks = progress.bookmarks.filter((b) => b.id !== id);
  } else {
    updatedBookmarks = [
      {
        id,
        chapter: chapterNumber,
        verse: verseNumber,
        snippet,
        timestamp: Date.now(),
      },
      ...progress.bookmarks,
    ];
  }

  const updated = { ...progress, bookmarks: updatedBookmarks };
  saveUserProgress(updated);
  return updated;
}

export function saveVerseNote(
  progress: UserProgress,
  chapterNumber: number,
  verseNumber: number,
  noteText: string
): UserProgress {
  const verseId = `${chapterNumber}:${verseNumber}`;
  const notes = { ...progress.notes };

  if (!noteText.trim()) {
    delete notes[verseId];
  } else {
    notes[verseId] = {
      id: verseId,
      verseId,
      chapter: chapterNumber,
      verse: verseNumber,
      note: noteText.trim(),
      updatedAt: Date.now(),
    };
  }

  const updated = { ...progress, notes };
  saveUserProgress(updated);
  return updated;
}

export function saveChapterReflection(
  progress: UserProgress,
  chapterNumber: number,
  reflection: string
): UserProgress {
  const chapterReflections = {
    ...progress.chapterReflections,
    [chapterNumber]: reflection.trim(),
  };
  const updated = { ...progress, chapterReflections };
  saveUserProgress(updated);
  return updated;
}

export function markChapterCelebrated(
  progress: UserProgress,
  chapterNumber: number
): UserProgress {
  if (progress.celebratedChapters.includes(chapterNumber)) return progress;
  const celebratedChapters = [...progress.celebratedChapters, chapterNumber];
  const updated = { ...progress, celebratedChapters };
  saveUserProgress(updated);
  return updated;
}

export function getChapterProgress(progress: UserProgress, chapterNumber: number) {
  const chapter = scriptureData.chapters.find((c) => c.chapter_number === chapterNumber);
  if (!chapter) return { completedCount: 0, totalCount: 0, percentage: 0, isComplete: false };

  let completedCount = 0;
  for (let v = 1; v <= chapter.verses_count; v++) {
    if (progress.readVerses[`${chapterNumber}:${v}`]) {
      completedCount++;
    }
  }

  const percentage = Math.round((completedCount / chapter.verses_count) * 100);
  const isComplete = completedCount === chapter.verses_count;

  return {
    completedCount,
    totalCount: chapter.verses_count,
    percentage,
    isComplete,
  };
}

export function getOverallProgress(progress: UserProgress) {
  const totalVerses = scriptureData.total_verses;
  const completedVersesCount = Object.keys(progress.readVerses).length;
  const totalChapters = scriptureData.total_chapters;
  const completedChaptersCount = progress.completedChapters.length;
  const percentage = Math.round((completedVersesCount / totalVerses) * 100);

  return {
    completedVersesCount,
    totalVerses,
    completedChaptersCount,
    totalChapters,
    percentage,
  };
}

export function getTodayProgress(progress: UserProgress) {
  const todayKey = getTodayKey();
  const readList = progress.dailyHistory[todayKey] || [];
  const count = readList.length;
  const target = progress.dailyGoal.target || 5;
  const percentage = Math.min(100, Math.round((count / target) * 100));

  return {
    count,
    target,
    enabled: progress.dailyGoal.enabled,
    percentage,
    completed: count >= target,
  };
}

export function markTwoChapterPromptShown(progress: UserProgress, milestoneCount?: number): UserProgress {
  const count = milestoneCount !== undefined ? milestoneCount : progress.completedChapters.length;
  const updated: UserProgress = {
    ...progress,
    hasShownTwoChapterSupportPrompt: true,
    lastChaptersSupportMilestone: count,
  };
  saveUserProgress(updated);
  return updated;
}

export function markStreakPromptShown(progress: UserProgress, currentStreakDays?: number): UserProgress {
  const streakVal = currentStreakDays !== undefined ? currentStreakDays : (progress.streak?.current || 3);
  const updated: UserProgress = {
    ...progress,
    hasShownStreakSupportPrompt: true,
    lastStreakPromptStreak: streakVal,
    lastStreakPromptDate: getTodayKey(),
  };
  saveUserProgress(updated);
  return updated;
}

export function exportUserData(progress: UserProgress): string {
  return JSON.stringify(progress, null, 2);
}

export function importUserData(jsonString: string): UserProgress {
  const parsed = JSON.parse(jsonString);
  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Invalid backup file format');
  }
  const merged: UserProgress = {
    ...DEFAULT_USER_PROGRESS,
    ...parsed,
  };
  saveUserProgress(merged);
  return merged;
}
