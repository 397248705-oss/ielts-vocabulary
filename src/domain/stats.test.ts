import { describe, expect, it } from 'vitest';
import { makeRecord } from '../test/fixtures';
import { calculateStats } from './stats';

describe('calculateStats', () => {
  it('counts mastered words and accuracy', () => {
    const stats = calculateStats([
      makeRecord({
        familiarity: 5,
        history: [
          {
            wordId: 'ielts-abandon',
            kind: 'choice',
            rating: 'good',
            correct: true,
            answeredAt: '2026-06-26T00:00:00.000Z'
          },
          {
            wordId: 'ielts-abandon',
            kind: 'spelling',
            rating: 'again',
            correct: false,
            answeredAt: '2026-06-26T00:01:00.000Z'
          }
        ]
      })
    ]);

    expect(stats.seenCount).toBe(1);
    expect(stats.masteredCount).toBe(1);
    expect(stats.accuracy).toBe(50);
  });
});
