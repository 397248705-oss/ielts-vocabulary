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

  it('keeps custom words first when they are supplied first', () => {
    const customWord = {
      ...fixtureWords[0],
      id: 'custom-1',
      word: 'resilient',
      source: 'custom' as const,
      topic: 'custom'
    };
    const plan = buildDailyPlan({
      words: [customWord, ...fixtureWords],
      records: [],
      dailyNewWords: 2,
      today: '2026-06-27'
    });

    expect(plan.newWordIds).toEqual(['custom-1', 'ielts-abandon']);
  });
});
