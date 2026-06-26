export type Difficulty = 'core' | 'medium' | 'advanced';
export type ExerciseKind = 'flashcard' | 'choice' | 'spelling';
export type RecallRating = 'again' | 'hard' | 'good';

export interface WordEntry {
  id: string;
  word: string;
  meaningZh: string;
  pos: string;
  phonetic: string;
  exampleEn: string;
  exampleZh: string;
  difficulty: Difficulty;
}

export interface ReviewResult {
  wordId: string;
  kind: ExerciseKind;
  rating: RecallRating;
  correct: boolean;
  answeredAt: string;
}

export interface StudyRecord {
  wordId: string;
  seen: boolean;
  familiarity: number;
  intervalDays: number;
  nextReviewOn: string;
  consecutiveCorrect: number;
  errorCount: number;
  favorite: boolean;
  latestResult?: ReviewResult;
  history: ReviewResult[];
}

export interface UserSettings {
  dailyNewWords: number;
}

export interface DailyPlan {
  dueWordIds: string[];
  newWordIds: string[];
}

export interface BackupFile {
  app: 'ielts-vocabulary-pwa';
  version: 1;
  exportedAt: string;
  settings: UserSettings;
  records: StudyRecord[];
}
