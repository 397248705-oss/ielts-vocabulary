import type { ExerciseKind, RecallRating, ReviewResult, StudyRecord } from './types';

interface ReviewInput {
  kind: ExerciseKind;
  rating: RecallRating;
  correct: boolean;
}

function addDays(dateText: string, days: number): string {
  const date = new Date(`${dateText}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function createNewRecord(wordId: string, today: string): StudyRecord {
  return {
    wordId,
    seen: false,
    familiarity: 0,
    intervalDays: 0,
    nextReviewOn: today,
    consecutiveCorrect: 0,
    errorCount: 0,
    favorite: false,
    mistakeMastered: false,
    history: []
  };
}

export function applyReviewResult(
  record: StudyRecord,
  input: ReviewInput,
  today: string
): StudyRecord {
  const answeredAt = `${today}T12:00:00.000Z`;
  const result: ReviewResult = {
    wordId: record.wordId,
    kind: input.kind,
    rating: input.rating,
    correct: input.correct,
    answeredAt
  };

  if (!input.correct || input.rating === 'again') {
    return {
      ...record,
      seen: true,
      familiarity: clamp(record.familiarity - 2, 0, 5),
      intervalDays: 1,
      nextReviewOn: addDays(today, 1),
      consecutiveCorrect: 0,
      errorCount: record.errorCount + 1,
      mistakeMastered: false,
      lastMistakeAt: answeredAt,
      latestResult: result,
      history: [...record.history, result]
    };
  }

  if (input.rating === 'hard') {
    return {
      ...record,
      seen: true,
      familiarity: clamp(record.familiarity, 0, 5),
      intervalDays: 2,
      nextReviewOn: addDays(today, 2),
      latestResult: result,
      history: [...record.history, result]
    };
  }

  const multiplier = input.kind === 'spelling' ? 2.4 : input.kind === 'choice' ? 1.8 : 1.5;
  const baseInterval = Math.max(1, record.intervalDays || 1);
  const intervalDays = Math.ceil(baseInterval * multiplier);

  return {
    ...record,
    seen: true,
    familiarity: clamp(record.familiarity + (input.kind === 'spelling' ? 2 : 1), 0, 5),
    intervalDays,
    nextReviewOn: addDays(today, intervalDays),
    consecutiveCorrect: record.consecutiveCorrect + 1,
    latestResult: result,
    history: [...record.history, result]
  };
}
