import type { StudyRecord } from './types';

export interface StudyStats {
  seenCount: number;
  masteredCount: number;
  mistakeWordCount: number;
  favoriteCount: number;
  totalAnswers: number;
  correctAnswers: number;
  accuracy: number;
  streakDays: number;
  recentActivity: Array<{ date: string; answers: number }>;
}

function addDays(dateText: string, days: number): string {
  const date = new Date(`${dateText}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function calculateStreak(activeDates: Set<string>, today: string): number {
  const yesterday = addDays(today, -1);
  let cursor = activeDates.has(today) ? today : activeDates.has(yesterday) ? yesterday : '';
  let streak = 0;

  while (cursor && activeDates.has(cursor)) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }

  return streak;
}

export function calculateStats(
  records: StudyRecord[],
  today = new Date().toISOString().slice(0, 10)
): StudyStats {
  const allResults = records.flatMap((record) => record.history);
  const totalAnswers = allResults.length;
  const correctAnswers = allResults.filter((result) => result.correct).length;
  const answersByDate = new Map<string, number>();

  for (const result of allResults) {
    const date = result.answeredAt.slice(0, 10);
    answersByDate.set(date, (answersByDate.get(date) ?? 0) + 1);
  }

  const recentActivity = Array.from({ length: 7 }, (_, index) => {
    const date = addDays(today, index - 6);
    return { date, answers: answersByDate.get(date) ?? 0 };
  });

  return {
    seenCount: records.filter((record) => record.seen).length,
    masteredCount: records.filter((record) => record.familiarity >= 5).length,
    mistakeWordCount: records.filter(
      (record) => record.errorCount > 0 && !record.mistakeMastered
    ).length,
    favoriteCount: records.filter((record) => record.favorite).length,
    totalAnswers,
    correctAnswers,
    accuracy: totalAnswers === 0 ? 0 : Math.round((correctAnswers / totalAnswers) * 100),
    streakDays: calculateStreak(new Set(answersByDate.keys()), today),
    recentActivity
  };
}
