import { describe, expect, it } from 'vitest';
import { fixtureWords, makeRecord } from '../test/fixtures';
import { buildChoiceOptions, checkSpellingAnswer, chooseExerciseKind } from './exercises';

describe('chooseExerciseKind', () => {
  it('uses flashcards for unseen words', () => {
    expect(chooseExerciseKind(undefined)).toBe('flashcard');
  });

  it('uses spelling for familiar words', () => {
    expect(chooseExerciseKind(makeRecord({ consecutiveCorrect: 2, familiarity: 4 }))).toBe('spelling');
  });
});

describe('buildChoiceOptions', () => {
  it('returns four options with the correct meaning included', () => {
    const options = buildChoiceOptions(fixtureWords[0], fixtureWords);

    expect(options).toContain('放弃；抛弃');
    expect(options).toHaveLength(4);
  });
});

describe('checkSpellingAnswer', () => {
  it('accepts answers regardless of case and surrounding spaces', () => {
    expect(checkSpellingAnswer(' Abandon ', 'abandon')).toBe(true);
  });
});
