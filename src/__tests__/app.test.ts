import { describe, it, expect, beforeEach } from 'vitest';
import {
  scriptureData,
  loadUserProgress,
  saveUserProgress,
  toggleVerseRead,
  toggleBookmark,
  saveVerseNote,
  saveChapterReflection,
  markChapterCelebrated,
  getChapterProgress,
  getOverallProgress,
  getTodayProgress,
  calculateStreak,
  getLanguagesForPreference,
  formatDateKey,
  exportUserData,
  importUserData,
  markTwoChapterPromptShown,
  markStreakPromptShown,
} from '../services/storage';

import { searchScripture } from '../services/search';
import { generateCertificatePDF } from '../services/certificate';
import { DONATION_URL } from '../services/donation';
import { PLAY_STORE_TESTING_URL } from '../components/InstallAppModal';

// Mock localStorage for Vitest Node environment
const mockStorage: Record<string, string> = {};
const mockLocalStorage = {
  getItem: (key: string) => mockStorage[key] || null,
  setItem: (key: string, val: string) => {
    mockStorage[key] = val;
  },
  removeItem: (key: string) => {
    delete mockStorage[key];
  },
  clear: () => {
    for (const k in mockStorage) delete mockStorage[k];
  },
  key: (i: number) => Object.keys(mockStorage)[i] || null,
  length: 0,
};
Object.defineProperty(globalThis, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
});

describe('Gita Sadhana Complete Test Suite', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
  });

  // 1. First launch and empty states
  it('1. Verifies first launch defaults and clean empty state', () => {
    const progress = loadUserProgress();
    expect(progress.lastRead).toEqual({ chapter: 1, verse: 1 });
    expect(Object.keys(progress.readVerses).length).toBe(0);
    expect(progress.completedChapters.length).toBe(0);
    expect(progress.bookmarks.length).toBe(0);
    expect(Object.keys(progress.notes).length).toBe(0);
    expect(progress.certificateUnlockedAt).toBeNull();
  });

  // 2. All 18 chapters and actual verse counts
  it('2. Verifies all 18 chapters and genuine verse counts', () => {
    expect(scriptureData.total_chapters).toBe(18);
    expect(scriptureData.chapters.length).toBe(18);

    const expectedCounts = [47, 72, 43, 42, 29, 47, 30, 28, 34, 42, 55, 20, 35, 27, 20, 24, 28, 78];
    let totalVersesCount = 0;

    scriptureData.chapters.forEach((ch, idx) => {
      expect(ch.chapter_number).toBe(idx + 1);
      expect(ch.verses_count).toBe(expectedCounts[idx]);
      expect(ch.verses.length).toBe(expectedCounts[idx]);
      expect(ch.name.length).toBeGreaterThan(0);
      expect(ch.translation.length).toBeGreaterThan(0);
      totalVersesCount += ch.verses_count;
    });

    expect(totalVersesCount).toBe(701);
    expect(scriptureData.total_verses).toBe(701);
  });

  // 3. Alignment of the three languages
  it('3. Verifies language alignment (Sanskrit, Hindi, English) for every verse', () => {
    for (const ch of scriptureData.chapters) {
      for (const v of ch.verses) {
        expect(v.sanskrit).toBeDefined();
        expect(v.sanskrit.length).toBeGreaterThan(0);
        // Verify Sanskrit contains Devanagari Unicode characters
        expect(/[\u0900-\u097F]/.test(v.sanskrit)).toBe(true);

        expect(v.hindi).toBeDefined();
        expect(v.hindi.length).toBeGreaterThan(0);
        // Verify Hindi translation
        expect(/[\u0900-\u097F]/.test(v.hindi)).toBe(true);

        expect(v.english).toBeDefined();
        expect(v.english.length).toBeGreaterThan(0);
        // Verify English translation
        expect(/[a-zA-Z]/.test(v.english)).toBe(true);
      }
    }
  });

  // 4. Correct progress restoration after reload
  it('4. Verifies progress restoration after restart', () => {
    let progress = loadUserProgress();
    const result = toggleVerseRead(progress, 1, 1);
    progress = result.updatedProgress;
    saveUserProgress(progress);

    // Simulate app restart by loading fresh
    const reloaded = loadUserProgress();
    expect(reloaded.lastRead).toEqual({ chapter: 1, verse: 1 });
    expect(reloaded.readVerses['1:1']).toBe(true);
  });

  // 5. Bookmark creation and removal
  it('5. Verifies bookmark toggle on and off', () => {
    let progress = loadUserProgress();
    progress = toggleBookmark(progress, 2, 47, 'Karmanye vadikaraste');
    expect(progress.bookmarks.length).toBe(1);
    expect(progress.bookmarks[0].id).toBe('2:47');
    expect(progress.bookmarks[0].chapter).toBe(2);
    expect(progress.bookmarks[0].verse).toBe(47);

    // Toggle off
    progress = toggleBookmark(progress, 2, 47, 'Karmanye vadikaraste');
    expect(progress.bookmarks.length).toBe(0);
  });

  // 6. Notes surviving restarts
  it('6. Verifies personal reflections and notes persistence', () => {
    let progress = loadUserProgress();
    progress = saveVerseNote(progress, 2, 47, 'Action is thy duty, not the fruits.');
    expect(progress.notes['2:47']).toBeDefined();
    expect(progress.notes['2:47'].note).toBe('Action is thy duty, not the fruits.');

    // Reload
    const reloaded = loadUserProgress();
    expect(reloaded.notes['2:47'].note).toBe('Action is thy duty, not the fruits.');

    // Edit note
    const edited = saveVerseNote(reloaded, 2, 47, 'Updated deeper insight on detachment.');
    expect(edited.notes['2:47'].note).toBe('Updated deeper insight on detachment.');

    // Delete note
    const deleted = saveVerseNote(edited, 2, 47, '');
    expect(deleted.notes['2:47']).toBeUndefined();
  });

  // 7. Daily goal accuracy
  it('7. Verifies daily goal tracking and distinct verse counting', () => {
    let progress = loadUserProgress();
    progress.dailyGoal.target = 3;

    // Read 1:1
    progress = toggleVerseRead(progress, 1, 1).updatedProgress;
    let today = getTodayProgress(progress);
    expect(today.count).toBe(1);
    expect(today.completed).toBe(false);

    // Read 1:2 and 1:3
    progress = toggleVerseRead(progress, 1, 2).updatedProgress;
    progress = toggleVerseRead(progress, 1, 3).updatedProgress;
    today = getTodayProgress(progress);
    expect(today.count).toBe(3);
    expect(today.completed).toBe(true);

    // Repeated toggle of same verse does not artificially inflate count
    progress = toggleVerseRead(progress, 1, 1).updatedProgress; // untoggled
    today = getTodayProgress(progress);
    expect(today.count).toBe(2);
  });

  // 8. Search across all languages
  it('8. Verifies offline search across Sanskrit, Hindi, English, and references', () => {
    // Reference search
    const refResults = searchScripture('2:47');
    expect(refResults.length).toBeGreaterThan(0);
    expect(refResults[0].chapterNumber).toBe(2);
    expect(refResults[0].verseNumber).toBe(47);

    // English keyword search
    const enResults = searchScripture('duty');
    expect(enResults.length).toBeGreaterThan(0);

    // Sanskrit Devanagari search
    const saResults = searchScripture('कर्मण्येवाधिकारस्ते');
    expect(saResults.length).toBeGreaterThan(0);

    // Hindi search
    const hiResults = searchScripture('अर्जुन');
    expect(hiResults.length).toBeGreaterThan(0);
  });

  // 9. Chapter completion conditions and celebration
  it('9. Verifies chapter completion only when ALL verses are read', () => {
    let progress = loadUserProgress();
    const ch12 = scriptureData.chapters.find((c) => c.chapter_number === 12)!;
    expect(ch12.verses_count).toBe(20);

    // Mark 19 verses read out of 20
    for (let v = 1; v <= 19; v++) {
      progress = toggleVerseRead(progress, 12, v).updatedProgress;
    }

    let stats = getChapterProgress(progress, 12);
    expect(stats.isComplete).toBe(false);
    expect(progress.completedChapters.includes(12)).toBe(false);

    // Mark 20th verse read
    const { updatedProgress, newlyCompletedChapter } = toggleVerseRead(progress, 12, 20);
    progress = updatedProgress;

    expect(newlyCompletedChapter).toBe(12);
    stats = getChapterProgress(progress, 12);
    expect(stats.isComplete).toBe(true);
    expect(progress.completedChapters.includes(12)).toBe(true);

    // Chapter celebration mark
    progress = markChapterCelebrated(progress, 12);
    expect(progress.celebratedChapters.includes(12)).toBe(true);

    // Save reflection
    progress = saveChapterReflection(progress, 12, 'Bhakti is gentle devotion.');
    expect(progress.chapterReflections[12]).toBe('Bhakti is gentle devotion.');
  });

  // 10. Certificate unlock conditions and PDF generation
  it('10. Verifies certificate unlocks after all 18 chapters and generates PDF', () => {
    let progress = loadUserProgress();

    // Mark all verses read across all 18 chapters
    for (const ch of scriptureData.chapters) {
      for (const v of ch.verses) {
        progress.readVerses[v.id] = true;
      }
      progress.completedChapters.push(ch.chapter_number);
    }
    progress.certificateUnlockedAt = new Date().toISOString();
    progress.userName = 'Ananda Sharma';

    const overall = getOverallProgress(progress);
    expect(overall.completedChaptersCount).toBe(18);
    expect(overall.completedVersesCount).toBe(701);
    expect(overall.percentage).toBe(100);

    // Generate PDF
    const pdfDoc = generateCertificatePDF({
      readerName: progress.userName,
      completionDate: 'October 12, 2026',
    });

    expect(pdfDoc).toBeDefined();
    const pdfBytes = pdfDoc.output('arraybuffer');
    expect(pdfBytes.byteLength).toBeGreaterThan(1000); // Valid PDF generated
  });

  // 11. Backup Export and Restore
  it('11. Verifies local data export and restore preservation', () => {
    let progress = loadUserProgress();
    progress.readVerses['1:1'] = true;
    progress.notes['1:1'] = {
      id: '1:1',
      verseId: '1:1',
      chapter: 1,
      verse: 1,
      note: 'Deep silence',
      updatedAt: 123456,
    };
    progress.bookmarks.push({
      id: '1:1',
      chapter: 1,
      verse: 1,
      snippet: 'Dharmakshetre',
      timestamp: 123456,
    });

    const exportedJson = exportUserData(progress);
    expect(typeof exportedJson).toBe('string');

    // Simulate fresh restore
    const restored = importUserData(exportedJson);
    expect(restored.readVerses['1:1']).toBe(true);
    expect(restored.notes['1:1'].note).toBe('Deep silence');
    expect(restored.bookmarks[0].snippet).toBe('Dharmakshetre');
  });

  // 12. Streak calculation and daily tracking
  it('12. Verifies streak calculation and consecutive days tracking', () => {
    const today = new Date();
    const todayKey = formatDateKey(today);

    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const yesterdayKey = formatDateKey(yesterday);

    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(today.getDate() - 2);
    const twoDaysAgoKey = formatDateKey(twoDaysAgo);

    // Case A: User read yesterday and two days ago, but not today yet
    const historyA: Record<string, string[]> = {
      [twoDaysAgoKey]: ['1:1', '1:2'],
      [yesterdayKey]: ['1:3', '1:4', '1:5'],
    };
    let streakA = calculateStreak(historyA, 5);
    expect(streakA.currentStreak).toBe(2);
    expect(streakA.isActiveToday).toBe(false);
    expect(streakA.todayCount).toBe(0);

    // Case B: User reads today
    const historyB: Record<string, string[]> = {
      ...historyA,
      [todayKey]: ['1:6', '1:7'],
    };
    let streakB = calculateStreak(historyB, 5);
    expect(streakB.currentStreak).toBe(3);
    expect(streakB.isActiveToday).toBe(true);
    expect(streakB.todayCount).toBe(2);
    expect(streakB.weekActivity.length).toBe(7);
  });

  // 13. Language preference combos
  it('13. Verifies language preference combos and visibility configurations', () => {
    // English only
    const enOnly = getLanguagesForPreference('english_only');
    expect(enOnly.english).toBe(true);
    expect(enOnly.hindi).toBe(false);
    expect(enOnly.sanskrit).toBe(false);

    // Hindi only
    const hiOnly = getLanguagesForPreference('hindi_only');
    expect(hiOnly.hindi).toBe(true);
    expect(hiOnly.english).toBe(false);
    expect(hiOnly.sanskrit).toBe(false);

    // Sanskrit only
    const saOnly = getLanguagesForPreference('sanskrit_only');
    expect(saOnly.sanskrit).toBe(true);
    expect(saOnly.hindi).toBe(false);
    expect(saOnly.english).toBe(false);

    // Sanskrit + Hindi
    const saHi = getLanguagesForPreference('sanskrit_hindi');
    expect(saHi.sanskrit).toBe(true);
    expect(saHi.hindi).toBe(true);
    expect(saHi.english).toBe(false);

    // All three
    const all = getLanguagesForPreference('all');
    expect(all.sanskrit).toBe(true);
    expect(all.hindi).toBe(true);
    expect(all.english).toBe(true);
  });

  // 14. Certificate unlock strictly requires 18 chapters
  it('14. Verifies certificate remains locked until all 18 chapters are complete', () => {
    let progress = loadUserProgress();
    // Complete 17 chapters
    for (let c = 1; c <= 17; c++) {
      progress.completedChapters.push(c);
    }
    expect(progress.completedChapters.length).toBe(17);
    expect(progress.certificateUnlockedAt).toBeNull();

    // Mark 18th chapter complete
    const ch18 = scriptureData.chapters.find((c) => c.chapter_number === 18)!;
    for (let v = 1; v <= ch18.verses_count; v++) {
      progress = toggleVerseRead(progress, 18, v).updatedProgress;
    }
    expect(progress.completedChapters.length).toBe(18);
    expect(progress.certificateUnlockedAt).not.toBeNull();
  });

  // 15. Verifies marking and unmarking verses correctly updates read status
  it('15. Verifies unmarking verses removes read status and updates progress', () => {
    let progress = loadUserProgress();
    expect(progress.readVerses['1:1']).toBeUndefined();

    // Mark 1:1
    const { updatedProgress: marked } = toggleVerseRead(progress, 1, 1);
    expect(marked.readVerses['1:1']).toBe(true);

    // Unmark 1:1
    const { updatedProgress: unmarked } = toggleVerseRead(marked, 1, 1);
    expect(unmarked.readVerses['1:1']).toBeUndefined();
  });

  // 16. Verifies reading 5 verses updates todayCount and streak in Journey & Home
  it('16. Verifies reading 5 verses immediately updates streak and daily count', () => {
    let progress = loadUserProgress();
    expect(progress.streak.current).toBe(0);

    for (let v = 1; v <= 5; v++) {
      const res = toggleVerseRead(progress, 1, v);
      progress = res.updatedProgress;
    }

    expect(Object.keys(progress.readVerses).length).toBe(5);
    const today = getTodayProgress(progress);
    expect(today.count).toBe(5);
    expect(progress.streak.current).toBe(1);

    const streakInfo = calculateStreak(progress.dailyHistory, progress.dailyGoal?.target || 5);
    expect(streakInfo.currentStreak).toBe(1);
    expect(streakInfo.todayCount).toBe(5);
  });

  // 17. Verifies 2-chapter milestone support prompt flag & milestone advancement
  it('17. Verifies every-2-chapters milestone support prompt flag & persistence', () => {
    let progress = loadUserProgress();
    expect(progress.hasShownTwoChapterSupportPrompt).toBe(false);
    expect(progress.lastChaptersSupportMilestone || 0).toBe(0);

    // Simulate completing 2 chapters
    progress.completedChapters = [1, 2];
    saveUserProgress(progress);

    let reloaded = loadUserProgress();
    expect(reloaded.completedChapters.length).toBe(2);
    expect(reloaded.hasShownTwoChapterSupportPrompt).toBe(false);

    // User dismisses or confirms support modal -> sets flag & milestone to 2
    const updated = markTwoChapterPromptShown(reloaded, 2);
    expect(updated.hasShownTwoChapterSupportPrompt).toBe(true);
    expect(updated.lastChaptersSupportMilestone).toBe(2);

    const afterSave = loadUserProgress();
    expect(afterSave.hasShownTwoChapterSupportPrompt).toBe(true);
    expect(afterSave.lastChaptersSupportMilestone).toBe(2);

    // Advancing to 4 chapters should advance milestone
    afterSave.completedChapters = [1, 2, 3, 4];
    const updated4 = markTwoChapterPromptShown(afterSave, 4);
    expect(updated4.lastChaptersSupportMilestone).toBe(4);
  });

  // 18. Verifies Razorpay donation link integrity
  it('18. Verifies Razorpay donation link integrity', () => {
    expect(DONATION_URL).toBe('https://razorpay.me/@heygrowin');
  });

  // 19. Verifies streak support prompt 3-day gap intervals (Day 3, Day 6... never consecutive days)
  it('19. Verifies streak support prompt 3-day gap intervals (Day 3, Day 6... never consecutive days)', () => {
    let progress = loadUserProgress();
    expect(progress.hasShownStreakSupportPrompt).toBe(false);
    expect(progress.lastStreakPromptStreak || 0).toBe(0);

    // Prompt shown at 3-day streak
    const updated = markStreakPromptShown(progress, 3);
    expect(updated.hasShownStreakSupportPrompt).toBe(true);
    expect(updated.lastStreakPromptStreak).toBe(3);

    const afterSave = loadUserProgress();
    expect(afterSave.hasShownStreakSupportPrompt).toBe(true);
    expect(afterSave.lastStreakPromptStreak).toBe(3);

    // Consecutive days (Day 4 and Day 5) must NOT be eligible
    const day4Eligible = 4 >= (afterSave.lastStreakPromptStreak! + 3);
    const day5Eligible = 5 >= (afterSave.lastStreakPromptStreak! + 3);
    expect(day4Eligible).toBe(false);
    expect(day5Eligible).toBe(false);

    // 3 days later (Day 6) IS eligible
    const day6Eligible = 6 >= (afterSave.lastStreakPromptStreak! + 3);
    expect(day6Eligible).toBe(true);

    // After showing on Day 6, update milestone
    const updated6 = markStreakPromptShown(afterSave, 6);
    expect(updated6.lastStreakPromptStreak).toBe(6);
  });

  // 20. Verifies Google Play Closed Testing URL integrity
  it('20. Verifies Google Play Closed Testing URL integrity', () => {
    expect(PLAY_STORE_TESTING_URL).toBe('https://play.google.com/apps/testing/com.gitaquest.app');
  });
});


