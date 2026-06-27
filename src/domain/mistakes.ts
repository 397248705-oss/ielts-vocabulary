import type { StudyRecord } from './types';

export function getActiveMistakes(records: StudyRecord[]): StudyRecord[] {
  return records
    .filter((record) => record.errorCount > 0 && !record.mistakeMastered)
    .sort((left, right) => {
      if (right.errorCount !== left.errorCount) {
        return right.errorCount - left.errorCount;
      }

      return (right.lastMistakeAt ?? '').localeCompare(left.lastMistakeAt ?? '');
    });
}

export function setMistakeMastered(
  records: StudyRecord[],
  wordId: string,
  mastered: boolean
): StudyRecord[] {
  return records.map((record) =>
    record.wordId === wordId ? { ...record, mistakeMastered: mastered } : record
  );
}
