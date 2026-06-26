import { describe, expect, it } from 'vitest';
import { ieltsWords } from './ieltsWords';
import { validateVocabulary } from './validateVocabulary';

describe('ieltsWords', () => {
  it('contains a useful first-release IELTS vocabulary set', () => {
    expect(ieltsWords.length).toBeGreaterThanOrEqual(500);
    expect(ieltsWords.length).toBeLessThanOrEqual(1000);
    expect(validateVocabulary(ieltsWords)).toEqual([]);
  });
});
