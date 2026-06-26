import type { StudyRecord } from './types';

export interface StudyStats {
  seenCount: number;
  masteredCount: number;
  totalAnswers: number;
  correctAnswers: number;
  accuracy: number;
}

export function calculateStats(records: StudyRecord[]): StudyStats {
  const allResults = records.flatMap((record) => record.history);
  const totalAnswers = allResults.length;
  const correctAnswers = allResults.filter((result) => result.correct).length;

  return {
    seenCount: records.filter((record) => record.seen).length,
    masteredCount: records.filter((record) => record.familiarity >= 5).length,
    totalAnswers,
    correctAnswers,
    accuracy: totalAnswers === 0 ? 0 : Math.round((correctAnswers / totalAnswers) * 100)
  };
}
