import { describe, expect, it } from 'vitest';
import { fixtureWords, makeRecord } from '../test/fixtures';
import { filterWords, toggleFavorite } from './library';

describe('vocabulary library', () => {
  it('combines query, topic, source, and favorite filters', () => {
    const records = [makeRecord({ wordId: 'ielts-abandon', favorite: true })];

    const result = filterWords(fixtureWords, records, {
      query: '放弃',
      topic: 'general',
      source: 'ielts',
      favoritesOnly: true
    });

    expect(result.map((word) => word.id)).toEqual(['ielts-abandon']);
  });

  it('creates a record when an unseen word is favorited', () => {
    const result = toggleFavorite([], 'ielts-abandon', '2026-06-27');

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      wordId: 'ielts-abandon',
      seen: false,
      favorite: true
    });
  });

  it('toggles an existing favorite off without losing study history', () => {
    const record = makeRecord({ favorite: true, familiarity: 3 });
    const result = toggleFavorite([record], record.wordId, '2026-06-27');

    expect(result[0]).toMatchObject({ favorite: false, familiarity: 3 });
  });
});
