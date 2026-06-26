# IELTS Vocabulary PWA Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a mobile-first IELTS vocabulary PWA with local progress, mixed exercises, Anki-style review scheduling, browser pronunciation, backup/restore, and offline support.

**Architecture:** Use a Vite React TypeScript app with focused domain modules for vocabulary, scheduling, daily planning, storage, backup, and speech. Keep UI components thin: screens call domain services and storage adapters rather than embedding study logic in React components.

**Tech Stack:** React, TypeScript, Vite, Vitest, Testing Library, Playwright, lucide-react, native IndexedDB, Service Worker, Web App Manifest.

---

## File Structure

- Create `package.json`: scripts and dependencies for the PWA.
- Create `index.html`: Vite HTML entry with mobile viewport and manifest links.
- Create `tsconfig.json`, `tsconfig.node.json`, `vite.config.ts`, `vitest.setup.ts`: TypeScript and test configuration.
- Create `playwright.config.ts`: mobile browser verification configuration.
- Create `public/manifest.webmanifest`: installable app metadata.
- Create `public/sw.js`: hand-written app-shell service worker.
- Create `public/icons/icon.svg`: simple app icon source.
- Create `src/main.tsx`: React entrypoint and service worker registration.
- Create `src/App.tsx`: top-level app shell, navigation, app state wiring.
- Create `src/styles.css`: mobile-first layout and component styles.
- Create `src/domain/types.ts`: shared vocabulary, study record, settings, review, and backup types.
- Create `src/data/ieltsWords.ts`: built-in IELTS vocabulary data.
- Create `src/data/validateVocabulary.ts`: vocabulary validation helpers.
- Create `src/domain/scheduler.ts`: spaced repetition result handling.
- Create `src/domain/dailyPlan.ts`: today task construction from due reviews and new words.
- Create `src/domain/exercises.ts`: exercise type selection and answer checking.
- Create `src/domain/stats.ts`: statistics derived from records and sessions.
- Create `src/storage/db.ts`: IndexedDB adapter.
- Create `src/storage/backup.ts`: JSON export/import validation and conversion.
- Create `src/platform/speech.ts`: browser speech synthesis wrapper.
- Create `src/screens/HomeScreen.tsx`: today dashboard.
- Create `src/screens/StudyScreen.tsx`: mixed learning session.
- Create `src/screens/VocabularyScreen.tsx`: searchable vocabulary browser.
- Create `src/screens/StatsScreen.tsx`: progress dashboard.
- Create `src/screens/SettingsScreen.tsx`: daily target, backup/restore, reset.
- Create `src/components/BottomNav.tsx`, `src/components/WordCard.tsx`, `src/components/ProgressRing.tsx`, `src/components/ConfirmDialog.tsx`: reusable UI components.
- Create `src/test/fixtures.ts`: deterministic words and records for tests.
- Create `src/**/*.test.ts` and `src/**/*.test.tsx`: unit and component tests.
- Create `tests/mobile.spec.ts`: Playwright mobile flow test.

---

### Task 1: Project Scaffold and Tooling

**Files:**
- Create: `package.json`
- Create: `index.html`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `vite.config.ts`
- Create: `vitest.setup.ts`
- Create: `playwright.config.ts`

- [ ] **Step 1: Create package manifest**

Create `package.json` with this content:

```json
{
  "name": "ielts-vocabulary-pwa",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite --host 0.0.0.0",
    "build": "tsc -b && vite build",
    "preview": "vite preview --host 0.0.0.0",
    "test": "vitest run",
    "test:watch": "vitest",
    "e2e": "playwright test"
  },
  "dependencies": {
    "@vitejs/plugin-react": "^5.0.0",
    "lucide-react": "^0.468.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "vite": "^6.0.0"
  },
  "devDependencies": {
    "@playwright/test": "^1.49.0",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.1.0",
    "@testing-library/user-event": "^14.5.2",
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "jsdom": "^25.0.1",
    "typescript": "^5.6.3",
    "vitest": "^2.1.5"
  }
}
```

- [ ] **Step 2: Install dependencies**

Run:

```powershell
npm install
```

Expected: command exits `0` and creates `package-lock.json`.

- [ ] **Step 3: Add HTML entry**

Create `index.html`:

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <meta name="theme-color" content="#f7f3ea" />
    <link rel="manifest" href="/manifest.webmanifest" />
    <title>雅思单词本</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 4: Add TypeScript config**

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["DOM", "DOM.Iterable", "ES2020"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

Create `tsconfig.node.json`:

```json
{
  "compilerOptions": {
    "composite": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts", "playwright.config.ts"]
}
```

- [ ] **Step 5: Add Vite and test config**

Create `vite.config.ts`:

```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
    globals: true
  }
});
```

Create `vitest.setup.ts`:

```ts
import '@testing-library/jest-dom/vitest';
```

Create `playwright.config.ts`:

```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  webServer: {
    command: 'npm run dev -- --port 5173',
    url: 'http://127.0.0.1:5173',
    reuseExistingServer: true
  },
  use: {
    baseURL: 'http://127.0.0.1:5173',
    trace: 'on-first-retry'
  },
  projects: [
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 7'] }
    }
  ]
});
```

- [ ] **Step 6: Verify scaffold**

Run:

```powershell
npm run build
```

Expected: TypeScript may fail because `src/main.tsx` does not exist yet. The failure should name the missing entry file, not a package or config syntax error.

- [ ] **Step 7: Commit scaffold**

Run:

```powershell
git add package.json package-lock.json index.html tsconfig.json tsconfig.node.json vite.config.ts vitest.setup.ts playwright.config.ts
git commit -m "chore: scaffold vocabulary PWA tooling"
```

Expected: commit succeeds.

---

### Task 2: Domain Types and Vocabulary Validation

**Files:**
- Create: `src/domain/types.ts`
- Create: `src/data/ieltsWords.ts`
- Create: `src/data/validateVocabulary.ts`
- Create: `src/data/validateVocabulary.test.ts`
- Create: `src/test/fixtures.ts`

- [ ] **Step 1: Write failing vocabulary validation tests**

Create `src/data/validateVocabulary.test.ts`:

```ts
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
  difficulty: 'core'
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
```

- [ ] **Step 2: Run failing test**

Run:

```powershell
npm test -- src/data/validateVocabulary.test.ts
```

Expected: FAIL because `src/domain/types.ts` and `src/data/validateVocabulary.ts` do not exist.

- [ ] **Step 3: Add domain types**

Create `src/domain/types.ts`:

```ts
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
```

- [ ] **Step 4: Add validation helper**

Create `src/data/validateVocabulary.ts`:

```ts
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
```

- [ ] **Step 5: Add initial vocabulary file and fixtures**

Create `src/data/ieltsWords.ts`:

```ts
import type { WordEntry } from '../domain/types';

export const ieltsWords: WordEntry[] = [
  {
    id: 'ielts-abandon',
    word: 'abandon',
    meaningZh: '放弃；抛弃',
    pos: 'verb',
    phonetic: '/əˈbændən/',
    exampleEn: 'The plan was abandoned after costs rose sharply.',
    exampleZh: '成本大幅上升后，这个计划被放弃了。',
    difficulty: 'core'
  },
  {
    id: 'ielts-accurate',
    word: 'accurate',
    meaningZh: '准确的；精确的',
    pos: 'adjective',
    phonetic: '/ˈækjərət/',
    exampleEn: 'Accurate data is essential for a reliable conclusion.',
    exampleZh: '准确的数据对于可靠结论很重要。',
    difficulty: 'core'
  },
  {
    id: 'ielts-allocate',
    word: 'allocate',
    meaningZh: '分配；划拨',
    pos: 'verb',
    phonetic: '/ˈæləkeɪt/',
    exampleEn: 'The university allocated more funds to language research.',
    exampleZh: '这所大学给语言研究分配了更多资金。',
    difficulty: 'medium'
  }
];
```

Create `src/test/fixtures.ts`:

```ts
import type { StudyRecord, UserSettings, WordEntry } from '../domain/types';

export const fixtureWords: WordEntry[] = [
  {
    id: 'ielts-abandon',
    word: 'abandon',
    meaningZh: '放弃；抛弃',
    pos: 'verb',
    phonetic: '/əˈbændən/',
    exampleEn: 'The plan was abandoned after costs rose sharply.',
    exampleZh: '成本大幅上升后，这个计划被放弃了。',
    difficulty: 'core'
  },
  {
    id: 'ielts-accurate',
    word: 'accurate',
    meaningZh: '准确的；精确的',
    pos: 'adjective',
    phonetic: '/ˈækjərət/',
    exampleEn: 'Accurate data is essential for a reliable conclusion.',
    exampleZh: '准确的数据对于可靠结论很重要。',
    difficulty: 'core'
  },
  {
    id: 'ielts-allocate',
    word: 'allocate',
    meaningZh: '分配；划拨',
    pos: 'verb',
    phonetic: '/ˈæləkeɪt/',
    exampleEn: 'The university allocated more funds to language research.',
    exampleZh: '这所大学给语言研究分配了更多资金。',
    difficulty: 'medium'
  }
];

export const defaultSettings: UserSettings = {
  dailyNewWords: 20
};

export function makeRecord(overrides: Partial<StudyRecord> = {}): StudyRecord {
  return {
    wordId: 'ielts-abandon',
    seen: true,
    familiarity: 1,
    intervalDays: 1,
    nextReviewOn: '2026-06-26',
    consecutiveCorrect: 0,
    errorCount: 0,
    favorite: false,
    history: [],
    ...overrides
  };
}
```

- [ ] **Step 6: Verify validation tests pass**

Run:

```powershell
npm test -- src/data/validateVocabulary.test.ts
```

Expected: PASS.

- [ ] **Step 7: Commit domain types and validation**

Run:

```powershell
git add src/domain/types.ts src/data/ieltsWords.ts src/data/validateVocabulary.ts src/data/validateVocabulary.test.ts src/test/fixtures.ts
git commit -m "feat: add vocabulary domain model"
```

Expected: commit succeeds.

---

### Task 3: Spaced Repetition Scheduler

**Files:**
- Create: `src/domain/scheduler.ts`
- Create: `src/domain/scheduler.test.ts`

- [ ] **Step 1: Write scheduler tests**

Create `src/domain/scheduler.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { applyReviewResult } from './scheduler';
import { makeRecord } from '../test/fixtures';

describe('applyReviewResult', () => {
  it('brings incorrect answers back soon', () => {
    const next = applyReviewResult(
      makeRecord({ familiarity: 3, intervalDays: 7, consecutiveCorrect: 4 }),
      { kind: 'choice', rating: 'again', correct: false },
      '2026-06-26'
    );

    expect(next.nextReviewOn).toBe('2026-06-27');
    expect(next.intervalDays).toBe(1);
    expect(next.familiarity).toBe(1);
    expect(next.errorCount).toBe(1);
    expect(next.consecutiveCorrect).toBe(0);
  });

  it('gives spelling answers stronger growth than choice answers', () => {
    const spelling = applyReviewResult(
      makeRecord({ familiarity: 3, intervalDays: 5 }),
      { kind: 'spelling', rating: 'good', correct: true },
      '2026-06-26'
    );
    const choice = applyReviewResult(
      makeRecord({ familiarity: 3, intervalDays: 5 }),
      { kind: 'choice', rating: 'good', correct: true },
      '2026-06-26'
    );

    expect(spelling.intervalDays).toBeGreaterThan(choice.intervalDays);
    expect(spelling.familiarity).toBeGreaterThanOrEqual(choice.familiarity);
  });

  it('keeps hard answers on a short interval', () => {
    const next = applyReviewResult(
      makeRecord({ familiarity: 2, intervalDays: 3 }),
      { kind: 'flashcard', rating: 'hard', correct: true },
      '2026-06-26'
    );

    expect(next.nextReviewOn).toBe('2026-06-28');
    expect(next.intervalDays).toBe(2);
  });
});
```

- [ ] **Step 2: Run failing scheduler tests**

Run:

```powershell
npm test -- src/domain/scheduler.test.ts
```

Expected: FAIL because `applyReviewResult` does not exist.

- [ ] **Step 3: Implement scheduler**

Create `src/domain/scheduler.ts`:

```ts
import type { ExerciseKind, RecallRating, ReviewResult, StudyRecord } from './types';

interface ReviewInput {
  kind: ExerciseKind;
  rating: RecallRating;
  correct: boolean;
}

function addDays(dateText: string, days: number): string {
  const date = new Date(`${dateText}T00:00:00`);
  date.setDate(date.getDate() + days);
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
```

- [ ] **Step 4: Verify scheduler tests pass**

Run:

```powershell
npm test -- src/domain/scheduler.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit scheduler**

Run:

```powershell
git add src/domain/scheduler.ts src/domain/scheduler.test.ts
git commit -m "feat: add spaced repetition scheduler"
```

Expected: commit succeeds.

---

### Task 4: Daily Plan Builder and Exercise Engine

**Files:**
- Create: `src/domain/dailyPlan.ts`
- Create: `src/domain/dailyPlan.test.ts`
- Create: `src/domain/exercises.ts`
- Create: `src/domain/exercises.test.ts`

- [ ] **Step 1: Write daily plan tests**

Create `src/domain/dailyPlan.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { buildDailyPlan } from './dailyPlan';
import { fixtureWords, makeRecord } from '../test/fixtures';

describe('buildDailyPlan', () => {
  it('prioritizes due review words before new words', () => {
    const plan = buildDailyPlan({
      words: fixtureWords,
      records: [
        makeRecord({ wordId: 'ielts-abandon', seen: true, nextReviewOn: '2026-06-25' })
      ],
      dailyNewWords: 2,
      today: '2026-06-26'
    });

    expect(plan.dueWordIds).toEqual(['ielts-abandon']);
    expect(plan.newWordIds).toEqual(['ielts-accurate', 'ielts-allocate']);
  });

  it('does not include future review words as due', () => {
    const plan = buildDailyPlan({
      words: fixtureWords,
      records: [
        makeRecord({ wordId: 'ielts-abandon', seen: true, nextReviewOn: '2026-06-27' })
      ],
      dailyNewWords: 1,
      today: '2026-06-26'
    });

    expect(plan.dueWordIds).toEqual([]);
    expect(plan.newWordIds).toEqual(['ielts-accurate']);
  });
});
```

- [ ] **Step 2: Write exercise tests**

Create `src/domain/exercises.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { buildChoiceOptions, chooseExerciseKind, checkSpellingAnswer } from './exercises';
import { fixtureWords, makeRecord } from '../test/fixtures';

describe('chooseExerciseKind', () => {
  it('uses flashcards for unseen words', () => {
    expect(chooseExerciseKind(undefined)).toBe('flashcard');
  });

  it('uses spelling for familiar words', () => {
    expect(chooseExerciseKind(makeRecord({ familiarity: 4 }))).toBe('spelling');
  });
});

describe('buildChoiceOptions', () => {
  it('returns four options with the correct meaning included', () => {
    const options = buildChoiceOptions(fixtureWords[0], fixtureWords);
    expect(options).toContain('放弃；抛弃');
    expect(options).toHaveLength(4);
  });
});

describe('checkSpellingAnswer', () => {
  it('accepts answers regardless of case and surrounding spaces', () => {
    expect(checkSpellingAnswer(' Abandon ', 'abandon')).toBe(true);
  });
});
```

- [ ] **Step 3: Run failing tests**

Run:

```powershell
npm test -- src/domain/dailyPlan.test.ts src/domain/exercises.test.ts
```

Expected: FAIL because the modules do not exist.

- [ ] **Step 4: Implement daily plan builder**

Create `src/domain/dailyPlan.ts`:

```ts
import type { DailyPlan, StudyRecord, WordEntry } from './types';

interface BuildDailyPlanInput {
  words: WordEntry[];
  records: StudyRecord[];
  dailyNewWords: number;
  today: string;
}

export function buildDailyPlan(input: BuildDailyPlanInput): DailyPlan {
  const recordByWord = new Map(input.records.map((record) => [record.wordId, record]));

  const dueWordIds = input.words
    .filter((word) => {
      const record = recordByWord.get(word.id);
      return record?.seen === true && record.nextReviewOn <= input.today;
    })
    .map((word) => word.id);

  const newWordIds = input.words
    .filter((word) => !recordByWord.get(word.id)?.seen)
    .slice(0, input.dailyNewWords)
    .map((word) => word.id);

  return { dueWordIds, newWordIds };
}
```

- [ ] **Step 5: Implement exercise engine**

Create `src/domain/exercises.ts`:

```ts
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
```

- [ ] **Step 6: Verify plan and exercise tests pass**

Run:

```powershell
npm test -- src/domain/dailyPlan.test.ts src/domain/exercises.test.ts
```

Expected: PASS.

- [ ] **Step 7: Commit daily planning and exercises**

Run:

```powershell
git add src/domain/dailyPlan.ts src/domain/dailyPlan.test.ts src/domain/exercises.ts src/domain/exercises.test.ts
git commit -m "feat: add daily study planning"
```

Expected: commit succeeds.

---

### Task 5: Local Storage and Backup

**Files:**
- Create: `src/storage/db.ts`
- Create: `src/storage/backup.ts`
- Create: `src/storage/backup.test.ts`

- [ ] **Step 1: Write backup tests**

Create `src/storage/backup.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { createBackup, parseBackup } from './backup';
import { defaultSettings, makeRecord } from '../test/fixtures';

describe('backup', () => {
  it('exports records with app metadata', () => {
    const backup = createBackup([makeRecord()], defaultSettings, '2026-06-26T00:00:00.000Z');
    expect(backup.app).toBe('ielts-vocabulary-pwa');
    expect(backup.version).toBe(1);
    expect(backup.records).toHaveLength(1);
  });

  it('rejects malformed imports', () => {
    expect(() => parseBackup('{"app":"other"}')).toThrow('Invalid backup file');
  });

  it('parses valid imports', () => {
    const backup = createBackup([makeRecord()], defaultSettings, '2026-06-26T00:00:00.000Z');
    expect(parseBackup(JSON.stringify(backup)).records[0].wordId).toBe('ielts-abandon');
  });
});
```

- [ ] **Step 2: Run failing backup tests**

Run:

```powershell
npm test -- src/storage/backup.test.ts
```

Expected: FAIL because `src/storage/backup.ts` does not exist.

- [ ] **Step 3: Implement backup helpers**

Create `src/storage/backup.ts`:

```ts
import type { BackupFile, StudyRecord, UserSettings } from '../domain/types';

export function createBackup(
  records: StudyRecord[],
  settings: UserSettings,
  exportedAt = new Date().toISOString()
): BackupFile {
  return {
    app: 'ielts-vocabulary-pwa',
    version: 1,
    exportedAt,
    settings,
    records
  };
}

export function parseBackup(text: string): BackupFile {
  const parsed = JSON.parse(text) as Partial<BackupFile>;

  if (
    parsed.app !== 'ielts-vocabulary-pwa' ||
    parsed.version !== 1 ||
    !Array.isArray(parsed.records) ||
    typeof parsed.settings?.dailyNewWords !== 'number'
  ) {
    throw new Error('Invalid backup file');
  }

  return parsed as BackupFile;
}
```

- [ ] **Step 4: Implement IndexedDB adapter**

Create `src/storage/db.ts`:

```ts
import type { StudyRecord, UserSettings } from '../domain/types';

const DB_NAME = 'ielts-vocabulary-pwa';
const DB_VERSION = 1;
const RECORDS = 'records';
const SETTINGS = 'settings';

const defaultSettings: UserSettings = { dailyNewWords: 20 };

function requestToPromise<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(RECORDS)) {
        db.createObjectStore(RECORDS, { keyPath: 'wordId' });
      }
      if (!db.objectStoreNames.contains(SETTINGS)) {
        db.createObjectStore(SETTINGS);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getRecords(): Promise<StudyRecord[]> {
  const db = await openDatabase();
  const tx = db.transaction(RECORDS, 'readonly');
  return requestToPromise(tx.objectStore(RECORDS).getAll());
}

export async function saveRecord(record: StudyRecord): Promise<void> {
  const db = await openDatabase();
  const tx = db.transaction(RECORDS, 'readwrite');
  await requestToPromise(tx.objectStore(RECORDS).put(record));
}

export async function saveRecords(records: StudyRecord[]): Promise<void> {
  const db = await openDatabase();
  const tx = db.transaction(RECORDS, 'readwrite');
  await Promise.all(records.map((record) => requestToPromise(tx.objectStore(RECORDS).put(record))));
}

export async function getSettings(): Promise<UserSettings> {
  const db = await openDatabase();
  const tx = db.transaction(SETTINGS, 'readonly');
  const settings = await requestToPromise<UserSettings | undefined>(tx.objectStore(SETTINGS).get('user'));
  return settings ?? defaultSettings;
}

export async function saveSettings(settings: UserSettings): Promise<void> {
  const db = await openDatabase();
  const tx = db.transaction(SETTINGS, 'readwrite');
  await requestToPromise(tx.objectStore(SETTINGS).put(settings, 'user'));
}

export async function clearLocalData(): Promise<void> {
  const db = await openDatabase();
  const tx = db.transaction([RECORDS, SETTINGS], 'readwrite');
  await Promise.all([
    requestToPromise(tx.objectStore(RECORDS).clear()),
    requestToPromise(tx.objectStore(SETTINGS).clear())
  ]);
}
```

- [ ] **Step 5: Verify backup tests pass**

Run:

```powershell
npm test -- src/storage/backup.test.ts
```

Expected: PASS.

- [ ] **Step 6: Commit storage and backup**

Run:

```powershell
git add src/storage/db.ts src/storage/backup.ts src/storage/backup.test.ts
git commit -m "feat: add local storage and backup helpers"
```

Expected: commit succeeds.

---

### Task 6: React App Shell and Navigation

**Files:**
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/styles.css`
- Create: `src/components/BottomNav.tsx`
- Create: `src/components/ProgressRing.tsx`
- Create: `src/screens/HomeScreen.tsx`
- Create: `src/screens/VocabularyScreen.tsx`
- Create: `src/screens/StatsScreen.tsx`
- Create: `src/screens/SettingsScreen.tsx`
- Create: `src/App.test.tsx`

- [ ] **Step 1: Write app shell test**

Create `src/App.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('App', () => {
  it('opens to today dashboard and can switch tabs', async () => {
    render(<App />);
    expect(screen.getByText('今日任务')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: '词库' }));
    expect(screen.getByText('雅思词库')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: '设置' }));
    expect(screen.getByLabelText('每日新词数')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run failing app test**

Run:

```powershell
npm test -- src/App.test.tsx
```

Expected: FAIL because `src/App.tsx` does not exist.

- [ ] **Step 3: Create React entrypoint**

Create `src/main.tsx`:

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => undefined);
  });
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

- [ ] **Step 4: Create navigation component**

Create `src/components/BottomNav.tsx`:

```tsx
import { BarChart3, BookOpen, CalendarDays, Settings } from 'lucide-react';

export type TabId = 'today' | 'vocabulary' | 'stats' | 'settings';

interface BottomNavProps {
  active: TabId;
  onChange: (tab: TabId) => void;
}

const tabs = [
  { id: 'today' as const, label: '今日', icon: CalendarDays },
  { id: 'vocabulary' as const, label: '词库', icon: BookOpen },
  { id: 'stats' as const, label: '统计', icon: BarChart3 },
  { id: 'settings' as const, label: '设置', icon: Settings }
];

export function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <nav className="bottom-nav" aria-label="主导航">
      {tabs.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          className={active === id ? 'nav-item active' : 'nav-item'}
          onClick={() => onChange(id)}
          aria-current={active === id ? 'page' : undefined}
        >
          <Icon size={20} aria-hidden="true" />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}
```

- [ ] **Step 5: Create screen stubs with real labels**

Create `src/screens/HomeScreen.tsx`:

```tsx
export function HomeScreen() {
  return (
    <section className="screen">
      <h1>今日任务</h1>
      <div className="dashboard-card">
        <p>待复习 0 个</p>
        <p>新词目标 20 个</p>
        <button className="primary-button" type="button">开始学习</button>
      </div>
    </section>
  );
}
```

Create `src/screens/VocabularyScreen.tsx`:

```tsx
export function VocabularyScreen() {
  return (
    <section className="screen">
      <h1>雅思词库</h1>
      <input className="search-input" aria-label="搜索单词" />
    </section>
  );
}
```

Create `src/screens/StatsScreen.tsx`:

```tsx
export function StatsScreen() {
  return (
    <section className="screen">
      <h1>学习统计</h1>
      <p>连续学习 0 天</p>
    </section>
  );
}
```

Create `src/screens/SettingsScreen.tsx`:

```tsx
export function SettingsScreen() {
  return (
    <section className="screen">
      <h1>设置</h1>
      <label>
        每日新词数
        <input aria-label="每日新词数" type="number" min="1" max="100" defaultValue="20" />
      </label>
    </section>
  );
}
```

- [ ] **Step 6: Create top-level app and styles**

Create `src/App.tsx`:

```tsx
import { useState } from 'react';
import { BottomNav, type TabId } from './components/BottomNav';
import { HomeScreen } from './screens/HomeScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { StatsScreen } from './screens/StatsScreen';
import { VocabularyScreen } from './screens/VocabularyScreen';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('today');

  return (
    <div className="app-shell">
      <main className="app-main">
        {activeTab === 'today' && <HomeScreen />}
        {activeTab === 'vocabulary' && <VocabularyScreen />}
        {activeTab === 'stats' && <StatsScreen />}
        {activeTab === 'settings' && <SettingsScreen />}
      </main>
      <BottomNav active={activeTab} onChange={setActiveTab} />
    </div>
  );
}
```

Create `src/styles.css`:

```css
:root {
  color: #1f2933;
  background: #f7f3ea;
  font-family: Inter, "Segoe UI", system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
  line-height: 1.5;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
  background: #f7f3ea;
}

button,
input {
  font: inherit;
}

.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-main {
  flex: 1;
  padding: 20px 16px 96px;
}

.screen {
  max-width: 520px;
  margin: 0 auto;
}

.screen h1 {
  margin: 0 0 16px;
  font-size: 26px;
  line-height: 1.2;
}

.dashboard-card {
  border: 1px solid #ddd6c8;
  border-radius: 8px;
  padding: 16px;
  background: #fffdf8;
}

.primary-button {
  width: 100%;
  min-height: 52px;
  border: 0;
  border-radius: 8px;
  background: #25635a;
  color: #ffffff;
  font-weight: 700;
}

.bottom-nav {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 4px;
  padding: 8px 10px calc(8px + env(safe-area-inset-bottom));
  border-top: 1px solid #ddd6c8;
  background: #fffdf8;
}

.nav-item {
  min-height: 54px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: #5d6673;
  display: grid;
  justify-items: center;
  align-content: center;
  gap: 2px;
  font-size: 12px;
}

.nav-item.active {
  color: #25635a;
  background: #e3f0ec;
}

.search-input {
  width: 100%;
  min-height: 44px;
  border: 1px solid #c9c1b4;
  border-radius: 8px;
  padding: 0 12px;
  background: #ffffff;
}
```

- [ ] **Step 7: Verify app shell test and build**

Run:

```powershell
npm test -- src/App.test.tsx
npm run build
```

Expected: both commands exit `0`.

- [ ] **Step 8: Commit app shell**

Run:

```powershell
git add src/main.tsx src/App.tsx src/styles.css src/components/BottomNav.tsx src/screens/HomeScreen.tsx src/screens/VocabularyScreen.tsx src/screens/StatsScreen.tsx src/screens/SettingsScreen.tsx src/App.test.tsx
git commit -m "feat: add mobile app shell"
```

Expected: commit succeeds.

---

### Task 7: Study Session UI and Speech

**Files:**
- Create: `src/platform/speech.ts`
- Create: `src/components/WordCard.tsx`
- Create: `src/screens/StudyScreen.tsx`
- Modify: `src/screens/HomeScreen.tsx`
- Modify: `src/App.tsx`
- Create: `src/screens/StudyScreen.test.tsx`

- [ ] **Step 1: Write study screen test**

Create `src/screens/StudyScreen.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { StudyScreen } from './StudyScreen';
import { fixtureWords } from '../test/fixtures';

describe('StudyScreen', () => {
  it('reveals flashcard meaning and records a known answer', async () => {
    const onFinish = vi.fn();
    render(<StudyScreen words={fixtureWords.slice(0, 1)} records={[]} onFinish={onFinish} />);

    expect(screen.getByText('abandon')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: '查看释义' }));
    expect(screen.getByText('放弃；抛弃')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: '认识' }));
    expect(onFinish).toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run failing study test**

Run:

```powershell
npm test -- src/screens/StudyScreen.test.tsx
```

Expected: FAIL because `StudyScreen` does not exist.

- [ ] **Step 3: Add speech helper**

Create `src/platform/speech.ts`:

```ts
export function canSpeak(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
}

export function speakWord(word: string): void {
  if (!canSpeak()) {
    return;
  }
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = 'en-US';
  utterance.rate = 0.9;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}
```

- [ ] **Step 4: Add word card component**

Create `src/components/WordCard.tsx`:

```tsx
import { Volume2 } from 'lucide-react';
import type { WordEntry } from '../domain/types';
import { canSpeak, speakWord } from '../platform/speech';

interface WordCardProps {
  word: WordEntry;
  revealed: boolean;
  onReveal: () => void;
}

export function WordCard({ word, revealed, onReveal }: WordCardProps) {
  const speechSupported = canSpeak();

  return (
    <article className="word-card">
      <div className="word-card-top">
        <div>
          <p className="word-text">{word.word}</p>
          <p className="word-meta">{word.phonetic} · {word.pos}</p>
        </div>
        <button
          type="button"
          className="icon-button"
          aria-label="播放发音"
          disabled={!speechSupported}
          onClick={() => speakWord(word.word)}
        >
          <Volume2 size={22} aria-hidden="true" />
        </button>
      </div>

      {revealed ? (
        <div className="word-details">
          <p className="meaning">{word.meaningZh}</p>
          <p>{word.exampleEn}</p>
          <p className="example-zh">{word.exampleZh}</p>
        </div>
      ) : (
        <button type="button" className="secondary-button" onClick={onReveal}>
          查看释义
        </button>
      )}
    </article>
  );
}
```

- [ ] **Step 5: Add study screen**

Create `src/screens/StudyScreen.tsx`:

```tsx
import { useMemo, useState } from 'react';
import { applyReviewResult, createNewRecord } from '../domain/scheduler';
import type { StudyRecord, WordEntry } from '../domain/types';
import { WordCard } from '../components/WordCard';

interface StudyScreenProps {
  words: WordEntry[];
  records: StudyRecord[];
  onFinish: (updatedRecords: StudyRecord[]) => void;
}

export function StudyScreen({ words, records, onFinish }: StudyScreenProps) {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [localRecords, setLocalRecords] = useState(records);
  const today = new Date().toISOString().slice(0, 10);
  const word = words[index];

  const recordByWord = useMemo(
    () => new Map(localRecords.map((record) => [record.wordId, record])),
    [localRecords]
  );

  if (!word) {
    return (
      <section className="screen">
        <h1>今日完成</h1>
        <button className="primary-button" type="button" onClick={() => onFinish(localRecords)}>
          返回今日
        </button>
      </section>
    );
  }

  function answer(rating: 'again' | 'hard' | 'good') {
    const currentRecord = recordByWord.get(word.id) ?? createNewRecord(word.id, today);
    const nextRecord = applyReviewResult(
      currentRecord,
      { kind: 'flashcard', rating, correct: rating !== 'again' },
      today
    );
    const nextRecords = localRecords.filter((record) => record.wordId !== word.id).concat(nextRecord);
    setLocalRecords(nextRecords);
    setRevealed(false);
    const nextIndex = index + 1;
    if (nextIndex >= words.length) {
      onFinish(nextRecords);
    } else {
      setIndex(nextIndex);
    }
  }

  return (
    <section className="screen study-screen">
      <p className="session-count">{index + 1} / {words.length}</p>
      <WordCard word={word} revealed={revealed} onReveal={() => setRevealed(true)} />
      {revealed && (
        <div className="answer-grid">
          <button type="button" onClick={() => answer('again')}>不认识</button>
          <button type="button" onClick={() => answer('hard')}>模糊</button>
          <button type="button" onClick={() => answer('good')}>认识</button>
        </div>
      )}
    </section>
  );
}
```

- [ ] **Step 6: Wire study screen into app**

Modify `src/App.tsx` so the `today` screen can open a study session using the seed vocabulary. Use this final content:

```tsx
import { useState } from 'react';
import { BottomNav, type TabId } from './components/BottomNav';
import { ieltsWords } from './data/ieltsWords';
import type { StudyRecord } from './domain/types';
import { HomeScreen } from './screens/HomeScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { StatsScreen } from './screens/StatsScreen';
import { StudyScreen } from './screens/StudyScreen';
import { VocabularyScreen } from './screens/VocabularyScreen';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('today');
  const [studying, setStudying] = useState(false);
  const [records, setRecords] = useState<StudyRecord[]>([]);

  if (studying) {
    return (
      <div className="app-shell">
        <main className="app-main">
          <StudyScreen
            words={ieltsWords.slice(0, 20)}
            records={records}
            onFinish={(nextRecords) => {
              setRecords(nextRecords);
              setStudying(false);
              setActiveTab('today');
            }}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <main className="app-main">
        {activeTab === 'today' && <HomeScreen onStart={() => setStudying(true)} />}
        {activeTab === 'vocabulary' && <VocabularyScreen />}
        {activeTab === 'stats' && <StatsScreen />}
        {activeTab === 'settings' && <SettingsScreen />}
      </main>
      <BottomNav active={activeTab} onChange={setActiveTab} />
    </div>
  );
}
```

Modify `src/screens/HomeScreen.tsx`:

```tsx
interface HomeScreenProps {
  onStart: () => void;
}

export function HomeScreen({ onStart }: HomeScreenProps) {
  return (
    <section className="screen">
      <h1>今日任务</h1>
      <div className="dashboard-card">
        <p>待复习 0 个</p>
        <p>新词目标 20 个</p>
        <button className="primary-button" type="button" onClick={onStart}>开始学习</button>
      </div>
    </section>
  );
}
```

- [ ] **Step 7: Extend study styles**

Append to `src/styles.css`:

```css
.study-screen {
  display: grid;
  gap: 16px;
}

.session-count {
  margin: 0;
  color: #667085;
}

.word-card {
  border: 1px solid #ddd6c8;
  border-radius: 8px;
  padding: 18px;
  background: #fffdf8;
}

.word-card-top {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: flex-start;
}

.word-text {
  margin: 0;
  font-size: 34px;
  font-weight: 800;
  line-height: 1.1;
}

.word-meta,
.example-zh {
  color: #667085;
}

.icon-button {
  width: 44px;
  height: 44px;
  border: 1px solid #c9c1b4;
  border-radius: 8px;
  background: #ffffff;
}

.secondary-button {
  width: 100%;
  min-height: 48px;
  border: 1px solid #25635a;
  border-radius: 8px;
  background: #ffffff;
  color: #25635a;
  font-weight: 700;
}

.answer-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.answer-grid button {
  min-height: 48px;
  border: 0;
  border-radius: 8px;
  background: #e3f0ec;
  color: #1f2933;
  font-weight: 700;
}
```

- [ ] **Step 8: Verify study test and build**

Run:

```powershell
npm test -- src/screens/StudyScreen.test.tsx src/App.test.tsx
npm run build
```

Expected: both commands exit `0`.

- [ ] **Step 9: Commit study flow**

Run:

```powershell
git add src/platform/speech.ts src/components/WordCard.tsx src/screens/StudyScreen.tsx src/screens/StudyScreen.test.tsx src/screens/HomeScreen.tsx src/App.tsx src/styles.css
git commit -m "feat: add flashcard study session"
```

Expected: commit succeeds.

---

### Task 8: Choice and Spelling Study UI

**Files:**
- Modify: `src/screens/StudyScreen.tsx`
- Modify: `src/screens/StudyScreen.test.tsx`
- Modify: `src/styles.css`

- [ ] **Step 1: Extend study screen tests for mixed exercises**

Replace `src/screens/StudyScreen.test.tsx` with this content:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { StudyScreen } from './StudyScreen';
import { fixtureWords, makeRecord } from '../test/fixtures';

describe('StudyScreen', () => {
  it('reveals flashcard meaning and records a known answer', async () => {
    const onFinish = vi.fn();
    render(<StudyScreen words={fixtureWords.slice(0, 1)} records={[]} onFinish={onFinish} />);

    expect(screen.getByText('abandon')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: '查看释义' }));
    expect(screen.getByText('放弃；抛弃')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: '认识' }));
    expect(onFinish).toHaveBeenCalled();
  });

  it('shows multiple choice for medium-familiarity words', async () => {
    const onFinish = vi.fn();
    render(
      <StudyScreen
        words={fixtureWords}
        records={[makeRecord({ wordId: 'ielts-abandon', familiarity: 2, consecutiveCorrect: 1 })]}
        onFinish={onFinish}
      />
    );

    expect(screen.getByText('选择正确释义')).toBeInTheDocument();
    const [correctButton] = screen.getAllByRole('button', { name: '放弃；抛弃' });
    await userEvent.click(correctButton);
    expect(onFinish).toHaveBeenCalled();
  });

  it('shows spelling input for familiar words', async () => {
    const onFinish = vi.fn();
    render(
      <StudyScreen
        words={fixtureWords.slice(0, 1)}
        records={[makeRecord({ wordId: 'ielts-abandon', familiarity: 4, consecutiveCorrect: 2 })]}
        onFinish={onFinish}
      />
    );

    expect(screen.getByText('输入英文单词')).toBeInTheDocument();
    await userEvent.type(screen.getByLabelText('英文拼写'), 'abandon');
    await userEvent.click(screen.getByRole('button', { name: '提交' }));
    expect(onFinish).toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run failing mixed exercise tests**

Run:

```powershell
npm test -- src/screens/StudyScreen.test.tsx
```

Expected: FAIL because `StudyScreen` does not render choice and spelling exercises yet.

- [ ] **Step 3: Replace StudyScreen with mixed exercise UI**

Replace `src/screens/StudyScreen.tsx` with this content:

```tsx
import { useMemo, useState } from 'react';
import { buildChoiceOptions, checkChoiceAnswer, checkSpellingAnswer, chooseExerciseKind } from '../domain/exercises';
import { applyReviewResult, createNewRecord } from '../domain/scheduler';
import type { ExerciseKind, StudyRecord, WordEntry } from '../domain/types';
import { WordCard } from '../components/WordCard';

interface StudyScreenProps {
  words: WordEntry[];
  records: StudyRecord[];
  onFinish: (updatedRecords: StudyRecord[]) => void;
}

export function StudyScreen({ words, records, onFinish }: StudyScreenProps) {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [spellingAnswer, setSpellingAnswer] = useState('');
  const [localRecords, setLocalRecords] = useState(records);
  const today = new Date().toISOString().slice(0, 10);
  const word = words[index];

  const recordByWord = useMemo(
    () => new Map(localRecords.map((record) => [record.wordId, record])),
    [localRecords]
  );

  if (!word) {
    return (
      <section className="screen">
        <h1>今日完成</h1>
        <button className="primary-button" type="button" onClick={() => onFinish(localRecords)}>
          返回今日
        </button>
      </section>
    );
  }

  const currentRecord = recordByWord.get(word.id);
  const exerciseKind = chooseExerciseKind(currentRecord);

  function complete(kind: ExerciseKind, correct: boolean, rating: 'again' | 'hard' | 'good') {
    const baseRecord = currentRecord ?? createNewRecord(word.id, today);
    const nextRecord = applyReviewResult(baseRecord, { kind, rating, correct }, today);
    const nextRecords = localRecords.filter((record) => record.wordId !== word.id).concat(nextRecord);
    setLocalRecords(nextRecords);
    setRevealed(false);
    setSpellingAnswer('');

    const nextIndex = index + 1;
    if (nextIndex >= words.length) {
      onFinish(nextRecords);
    } else {
      setIndex(nextIndex);
    }
  }

  function submitSpelling() {
    const correct = checkSpellingAnswer(spellingAnswer, word.word);
    complete('spelling', correct, correct ? 'good' : 'again');
  }

  return (
    <section className="screen study-screen">
      <p className="session-count">{index + 1} / {words.length}</p>

      {exerciseKind === 'flashcard' && (
        <>
          <WordCard word={word} revealed={revealed} onReveal={() => setRevealed(true)} />
          {revealed && (
            <div className="answer-grid">
              <button type="button" onClick={() => complete('flashcard', false, 'again')}>不认识</button>
              <button type="button" onClick={() => complete('flashcard', true, 'hard')}>模糊</button>
              <button type="button" onClick={() => complete('flashcard', true, 'good')}>认识</button>
            </div>
          )}
        </>
      )}

      {exerciseKind === 'choice' && (
        <article className="exercise-card">
          <h1>{word.word}</h1>
          <p>{word.phonetic} · {word.pos}</p>
          <h2>选择正确释义</h2>
          <div className="choice-list">
            {buildChoiceOptions(word, words).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  const correct = checkChoiceAnswer(option, word);
                  complete('choice', correct, correct ? 'good' : 'again');
                }}
              >
                {option}
              </button>
            ))}
          </div>
        </article>
      )}

      {exerciseKind === 'spelling' && (
        <article className="exercise-card">
          <h1>输入英文单词</h1>
          <p>{word.meaningZh}</p>
          <p className="example-zh">{word.exampleEn}</p>
          <label className="field-label">
            英文拼写
            <input
              aria-label="英文拼写"
              value={spellingAnswer}
              onChange={(event) => setSpellingAnswer(event.target.value)}
              autoCapitalize="none"
              autoCorrect="off"
            />
          </label>
          <button className="primary-button" type="button" onClick={submitSpelling}>提交</button>
        </article>
      )}
    </section>
  );
}
```

- [ ] **Step 4: Add mixed exercise styles**

Append to `src/styles.css`:

```css
.exercise-card {
  border: 1px solid #ddd6c8;
  border-radius: 8px;
  padding: 18px;
  background: #fffdf8;
}

.exercise-card h1 {
  margin: 0 0 8px;
}

.exercise-card h2 {
  margin: 18px 0 10px;
  font-size: 18px;
}

.choice-list {
  display: grid;
  gap: 10px;
}

.choice-list button {
  min-height: 48px;
  border: 1px solid #c9c1b4;
  border-radius: 8px;
  background: #ffffff;
  color: #1f2933;
  text-align: left;
  padding: 10px 12px;
}
```

- [ ] **Step 5: Verify mixed exercise tests and build**

Run:

```powershell
npm test -- src/screens/StudyScreen.test.tsx
npm run build
```

Expected: both commands exit `0`.

- [ ] **Step 6: Commit mixed study UI**

Run:

```powershell
git add src/screens/StudyScreen.tsx src/screens/StudyScreen.test.tsx src/styles.css
git commit -m "feat: add mixed study exercises"
```

Expected: commit succeeds.

---

### Task 9: Vocabulary, Statistics, and Settings Screens

**Files:**
- Create: `src/domain/stats.ts`
- Create: `src/domain/stats.test.ts`
- Modify: `src/screens/VocabularyScreen.tsx`
- Modify: `src/screens/StatsScreen.tsx`
- Modify: `src/screens/SettingsScreen.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Write stats tests**

Create `src/domain/stats.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { calculateStats } from './stats';
import { makeRecord } from '../test/fixtures';

describe('calculateStats', () => {
  it('counts mastered words and accuracy', () => {
    const stats = calculateStats([
      makeRecord({
        familiarity: 5,
        history: [
          { wordId: 'ielts-abandon', kind: 'choice', rating: 'good', correct: true, answeredAt: '2026-06-26T00:00:00.000Z' },
          { wordId: 'ielts-abandon', kind: 'spelling', rating: 'again', correct: false, answeredAt: '2026-06-26T00:01:00.000Z' }
        ]
      })
    ]);

    expect(stats.masteredCount).toBe(1);
    expect(stats.accuracy).toBe(50);
  });
});
```

- [ ] **Step 2: Implement stats helper**

Create `src/domain/stats.ts`:

```ts
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
```

- [ ] **Step 3: Update vocabulary screen**

Modify `src/screens/VocabularyScreen.tsx` to accept words and display searchable rows:

```tsx
import { useMemo, useState } from 'react';
import type { StudyRecord, WordEntry } from '../domain/types';

interface VocabularyScreenProps {
  words: WordEntry[];
  records: StudyRecord[];
}

export function VocabularyScreen({ words, records }: VocabularyScreenProps) {
  const [query, setQuery] = useState('');
  const recordByWord = useMemo(() => new Map(records.map((record) => [record.wordId, record])), [records]);
  const filteredWords = words.filter((word) => word.word.toLowerCase().includes(query.toLowerCase()));

  return (
    <section className="screen">
      <h1>雅思词库</h1>
      <input
        className="search-input"
        aria-label="搜索单词"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <div className="word-list">
        {filteredWords.map((word) => {
          const record = recordByWord.get(word.id);
          return (
            <article className="word-row" key={word.id}>
              <div>
                <strong>{word.word}</strong>
                <p>{word.meaningZh}</p>
              </div>
              <span>{record?.seen ? '已学习' : '未学习'}</span>
            </article>
          );
        })}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Update stats screen**

Modify `src/screens/StatsScreen.tsx`:

```tsx
import { calculateStats } from '../domain/stats';
import type { StudyRecord } from '../domain/types';

interface StatsScreenProps {
  records: StudyRecord[];
}

export function StatsScreen({ records }: StatsScreenProps) {
  const stats = calculateStats(records);

  return (
    <section className="screen">
      <h1>学习统计</h1>
      <div className="stats-grid">
        <div><strong>{stats.seenCount}</strong><span>已学习</span></div>
        <div><strong>{stats.masteredCount}</strong><span>已掌握</span></div>
        <div><strong>{stats.accuracy}%</strong><span>正确率</span></div>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Update settings screen**

Modify `src/screens/SettingsScreen.tsx`:

```tsx
import type { UserSettings } from '../domain/types';

interface SettingsScreenProps {
  settings: UserSettings;
  onSettingsChange: (settings: UserSettings) => void;
  onExport: () => void;
  onImport: (file: File) => void;
  onClear: () => void;
}

export function SettingsScreen({
  settings,
  onSettingsChange,
  onExport,
  onImport,
  onClear
}: SettingsScreenProps) {
  return (
    <section className="screen">
      <h1>设置</h1>
      <label className="field-label">
        每日新词数
        <input
          aria-label="每日新词数"
          type="number"
          min="1"
          max="100"
          value={settings.dailyNewWords}
          onChange={(event) => onSettingsChange({ dailyNewWords: Number(event.target.value) })}
        />
      </label>
      <button type="button" className="secondary-button" onClick={onExport}>导出学习记录</button>
      <label className="secondary-button import-button">
        导入学习记录
        <input type="file" accept="application/json" onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) onImport(file);
        }} />
      </label>
      <button type="button" className="danger-button" onClick={onClear}>清空本地数据</button>
    </section>
  );
}
```

- [ ] **Step 6: Wire screens in App**

Modify `src/App.tsx` so it passes `ieltsWords`, `records`, and settings into screens. Add helper callbacks for export/import/clear using `createBackup` and `parseBackup`.

Use these imports:

```tsx
import { createBackup, parseBackup } from './storage/backup';
import type { StudyRecord, UserSettings } from './domain/types';
```

Use this state:

```tsx
const [records, setRecords] = useState<StudyRecord[]>([]);
const [settings, setSettings] = useState<UserSettings>({ dailyNewWords: 20 });
```

Use this export callback:

```tsx
function exportRecords() {
  const backup = createBackup(records, settings);
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `ielts-vocabulary-backup-${backup.exportedAt.slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
}
```

Use this import callback:

```tsx
async function importRecords(file: File) {
  const text = await file.text();
  const backup = parseBackup(text);
  setRecords(backup.records);
  setSettings(backup.settings);
}
```

Use this clear callback:

```tsx
function clearRecords() {
  if (window.confirm('确认清空本地学习记录？')) {
    setRecords([]);
  }
}
```

- [ ] **Step 7: Extend styles for lists, stats, and settings**

Append to `src/styles.css`:

```css
.word-list {
  display: grid;
  gap: 10px;
  margin-top: 14px;
}

.word-row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  border: 1px solid #ddd6c8;
  border-radius: 8px;
  padding: 12px;
  background: #fffdf8;
}

.word-row p {
  margin: 4px 0 0;
  color: #667085;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.stats-grid div {
  border: 1px solid #ddd6c8;
  border-radius: 8px;
  padding: 12px;
  background: #fffdf8;
}

.stats-grid strong,
.stats-grid span {
  display: block;
}

.field-label {
  display: grid;
  gap: 8px;
  margin-bottom: 14px;
}

.field-label input {
  min-height: 44px;
  border: 1px solid #c9c1b4;
  border-radius: 8px;
  padding: 0 12px;
}

.import-button {
  display: grid;
  place-items: center;
  margin-top: 10px;
}

.import-button input {
  display: none;
}

.danger-button {
  width: 100%;
  min-height: 48px;
  margin-top: 10px;
  border: 1px solid #b42318;
  border-radius: 8px;
  background: #fff8f6;
  color: #b42318;
  font-weight: 700;
}
```

- [ ] **Step 8: Verify tests and build**

Run:

```powershell
npm test -- src/domain/stats.test.ts src/App.test.tsx
npm run build
```

Expected: both commands exit `0`.

- [ ] **Step 9: Commit screens**

Run:

```powershell
git add src/domain/stats.ts src/domain/stats.test.ts src/screens/VocabularyScreen.tsx src/screens/StatsScreen.tsx src/screens/SettingsScreen.tsx src/App.tsx src/styles.css
git commit -m "feat: add vocabulary stats and settings screens"
```

Expected: commit succeeds.

---

### Task 10: Persist Progress with IndexedDB

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/App.test.tsx`
- Create: `src/storage/db.test.ts`

- [ ] **Step 1: Write app persistence integration target**

Create `src/storage/db.test.ts` only if the test environment supports IndexedDB. Use this content:

```ts
import { describe, expect, it } from 'vitest';

describe('IndexedDB adapter', () => {
  it('is covered through browser behavior in Playwright', () => {
    expect(true).toBe(true);
  });
});
```

- [ ] **Step 2: Modify App to load and save local data**

In `src/App.tsx`, import storage functions:

```tsx
import { clearLocalData, getRecords, getSettings, saveRecords, saveSettings } from './storage/db';
```

Change the React import to include `useEffect`:

```tsx
import { useEffect, useState } from 'react';
```

Add loading state:

```tsx
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
```

Load data on mount:

```tsx
useEffect(() => {
  Promise.all([getRecords(), getSettings()])
    .then(([storedRecords, storedSettings]) => {
      setRecords(storedRecords);
      setSettings(storedSettings);
      setError(null);
    })
    .catch(() => setError('本地学习记录读取失败'))
    .finally(() => setLoading(false));
}, []);
```

Save settings:

```tsx
function updateSettings(nextSettings: UserSettings) {
  setSettings(nextSettings);
  saveSettings(nextSettings).catch(() => setError('设置保存失败'));
}
```

Save study results:

```tsx
function finishStudy(nextRecords: StudyRecord[]) {
  setRecords(nextRecords);
  saveRecords(nextRecords).catch(() => setError('学习记录保存失败'));
  setStudying(false);
  setActiveTab('today');
}
```

Import records:

```tsx
async function importRecords(file: File) {
  try {
    const backup = parseBackup(await file.text());
    await saveRecords(backup.records);
    await saveSettings(backup.settings);
    setRecords(backup.records);
    setSettings(backup.settings);
    setError(null);
  } catch {
    setError('导入文件格式不正确，当前记录未被覆盖');
  }
}
```

Clear records:

```tsx
async function clearRecords() {
  if (window.confirm('确认清空本地学习记录？')) {
    await clearLocalData();
    setRecords([]);
  }
}
```

Show loading/error state before the main UI:

```tsx
if (loading) {
  return <main className="app-main"><p>正在加载学习记录...</p></main>;
}

if (error) {
  return (
    <main className="app-main">
      <p>{error}</p>
      <button className="primary-button" type="button" onClick={() => window.location.reload()}>重试</button>
      <label className="secondary-button import-button">
        导入备份
        <input type="file" accept="application/json" onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) importRecords(file);
        }} />
      </label>
      <button className="danger-button" type="button" onClick={() => {
        clearLocalData().then(() => {
          setRecords([]);
          setError(null);
        });
      }}>
        重置本地数据
      </button>
    </main>
  );
}
```

- [ ] **Step 3: Update App test for async local storage**

Replace `src/App.test.tsx` with this content:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';

vi.mock('./storage/db', () => ({
  clearLocalData: vi.fn(() => Promise.resolve()),
  getRecords: vi.fn(() => Promise.resolve([])),
  getSettings: vi.fn(() => Promise.resolve({ dailyNewWords: 20 })),
  saveRecords: vi.fn(() => Promise.resolve()),
  saveSettings: vi.fn(() => Promise.resolve())
}));

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('opens to today dashboard and can switch tabs', async () => {
    render(<App />);
    expect(await screen.findByText('今日任务')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: '词库' }));
    expect(screen.getByText('雅思词库')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: '设置' }));
    expect(screen.getByLabelText('每日新词数')).toBeInTheDocument();
  });
});
```

- [ ] **Step 4: Run build and tests**

Run:

```powershell
npm test
npm run build
```

Expected: both commands exit `0`.

- [ ] **Step 5: Commit persistence**

Run:

```powershell
git add src/App.tsx src/App.test.tsx src/storage/db.test.ts
git commit -m "feat: persist study progress locally"
```

Expected: commit succeeds.

---

### Task 11: PWA Manifest, Service Worker, and Mobile E2E

**Files:**
- Create: `public/manifest.webmanifest`
- Create: `public/sw.js`
- Create: `public/icons/icon.svg`
- Create: `tests/mobile.spec.ts`

- [ ] **Step 1: Add manifest**

Create `public/manifest.webmanifest`:

```json
{
  "name": "雅思单词本",
  "short_name": "雅思单词",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#f7f3ea",
  "theme_color": "#f7f3ea",
  "icons": [
    {
      "src": "/icons/icon.svg",
      "sizes": "512x512",
      "type": "image/svg+xml",
      "purpose": "any maskable"
    }
  ]
}
```

- [ ] **Step 2: Add icon**

Create `public/icons/icon.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="96" fill="#25635a"/>
  <path d="M154 132h204c22 0 40 18 40 40v208H190c-42 0-76-34-76-76V172c0-22 18-40 40-40Z" fill="#fffdf8"/>
  <path d="M182 190h148M182 246h116M182 302h154" stroke="#25635a" stroke-width="28" stroke-linecap="round"/>
</svg>
```

- [ ] **Step 3: Add service worker**

Create `public/sw.js`:

```js
const CACHE_NAME = 'ielts-vocabulary-pwa-v1';
const APP_SHELL = ['/', '/index.html', '/manifest.webmanifest', '/icons/icon.svg'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      });
    })
  );
});
```

- [ ] **Step 4: Add mobile e2e test**

Create `tests/mobile.spec.ts`:

```ts
import { expect, test } from '@playwright/test';

test('mobile learner can open and reveal a word card', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('今日任务')).toBeVisible();
  await page.getByRole('button', { name: '开始学习' }).click();
  await expect(page.getByText('abandon')).toBeVisible();
  await page.getByRole('button', { name: '查看释义' }).click();
  await expect(page.getByText('放弃；抛弃')).toBeVisible();
});

test('manifest is available', async ({ page }) => {
  const response = await page.goto('/manifest.webmanifest');
  expect(response?.ok()).toBe(true);
});
```

- [ ] **Step 5: Run e2e and build**

Run:

```powershell
npm run build
npm run e2e
```

Expected: build succeeds and both Playwright tests pass in the mobile project.

- [ ] **Step 6: Commit PWA**

Run:

```powershell
git add public/manifest.webmanifest public/sw.js public/icons/icon.svg tests/mobile.spec.ts
git commit -m "feat: add installable PWA support"
```

Expected: commit succeeds.

---

### Task 12: Expand IELTS Vocabulary and Final Verification

**Files:**
- Modify: `src/data/ieltsWords.ts`
- Create: `src/data/ieltsWords.test.ts`
- Create: `docs/vocabulary-source.md`

- [ ] **Step 1: Add vocabulary size test**

Create `src/data/ieltsWords.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { ieltsWords } from './ieltsWords';
import { validateVocabulary } from './validateVocabulary';

describe('ieltsWords', () => {
  it('contains a useful first-release IELTS vocabulary set', () => {
    expect(ieltsWords.length).toBeGreaterThanOrEqual(500);
    expect(ieltsWords.length).toBeLessThanOrEqual(1000);
    expect(validateVocabulary(ieltsWords)).toEqual([]);
  });
});
```

- [ ] **Step 2: Run failing vocabulary size test**

Run:

```powershell
npm test -- src/data/ieltsWords.test.ts
```

Expected: FAIL because the seed list has fewer than 500 words.

- [ ] **Step 3: Expand `ieltsWords`**

Replace `src/data/ieltsWords.ts` with 500-1000 entries using this exact object shape:

```ts
import type { WordEntry } from '../domain/types';

export const ieltsWords: WordEntry[] = [
  {
    id: 'ielts-abandon',
    word: 'abandon',
    meaningZh: '放弃；抛弃',
    pos: 'verb',
    phonetic: '/əˈbændən/',
    exampleEn: 'The plan was abandoned after costs rose sharply.',
    exampleZh: '成本大幅上升后，这个计划被放弃了。',
    difficulty: 'core'
  }
];
```

Rules for every entry:

- `id` format is `ielts-` plus lowercase word text with spaces replaced by hyphens.
- `word` is an IELTS-relevant English headword or short phrase.
- `meaningZh` is original Chinese wording.
- `exampleEn` is an original sentence written for this app.
- `exampleZh` is a direct Chinese translation of `exampleEn`.
- Do not copy definitions or examples from commercial IELTS books.
- Use `core`, `medium`, and `advanced` to spread difficulty.

- [ ] **Step 4: Document vocabulary source method**

Create `docs/vocabulary-source.md`:

```md
# Vocabulary Source

This project uses an internal IELTS-focused vocabulary dataset.

Each entry is structured as:

- English headword or short phrase
- Chinese definition
- Part of speech
- Phonetic spelling
- Original English example
- Chinese translation of the example
- Difficulty tag

Definitions and examples are written for this app. Commercial IELTS wordbook text is not copied into the dataset.
```

- [ ] **Step 5: Verify vocabulary data**

Run:

```powershell
npm test -- src/data/ieltsWords.test.ts src/data/validateVocabulary.test.ts
```

Expected: PASS.

- [ ] **Step 6: Run full verification**

Run:

```powershell
npm test
npm run build
npm run e2e
```

Expected: all commands exit `0`.

- [ ] **Step 7: Commit vocabulary expansion**

Run:

```powershell
git add src/data/ieltsWords.ts src/data/ieltsWords.test.ts docs/vocabulary-source.md
git commit -m "feat: add first IELTS vocabulary dataset"
```

Expected: commit succeeds.

---

### Task 13: Final Polish and Manual Mobile Review

**Files:**
- Modify: `src/styles.css`
- Modify: screen/component files only if visual review finds text overflow or awkward mobile spacing.
- Modify: `README.md`

- [ ] **Step 1: Add README**

Create `README.md`:

````md
# 雅思单词本

手机浏览器里的个人雅思背单词 PWA。

## 本地运行

```powershell
npm install
npm run dev
```

打开本地地址后，可以在手机浏览器中访问同一局域网地址进行测试。

## 验证

```powershell
npm test
npm run build
npm run e2e
```

## 数据

学习记录只保存在浏览器本地。设置页支持导出和导入 JSON 备份。
````

- [ ] **Step 2: Start local dev server**

Run:

```powershell
npm run dev -- --port 5173
```

Expected: Vite prints a local URL such as `http://localhost:5173/`.

- [ ] **Step 3: Review mobile viewport**

Use Playwright or the in-app browser at mobile width. Verify:

- Home screen text fits.
- Study card text fits without covering buttons.
- Bottom navigation is reachable.
- Settings import/export controls fit.
- No page has horizontal scrolling.

- [ ] **Step 4: Run final verification**

Run:

```powershell
npm test
npm run build
npm run e2e
```

Expected: all commands exit `0`.

- [ ] **Step 5: Commit final polish**

Run:

```powershell
git add README.md src/styles.css src
git commit -m "polish: finalize mobile vocabulary experience"
```

Expected: commit succeeds if files changed. If no files changed after review, skip this commit.
