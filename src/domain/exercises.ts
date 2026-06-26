import type { ExerciseKind, StudyRecord, WordEntry } from './types';

export function chooseExerciseKind(record?: StudyRecord): ExerciseKind {
  if (!record?.seen) {
    return 'flashcard';
  }

  if (record.familiarity >= 4 && record.consecutiveCorrect >= 2) {
    return 'spelling';
  }

  if (record.familiarity >= 2) {
    return 'choice';
  }

  return 'flashcard';
}

export function buildChoiceOptions(target: WordEntry, allWords: WordEntry[]): string[] {
  const distractors = allWords
    .filter((word) => word.id !== target.id)
    .map((word) => word.meaningZh)
    .slice(0, 3);

  while (distractors.length < 3) {
    distractors.push(target.meaningZh);
  }

  return [target.meaningZh, ...distractors].slice(0, 4);
}

export function checkChoiceAnswer(selectedMeaning: string, target: WordEntry): boolean {
  return selectedMeaning === target.meaningZh;
}

export function checkSpellingAnswer(answer: string, expectedWord: string): boolean {
  return answer.trim().toLowerCase() === expectedWord.trim().toLowerCase();
}
