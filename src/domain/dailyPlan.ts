import type { DailyPlan, StudyRecord, WordEntry } from './types';

interface BuildDailyPlanInput {
  words: WordEntry[];
  records: StudyRecord[];
  dailyNewWords: number;
  today: string;
}

export function buildDailyPlan(input: BuildDailyPlanInput): DailyPlan {
  const recordByWordId = new Map(input.records.map((record) => [record.wordId, record]));

  const dueWordIds = input.words
    .filter((word) => {
      const record = recordByWordId.get(word.id);
      return record?.seen === true && record.nextReviewOn <= input.today;
    })
    .map((word) => word.id);

  const newWordIds = input.words
    .filter((word) => !recordByWordId.get(word.id)?.seen)
    .slice(0, input.dailyNewWords)
    .map((word) => word.id);

  return { dueWordIds, newWordIds };
}
