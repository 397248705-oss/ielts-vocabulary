import { createNewRecord } from './scheduler';
import type { StudyRecord, WordEntry, WordSource } from './types';

export interface LibraryFilters {
  query: string;
  topic: string | 'all';
  source: WordSource | 'all';
  favoritesOnly: boolean;
}

export function filterWords(
  words: WordEntry[],
  records: StudyRecord[],
  filters: LibraryFilters
): WordEntry[] {
  const query = filters.query.trim().toLowerCase();
  const recordByWordId = new Map(records.map((record) => [record.wordId, record]));

  return words.filter((word) => {
    const matchesQuery =
      query.length === 0 ||
      word.word.toLowerCase().includes(query) ||
      word.meaningZh.toLowerCase().includes(query);
    const matchesTopic = filters.topic === 'all' || word.topic === filters.topic;
    const matchesSource = filters.source === 'all' || word.source === filters.source;
    const matchesFavorite =
      !filters.favoritesOnly || recordByWordId.get(word.id)?.favorite === true;

    return matchesQuery && matchesTopic && matchesSource && matchesFavorite;
  });
}

export function toggleFavorite(
  records: StudyRecord[],
  wordId: string,
  today: string
): StudyRecord[] {
  const existing = records.find((record) => record.wordId === wordId);

  if (!existing) {
    return [...records, { ...createNewRecord(wordId, today), favorite: true }];
  }

  return records.map((record) =>
    record.wordId === wordId ? { ...record, favorite: !record.favorite } : record
  );
}
