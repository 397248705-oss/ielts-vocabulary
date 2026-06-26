import { describe, expect, it } from 'vitest';
import { fixtureWords, makeRecord } from '../test/fixtures';
import { buildDailyPlan } from './dailyPlan';

describe('buildDailyPlan', () => {
  it('prioritizes due review words before new words', () => {
    const plan = buildDailyPlan({
      words: fixtureWords,
      records: [makeRecord({ wordId: 'ielts-abandon', seen: true, nextReviewOn: '2026-06-25' })],
      dailyNewWords: 2,
      today: '2026-06-26'
    });

    expect(plan.dueWordIds).toEqual(['ielts-abandon']);
    expect(plan.newWordIds).toEqual(['ielts-accurate', 'ielts-allocate']);
  });

  it('does not include future review words as due', () => {
    const plan = buildDailyPlan({
      words: fixtureWords,
      records: [makeRecord({ wordId: 'ielts-abandon', seen: true, nextReviewOn: '2026-06-27' })],
      dailyNewWords: 1,
      today: '2026-06-26'
    });

    expect(plan.dueWordIds).toEqual([]);
    expect(plan.newWordIds).toEqual(['ielts-accurate']);
  });
});
