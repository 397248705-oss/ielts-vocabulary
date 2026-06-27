import { describe, expect, it } from 'vitest';
import { makeRecord } from '../test/fixtures';
import { calculateStats } from './stats';

describe('calculateStats', () => {
  it('counts mastered words and accuracy', () => {
    const stats = calculateStats(
      [
        makeRecord({
          familiarity: 5,
          history: [
            makeResult('2026-06-26T00:00:00.000Z', true),
            makeResult('2026-06-26T00:01:00.000Z', false)
          ]
        })
      ],
      '2026-06-26'
    );

    expect(stats.seenCount).toBe(1);
    expect(stats.masteredCount).toBe(1);
    expect(stats.accuracy).toBe(50);
  });

  it('calculates favorites, active mistakes, streak, and seven-day activity', () => {
    const stats = calculateStats(
      [
        makeRecord({
          wordId: 'ielts-abandon',
          favorite: true,
          errorCount: 2,
          mistakeMastered: false,
          history: [
            makeResult('2026-06-27T12:00:00.000Z', true),
            makeResult('2026-06-26T12:00:00.000Z', false)
          ]
        }),
        makeRecord({
          wordId: 'ielts-accurate',
          errorCount: 1,
          mistakeMastered: true,
          history: [makeResult('2026-06-25T12:00:00.000Z', true)]
        })
      ],
      '2026-06-27'
    );

    expect(stats.favoriteCount).toBe(1);
    expect(stats.mistakeWordCount).toBe(1);
    expect(stats.streakDays).toBe(3);
    expect(stats.recentActivity).toEqual([
      { date: '2026-06-21', answers: 0 },
      { date: '2026-06-22', answers: 0 },
      { date: '2026-06-23', answers: 0 },
      { date: '2026-06-24', answers: 0 },
      { date: '2026-06-25', answers: 1 },
      { date: '2026-06-26', answers: 1 },
      { date: '2026-06-27', answers: 1 }
    ]);
  });

  it('keeps a streak when today has not started but yesterday was active', () => {
    const stats = calculateStats(
      [
        makeRecord({
          history: [
            makeResult('2026-06-26T12:00:00.000Z', true),
            makeResult('2026-06-25T12:00:00.000Z', true)
          ]
        })
      ],
      '2026-06-27'
    );

    expect(stats.streakDays).toBe(2);
  });
});

function makeResult(answeredAt: string, correct: boolean) {
  return {
    wordId: 'ielts-abandon',
    kind: 'choice' as const,
    rating: correct ? ('good' as const) : ('again' as const),
    correct,
    answeredAt
  };
}
