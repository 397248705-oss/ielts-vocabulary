import { describe, expect, it } from 'vitest';
import { validateVocabulary } from './validateVocabulary';
import type { WordEntry } from '../domain/types';

const validWord: WordEntry = {
  id: 'ielts-abandon',
  word: 'abandon',
  meaningZh: '放弃；抛弃',
  pos: 'verb',
  phonetic: '/əˈbændən/',
  exampleEn: 'The plan was abandoned after costs rose sharply.',
  exampleZh: '成本大幅上升后，这个计划被放弃了。',
  difficulty: 'core',
  source: 'ielts',
  topic: 'general'
};

describe('validateVocabulary', () => {
  it('accepts complete unique vocabulary entries', () => {
    expect(validateVocabulary([validWord])).toEqual([]);
  });

  it('rejects duplicate ids', () => {
    const errors = validateVocabulary([validWord, { ...validWord, word: 'abandonment' }]);
    expect(errors).toContain('Duplicate word id: ielts-abandon');
  });

  it('rejects entries missing learning content', () => {
    const errors = validateVocabulary([{ ...validWord, exampleEn: '' }]);
    expect(errors).toContain('ielts-abandon is missing exampleEn');
  });
});
