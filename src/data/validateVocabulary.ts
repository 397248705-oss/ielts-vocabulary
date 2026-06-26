import type { WordEntry } from '../domain/types';

const requiredFields: Array<keyof WordEntry> = [
  'id',
  'word',
  'meaningZh',
  'pos',
  'phonetic',
  'exampleEn',
  'exampleZh',
  'difficulty'
];

export function validateVocabulary(words: WordEntry[]): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();

  for (const entry of words) {
    if (ids.has(entry.id)) {
      errors.push(`Duplicate word id: ${entry.id}`);
    }
    ids.add(entry.id);

    for (const field of requiredFields) {
      const value = entry[field];
      if (typeof value !== 'string' || value.trim().length === 0) {
        errors.push(`${entry.id || '(missing id)'} is missing ${field}`);
      }
    }

    if (!['core', 'medium', 'advanced'].includes(entry.difficulty)) {
      errors.push(`${entry.id} has invalid difficulty`);
    }
  }

  return errors;
}
