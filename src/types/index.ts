export interface Verse {
  id: string; // e.g. "1:1"
  chapter: number;
  verse: number;
  sanskrit: string;
  transliteration?: string;
  hindi: string;
  english: string;
  wordMeaning?: string;
}

export interface Chapter {
  chapter_number: number;
  name: string; // Sanskrit name e.g. "अर्जुनविषादयोग"
  translation: string; // e.g. "Arjuna Visada Yoga"
  meaning: {
    en: string;
    hi: string;
  };
  summary: {
    en: string;
    hi: string;
  };
  verses_count: number;
  verses: Verse[];
}

export interface ScriptureDataset {
  title: string;
  version: string;
  languages: string[];
  total_chapters: number;
  total_verses: number;
  attribution: {
    sanskrit: string;
    hindi: string;
    english: string;
    license: string;
  };
  chapters: Chapter[];
}

export interface Bookmark {
  id: string;
  chapter: number;
  verse: number;
  snippet: string;
  timestamp: number;
}

export interface VerseNote {
  id: string;
  verseId: string;
  chapter: number;
  verse: number;
  note: string;
  updatedAt: number;
}

export type LanguagePreference =
  | 'all'
  | 'sanskrit_english'
  | 'sanskrit_hindi'
  | 'hindi_only'
  | 'english_only'
  | 'sanskrit_only'
  | 'custom';

export interface VisibleLanguages {
  sanskrit: boolean;
  transliteration: boolean;
  hindi: boolean;
  english: boolean;
  wordMeaning: boolean;
}

export interface UserProfile {
  name: string;
  email?: string;
  authProvider?: 'google' | 'email' | 'guest';
  avatarUrl?: string;
}

export interface UserStreak {
  current: number;
  longest: number;
  lastActiveDate: string | null;
}

export interface UserProgress {
  lastRead: {
    chapter: number;
    verse: number;
  };
  readVerses: Record<string, boolean>; // e.g. "1:1": true
  completedChapters: number[]; // e.g. [1, 2]
  celebratedChapters: number[]; // already showed celebration modal
  chapterReflections: Record<number, string>; // chapterNumber -> reflection
  bookmarks: Bookmark[];
  notes: Record<string, VerseNote>; // verseId -> VerseNote
  dailyGoal: {
    enabled: boolean;
    target: number; // e.g. 5
    purpose?: string;
  };
  dailyHistory: Record<string, string[]>; // "YYYY-MM-DD" -> array of unique verseIds read that day
  userName: string;
  userProfile?: UserProfile;
  certificateUnlockedAt: string | null;
  hasCompletedOnboarding?: boolean;
  hasShownTwoChapterSupportPrompt?: boolean;
  hasShownStreakSupportPrompt?: boolean;
  lastStreakPromptStreak?: number;
  lastStreakPromptDate?: string;
  lastChaptersSupportMilestone?: number;
  streak?: UserStreak;
  settings: {
    fontSize: 'normal' | 'large' | 'huge';
    theme: 'temple' | 'dark';
    distractionFree: boolean;
    showTransliteration: boolean;
    showWordMeaning: boolean;
    autoMarkRead: boolean;
    languagePreference?: LanguagePreference;
    visibleLanguages?: VisibleLanguages;
  };
}

export type ActiveTab = 'home' | 'chapters' | 'bookmarks' | 'journey';

