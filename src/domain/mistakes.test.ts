import { describe, expect, it } from 'vitest';
import { makeRecord } from '../test/fixtures';
import { getActiveMistakes, setMistakeMastered } from './mistakes';

describe('mistake state', () => {
  it('keeps only mistakes that are not marked as mastered', () => {
    const active = makeRecord({ wordId: 'active', errorCount: 2, mistakeMastered: false });
    const mastered = makeRecord({ wordId: 'mastered', errorCount: 4, mistakeMastered: true });
    const clean = makeRecord({ wordId: 'clean', errorCount: 0, mistakeMastered: false });

    expect(getActiveMistakes([mastered, clean, active]).map((record) => record.wordId)).toEqual([
      'active'
    ]);
  });

  it('marks a mistake as mastered without deleting its history', () => {
    const record = makeRecord({ errorCount: 3, mistakeMastered: false });
    const result = setMistakeMastered([record], record.wordId, true);

    expect(result[0]).toMatchObject({ errorCount: 3, mistakeMastered: true });
  });
});
