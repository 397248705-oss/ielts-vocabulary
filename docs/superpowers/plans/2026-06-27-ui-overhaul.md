# UI And Learning Experience Overhaul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver the approved clear blue-and-white mobile UI plus favorites, mistakes, combined filters, custom vocabulary, richer statistics, compatible backups, and automatic GitHub Pages publication.

**Architecture:** Keep scheduling and exercise generation in the domain layer, add pure helpers for filters/mistakes/statistics, and upgrade IndexedDB to store custom words without altering existing records. `App` owns loaded state and persistence callbacks; focused screens and reusable components render the five-tab interface without accessing IndexedDB directly.

**Tech Stack:** React 18, TypeScript, Vite 6, IndexedDB, Lucide React, Vitest, Testing Library, Playwright, GitHub Actions

---

## File Map

- Modify `src/domain/types.ts`: word metadata, mistake state, and backup v2 types.
- Modify `src/data/ieltsWords.ts`: attach IELTS source and topic metadata.
- Create `src/domain/library.ts` and `src/domain/library.test.ts`: favorites and combined filters.
- Create `src/domain/mistakes.ts` and `src/domain/mistakes.test.ts`: active mistakes and mastered state.
- Modify `src/domain/scheduler.ts` and tests: reset mastered mistakes on a new error and track last error time.
- Modify `src/domain/stats.ts` and tests: streaks, mistake count, and seven-day activity.
- Modify `src/storage/db.ts` and tests: IndexedDB v2 and custom-word CRUD.
- Modify `src/storage/backup.ts` and tests: backup v2 and v1 migration.
- Create `src/components/PageHeader.tsx`, `QuickAction.tsx`, `EmptyState.tsx`, `FilterBar.tsx`, `AddWordDialog.tsx`, and focused tests.
- Modify all files in `src/screens/`: build the five approved views and the immersive study flow.
- Create `src/screens/MistakesScreen.tsx` and tests.
- Modify `src/App.tsx`, `src/App.test.tsx`, and `src/components/BottomNav.tsx`: orchestration and five-tab navigation.
- Rewrite `src/styles.css`: responsive blue-white visual system.
- Modify `tests/mobile.spec.ts` and `playwright.config.ts`: feature workflow and responsive screenshots.

### Task 1: Word Metadata, Favorites, Filters, And Mistakes

**Files:**
- Modify: `src/domain/types.ts`
- Modify: `src/data/ieltsWords.ts`
- Modify: `src/data/validateVocabulary.ts`
- Modify: `src/test/fixtures.ts`
- Create: `src/domain/library.ts`
- Create: `src/domain/library.test.ts`
- Create: `src/domain/mistakes.ts`
- Create: `src/domain/mistakes.test.ts`
- Modify: `src/domain/scheduler.ts`
- Modify: `src/domain/scheduler.test.ts`

- [ ] **Step 1: Write failing domain tests**

Add tests that prove query, topic, source, and favorites compose; toggling an unseen word creates a record; active mistakes exclude mastered items; and a new wrong answer reactivates a mastered mistake.

```ts
it('combines query, topic, source, and favorite filters', () => {
  const records = [makeRecord({ wordId: 'ielts-abandon', favorite: true })];
  const result = filterWords(fixtureWords, records, {
    query: '放弃', topic: 'general', source: 'ielts', favoritesOnly: true
  });
  expect(result.map((word) => word.id)).toEqual(['ielts-abandon']);
});

it('creates a record when an unseen word is favorited', () => {
  const result = toggleFavorite([], 'ielts-abandon', '2026-06-27');
  expect(result[0]).toMatchObject({ wordId: 'ielts-abandon', seen: false, favorite: true });
});

it('reactivates a mastered mistake after another wrong answer', () => {
  const record = makeRecord({ mistakeMastered: true, errorCount: 2 });
  expect(applyReviewResult(record, { kind: 'choice', correct: false, rating: 'again' }, '2026-06-27'))
    .toMatchObject({ mistakeMastered: false, errorCount: 3, lastMistakeAt: '2026-06-27T12:00:00.000Z' });
});
```

- [ ] **Step 2: Run tests and verify RED**

Run: `npm test -- src/domain/library.test.ts src/domain/mistakes.test.ts src/domain/scheduler.test.ts`

Expected: FAIL because metadata, helpers, and new mistake fields do not exist.

- [ ] **Step 3: Implement minimal domain types and helpers**

Add `WordSource = 'ielts' | 'custom'`, required `source` and `topic` fields on `WordEntry`, optional `createdAt`, and `mistakeMastered`/`lastMistakeAt` on `StudyRecord`. Implement:

```ts
export interface LibraryFilters {
  query: string;
  topic: string | 'all';
  source: WordSource | 'all';
  favoritesOnly: boolean;
}

export function filterWords(words: WordEntry[], records: StudyRecord[], filters: LibraryFilters): WordEntry[];
export function toggleFavorite(records: StudyRecord[], wordId: string, today: string): StudyRecord[];
export function getActiveMistakes(records: StudyRecord[]): StudyRecord[];
export function setMistakeMastered(records: StudyRecord[], wordId: string, mastered: boolean): StudyRecord[];
```

Generated IELTS entries receive their existing topic key; seed entries use `general`. Custom entries will use `source: 'custom'` and `topic: 'custom'`.

- [ ] **Step 4: Run focused and vocabulary tests**

Run: `npm test -- src/domain/library.test.ts src/domain/mistakes.test.ts src/domain/scheduler.test.ts src/data/ieltsWords.test.ts src/data/validateVocabulary.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

Commit: `feat: add vocabulary filters and mistake state`

### Task 2: IndexedDB V2 And Compatible Backups

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `src/domain/types.ts`
- Modify: `src/storage/db.ts`
- Replace: `src/storage/db.test.ts`
- Modify: `src/storage/backup.ts`
- Modify: `src/storage/backup.test.ts`

- [ ] **Step 1: Install the IndexedDB test dependency**

Run: `npm install -D fake-indexeddb`

Expected: dependency and lockfile update with zero audit vulnerabilities.

- [ ] **Step 2: Write failing migration and backup tests**

Use `fake-indexeddb/auto` to create a version-1 database containing records/settings, open it through the v2 adapter, and assert the old data remains while `customWords` exists. Add backup tests:

```ts
it('migrates a version 1 backup to version 2 defaults', () => {
  const parsed = parseBackup(JSON.stringify({
    app: 'ielts-vocabulary-pwa', version: 1, exportedAt: '2026-06-26T00:00:00.000Z',
    settings: { dailyNewWords: 20 }, records: [makeRecord()]
  }));
  expect(parsed.version).toBe(2);
  expect(parsed.customWords).toEqual([]);
});

it('round-trips custom words', () => {
  const backup = createBackup([makeRecord()], defaultSettings, fixtureWords.slice(0, 1), '2026-06-27T00:00:00.000Z');
  expect(parseBackup(JSON.stringify(backup)).customWords).toHaveLength(1);
});
```

- [ ] **Step 3: Run tests and verify RED**

Run: `npm test -- src/storage/db.test.ts src/storage/backup.test.ts`

Expected: FAIL because DB v2, custom-word CRUD, and backup v2 are missing.

- [ ] **Step 4: Implement storage v2**

Set `DB_VERSION = 2`, add a `customWords` object store keyed by `id`, normalize legacy records on read, and implement:

```ts
export async function getCustomWords(): Promise<WordEntry[]>;
export async function saveCustomWord(word: WordEntry): Promise<void>;
export async function saveCustomWords(words: WordEntry[]): Promise<void>;
export async function deleteCustomWord(wordId: string): Promise<void>;
```

Update `clearLocalData` to clear all three stores. Backup v2 contains `customWords`; `parseBackup` returns a normalized v2 object for both version 1 and version 2 input and rejects invalid data before any write occurs.

- [ ] **Step 5: Run storage and full unit tests**

Run: `npm test -- src/storage/db.test.ts src/storage/backup.test.ts`

Expected: PASS.

Run: `npm test`

Expected: all unit tests pass.

- [ ] **Step 6: Commit**

Commit: `feat: persist custom vocabulary with compatible backups`

### Task 3: Rich Statistics And Daily Planning

**Files:**
- Modify: `src/domain/dailyPlan.ts`
- Modify: `src/domain/dailyPlan.test.ts`
- Modify: `src/domain/stats.ts`
- Modify: `src/domain/stats.test.ts`

- [ ] **Step 1: Write failing plan and statistics tests**

Verify custom words passed before IELTS words enter the daily new-word list, active mistakes are counted by word, streak uses consecutive calendar days, and the seven-day series includes zero days.

```ts
it('calculates streak and seven-day activity', () => {
  const records = [makeRecord({ history: [
    makeResult('2026-06-27T12:00:00.000Z', true),
    makeResult('2026-06-26T12:00:00.000Z', false)
  ], errorCount: 1 })];
  const stats = calculateStats(records, '2026-06-27');
  expect(stats.streakDays).toBe(2);
  expect(stats.mistakeWordCount).toBe(1);
  expect(stats.recentActivity).toHaveLength(7);
});
```

- [ ] **Step 2: Run and verify RED**

Run: `npm test -- src/domain/dailyPlan.test.ts src/domain/stats.test.ts`

Expected: FAIL on missing statistics fields.

- [ ] **Step 3: Extend the pure calculations**

Return `seenCount`, `masteredCount`, `mistakeWordCount`, `favoriteCount`, `totalAnswers`, `correctAnswers`, `accuracy`, `streakDays`, and `recentActivity: Array<{ date: string; answers: number }>` from `calculateStats(records, today)`. Keep daily-plan selection order stable so `App` can pass custom words before IELTS words.

- [ ] **Step 4: Run focused tests and commit**

Run: `npm test -- src/domain/dailyPlan.test.ts src/domain/stats.test.ts`

Expected: PASS.

Commit: `feat: add streak and activity statistics`

### Task 4: Application Orchestration And Five-Tab Shell

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/App.test.tsx`
- Modify: `src/components/BottomNav.tsx`
- Create: `src/components/PageHeader.tsx`
- Create: `src/components/EmptyState.tsx`
- Create: `src/components/QuickAction.tsx`

- [ ] **Step 1: Write failing App navigation and persistence tests**

Mock `getCustomWords`, `saveCustomWord`, and existing storage methods. Assert five navigation buttons render, the mistakes tab opens, favorites persist, and a saved custom word is added to state.

```tsx
it('shows the approved five-tab navigation', async () => {
  render(<App />);
  await screen.findByText('今天也要向目标靠近');
  for (const label of ['今日', '词库', '错题', '统计', '设置']) {
    expect(screen.getByRole('button', { name: label })).toBeInTheDocument();
  }
});
```

- [ ] **Step 2: Run App tests and verify RED**

Run: `npm test -- src/App.test.tsx`

Expected: FAIL because custom-word loading and the mistakes tab do not exist.

- [ ] **Step 3: Implement the shell state flow**

Load `[records, settings, customWords]`, combine words as `[...customWords, ...ieltsWords]`, build the current daily plan, and expose callbacks for favorite, custom-word save, mistake mastery, daily study, and mistake study. Keep all IndexedDB calls in `App`; screens receive data and callbacks only.

Update `TabId` to `'today' | 'vocabulary' | 'mistakes' | 'stats' | 'settings'` and use Lucide `House`, `BookOpen`, `CircleX`, `ChartNoAxesColumnIncreasing`, and `Settings` icons.

- [ ] **Step 4: Run App tests and commit**

Run: `npm test -- src/App.test.tsx`

Expected: PASS.

Commit: `feat: add five-tab learning app shell`

### Task 5: Blue-White Visual System, Home, And Statistics

**Files:**
- Modify: `src/styles.css`
- Modify: `src/screens/HomeScreen.tsx`
- Create: `src/screens/HomeScreen.test.tsx`
- Modify: `src/screens/StatsScreen.tsx`
- Modify: `src/components/ProgressRing.tsx`

- [ ] **Step 1: Write failing home and stats component tests**

Render real plan/stat objects and assert today's new/due counts, four quick actions, streak, mistake count, and seven dated activity points are visible.

- [ ] **Step 2: Run and verify RED**

Run: `npm test -- src/screens/HomeScreen.test.tsx src/domain/stats.test.ts`

Expected: FAIL because the dashboard and trend view are missing.

- [ ] **Step 3: Build the approved visual hierarchy**

Create CSS tokens for neutral canvas, white surfaces, cobalt blue primary action, green success, red error, amber favorite, purple custom-word accents, 8px cards, subtle borders/shadows, safe-area padding, and stable bottom navigation dimensions. Home includes one blue progress summary, a 2x2 quick-action grid, and compact statistic rows. Statistics uses four summary tiles, a CSS/SVG seven-day line chart with accessible text, and a completion bar.

- [ ] **Step 4: Verify components at unit level**

Run: `npm test -- src/screens/HomeScreen.test.tsx src/App.test.tsx`

Expected: PASS with no accessibility query failures.

- [ ] **Step 5: Commit**

Commit: `feat: redesign dashboard and statistics views`

### Task 6: Searchable Library And Custom Word Dialog

**Files:**
- Modify: `src/screens/VocabularyScreen.tsx`
- Create: `src/screens/VocabularyScreen.test.tsx`
- Create: `src/components/FilterBar.tsx`
- Create: `src/components/AddWordDialog.tsx`
- Create: `src/components/AddWordDialog.test.tsx`

- [ ] **Step 1: Write failing interaction tests**

Test Chinese/English search, combined topic/source/favorite filters, empty-state reset, favorite toggle, required fields, duplicate rejection, and valid custom-word submission.

```tsx
it('rejects duplicate custom words without submitting', async () => {
  const onSave = vi.fn();
  render(<AddWordDialog existingWords={fixtureWords} onSave={onSave} onClose={vi.fn()} />);
  await userEvent.type(screen.getByLabelText('英文单词'), 'Abandon');
  await userEvent.type(screen.getByLabelText('中文释义'), '放弃');
  await userEvent.click(screen.getByRole('button', { name: '保存单词' }));
  expect(screen.getByText('这个单词已经存在')).toBeInTheDocument();
  expect(onSave).not.toHaveBeenCalled();
});
```

- [ ] **Step 2: Run tests and verify RED**

Run: `npm test -- src/screens/VocabularyScreen.test.tsx src/components/AddWordDialog.test.tsx`

Expected: FAIL because the filter controls and dialog are missing.

- [ ] **Step 3: Implement the library UI**

Use an icon search field, horizontally scrollable topic chips, a source segmented control, favorite toggle, star icon buttons, source/topic badges, and an accessible modal dialog. Generate custom IDs as `custom-${crypto.randomUUID()}`, set blank optional examples to empty strings, and assign `source: 'custom'`, `topic: 'custom'`, `difficulty: 'core'`, and `createdAt`.

- [ ] **Step 4: Run focused tests and commit**

Run: `npm test -- src/screens/VocabularyScreen.test.tsx src/components/AddWordDialog.test.tsx`

Expected: PASS.

Commit: `feat: add searchable library and custom words`

### Task 7: Mistake Review And Immersive Study Feedback

**Files:**
- Create: `src/screens/MistakesScreen.tsx`
- Create: `src/screens/MistakesScreen.test.tsx`
- Modify: `src/screens/StudyScreen.tsx`
- Modify: `src/screens/StudyScreen.test.tsx`
- Modify: `src/components/WordCard.tsx`

- [ ] **Step 1: Write failing mistake and feedback tests**

Assert mistakes sort by error count then recent timestamp, “标记已掌握” invokes the callback, empty mistakes render a calm empty state, and choice/spelling answers show green/red feedback plus a “下一题” button before advancing.

- [ ] **Step 2: Run and verify RED**

Run: `npm test -- src/screens/MistakesScreen.test.tsx src/screens/StudyScreen.test.tsx`

Expected: FAIL because the screen and delayed feedback state do not exist.

- [ ] **Step 3: Implement the mistake screen and study states**

MistakesScreen receives `{ words, records, onStartReview, onMarkMastered }`. StudyScreen receives a session label and `onExit`, renders a top progress bar, keeps the word card centered, stores pending answer feedback, disables repeated submissions, and advances only from the explicit next button. Flashcard ratings remain “不认识 / 模糊 / 认识”.

- [ ] **Step 4: Run focused and full tests**

Run: `npm test -- src/screens/MistakesScreen.test.tsx src/screens/StudyScreen.test.tsx`

Expected: PASS.

Run: `npm test`

Expected: all unit/component tests pass.

- [ ] **Step 5: Commit**

Commit: `feat: add mistake review and study feedback`

### Task 8: Settings, End-To-End Verification, And Publication

**Files:**
- Modify: `src/screens/SettingsScreen.tsx`
- Create: `src/screens/SettingsScreen.test.tsx`
- Modify: `tests/mobile.spec.ts`
- Modify: `playwright.config.ts`
- Modify: `README.md`

- [ ] **Step 1: Add settings tests and extend Playwright workflows before final UI wiring**

Add SettingsScreen tests for clamping the target to 1-100, import-file forwarding, export, and clear actions. Cover these browser workflows: home quick actions; five-tab navigation; add a custom word and find it under the custom filter; favorite it; complete a wrong answer and find it in mistakes; change daily target; export path availability; manifest; and offline reload. Add Pixel 7 and iPhone SE projects, using stable viewport dimensions and screenshot assertions saved under `test-results`.

- [ ] **Step 2: Run E2E and verify RED**

Run: `npm test -- src/screens/SettingsScreen.test.tsx`

Expected: FAIL because the approved grouped controls and clamping behavior are not implemented.

Run: `npm run e2e`

Expected: new workflows fail until final callbacks, labels, and responsive details are complete.

- [ ] **Step 3: Finish settings and integration details**

Use icon-led grouped settings rows, clamp daily new words to 1-100, include custom words in export/import, preserve data on invalid imports, and update README with the new feature list. Resolve only failures demonstrated by the E2E tests.

- [ ] **Step 4: Run the full verification matrix**

Run: `npm test`

Expected: all unit/component tests pass.

Run: `npm run build`

Expected: Vite production build succeeds with `/ielts-vocabulary/` asset paths.

Run: `npm run e2e`

Expected: all Pixel 7 and iPhone SE workflows pass with no overlaps or clipped text.

- [ ] **Step 5: Inspect screenshots and deployed-path behavior**

Use image inspection on the generated screenshots. Preview the production build, confirm manifest/service-worker paths, then perform an online refresh followed by offline reload.

- [ ] **Step 6: Commit and publish**

Commit: `feat: complete mobile learning experience overhaul`

Merge the verified feature branch to `master`, push `origin/master`, wait for `.github/workflows/deploy-pages.yml`, and verify `https://397248705-oss.github.io/ielts-vocabulary/` returns HTTP 200 with the updated UI.
