export type Difficulty = 'core' | 'medium' | 'advanced';
export type ExerciseKind = 'flashcard' | 'choice' | 'spelling';
export type RecallRating = 'again' | 'hard' | 'good';
export type WordSource = 'ielts' | 'custom';

export interface WordEntry {
  id: string;
  word: string;
  meaningZh: string;
  pos: string;
  phonetic: string;
  exampleEn: string;
  exampleZh: string;
  difficulty: Difficulty;
  source: WordSource;
  topic: string;
  createdAt?: string;
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
  mistakeMastered: boolean;
  lastMistakeAt?: string;
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
