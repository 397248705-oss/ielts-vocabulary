import { describe, expect, it } from 'vitest';
import { applyReviewResult } from './scheduler';
import { makeRecord } from '../test/fixtures';

describe('applyReviewResult', () => {
  it('brings incorrect answers back soon', () => {
    const next = applyReviewResult(
      makeRecord({ familiarity: 3, intervalDays: 7, consecutiveCorrect: 4 }),
      { kind: 'choice', rating: 'again', correct: false },
      '2026-06-26'
    );

    expect(next.nextReviewOn).toBe('2026-06-27');
    expect(next.intervalDays).toBe(1);
    expect(next.familiarity).toBe(1);
    expect(next.errorCount).toBe(1);
    expect(next.consecutiveCorrect).toBe(0);
  });

  it('gives spelling answers stronger growth than choice answers', () => {
    const spelling = applyReviewResult(
      makeRecord({ familiarity: 3, intervalDays: 5 }),
      { kind: 'spelling', rating: 'good', correct: true },
      '2026-06-26'
    );
    const choice = applyReviewResult(
      makeRecord({ familiarity: 3, intervalDays: 5 }),
      { kind: 'choice', rating: 'good', correct: true },
      '2026-06-26'
    );

    expect(spelling.intervalDays).toBeGreaterThan(choice.intervalDays);
    expect(spelling.familiarity).toBeGreaterThanOrEqual(choice.familiarity);
  });

  it('keeps hard answers on a short interval', () => {
    const next = applyReviewResult(
      makeRecord({ familiarity: 2, intervalDays: 3 }),
      { kind: 'flashcard', rating: 'hard', correct: true },
      '2026-06-26'
    );

    expect(next.nextReviewOn).toBe('2026-06-28');
    expect(next.intervalDays).toBe(2);
  });
});
