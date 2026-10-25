import { scriptureData } from './storage';
import type { Verse } from '../types';

export interface SearchResult {
  chapterNumber: number;
  chapterTitle: string;
  chapterSanskrit: string;
  verseNumber: number;
  verse: Verse;
  matchType: 'reference' | 'sanskrit' | 'hindi' | 'english' | 'chapter';
  snippet: string;
}

function normalize(text: string): string {
  if (!text) return '';
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export function searchScripture(query: string): SearchResult[] {
  if (!query || query.trim().length < 2) return [];

  const rawQuery = query.trim();
  const normalizedQuery = normalize(rawQuery);

  // 1. Check for verse reference pattern (e.g. "2:47", "2.47", "2 47", "ch 2 v 47")
  const refMatch = rawQuery.match(/(?:ch(?:apter)?\s*)?(\d+)[.:\s]+(\d+)/i);
  if (refMatch) {
    const chNum = parseInt(refMatch[1], 10);
    const vNum = parseInt(refMatch[2], 10);

    const targetChapter = scriptureData.chapters.find((c) => c.chapter_number === chNum);
    if (targetChapter) {
      const targetVerse = targetChapter.verses.find((v) => v.verse === vNum);
      if (targetVerse) {
        return [
          {
            chapterNumber: chNum,
            chapterTitle: targetChapter.translation,
            chapterSanskrit: targetChapter.name,
            verseNumber: vNum,
            verse: targetVerse,
            matchType: 'reference',
            snippet: `${targetVerse.sanskrit.split('\n')[0]} — ${targetVerse.english.slice(0, 90)}...`,
          },
        ];
      }
    }
  }

  // 2. Keyword search across all verses
  const results: SearchResult[] = [];
  const maxResults = 50;

  for (const ch of scriptureData.chapters) {
    // Check chapter name match
    const chNormEn = normalize(ch.translation);
    const chNormHi = normalize(ch.meaning.hi);
    const chNormSa = normalize(ch.name);
    const chMatched =
      chNormEn.includes(normalizedQuery) ||
      chNormHi.includes(normalizedQuery) ||
      chNormSa.includes(normalizedQuery);

    for (const v of ch.verses) {
      if (results.length >= maxResults) break;

      const normSanskrit = normalize(v.sanskrit);
      const normHindi = normalize(v.hindi);
      const normEnglish = normalize(v.english);

      if (normSanskrit.includes(normalizedQuery)) {
        results.push({
          chapterNumber: ch.chapter_number,
          chapterTitle: ch.translation,
          chapterSanskrit: ch.name,
          verseNumber: v.verse,
          verse: v,
          matchType: 'sanskrit',
          snippet: v.sanskrit.split('\n')[0],
        });
      } else if (normHindi.includes(normalizedQuery)) {
        results.push({
          chapterNumber: ch.chapter_number,
          chapterTitle: ch.translation,
          chapterSanskrit: ch.name,
          verseNumber: v.verse,
          verse: v,
          matchType: 'hindi',
          snippet: v.hindi.slice(0, 100) + '...',
        });
      } else if (normEnglish.includes(normalizedQuery)) {
        results.push({
          chapterNumber: ch.chapter_number,
          chapterTitle: ch.translation,
          chapterSanskrit: ch.name,
          verseNumber: v.verse,
          verse: v,
          matchType: 'english',
          snippet: v.english.slice(0, 100) + '...',
        });
      } else if (chMatched && v.verse === 1) {
        // Return first verse of matched chapter
        results.push({
          chapterNumber: ch.chapter_number,
          chapterTitle: ch.translation,
          chapterSanskrit: ch.name,
          verseNumber: 1,
          verse: v,
          matchType: 'chapter',
          snippet: `Chapter ${ch.chapter_number}: ${ch.translation} (${ch.meaning.en})`,
        });
      }
    }
  }

  return results;
}
