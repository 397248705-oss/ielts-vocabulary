import { useEffect, useMemo, useState } from 'react';
import { BottomNav, type TabId } from './components/BottomNav';
import { ieltsWords } from './data/ieltsWords';
import { buildDailyPlan } from './domain/dailyPlan';
import { toggleFavorite } from './domain/library';
import { getActiveMistakes, setMistakeMastered } from './domain/mistakes';
import { calculateStats } from './domain/stats';
import type { NewWordInput, StudyRecord, UserSettings, WordEntry } from './domain/types';
import { HomeScreen } from './screens/HomeScreen';
import { MistakesScreen } from './screens/MistakesScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { StatsScreen } from './screens/StatsScreen';
import { StudyScreen } from './screens/StudyScreen';
import { VocabularyScreen, type LibraryMode } from './screens/VocabularyScreen';
import {
  clearLocalData,
  getCustomWords,
  getRecords,
  getSettings,
  saveCustomWord,
  saveCustomWords,
  saveRecords,
  saveSettings
} from './storage/db';
import { createBackup, parseBackup } from './storage/backup';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('today');
  const [libraryMode, setLibraryMode] = useState<LibraryMode>('all');
  const [studyWords, setStudyWords] = useState<WordEntry[] | null>(null);
  const [records, setRecords] = useState<StudyRecord[]>([]);
  const [customWords, setCustomWords] = useState<WordEntry[]>([]);
  const [settings, setSettings] = useState<UserSettings>({ dailyNewWords: 20 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getRecords(), getSettings(), getCustomWords()])
      .then(([storedRecords, storedSettings, storedCustomWords]) => {
        setRecords(storedRecords);
        setSettings(storedSettings);
        setCustomWords(storedCustomWords);
        setError(null);
      })
      .catch(() => setError('本地学习记录读取失败'))
      .finally(() => setLoading(false));
  }, []);

  const words = useMemo(() => [...customWords, ...ieltsWords], [customWords]);
  const today = getToday();
  const dailyPlan = buildDailyPlan({
    words,
    records,
    dailyNewWords: settings.dailyNewWords,
    today
  });
  const wordById = new Map(words.map((word) => [word.id, word]));
  const dailyWords = [...dailyPlan.dueWordIds, ...dailyPlan.newWordIds]
    .map((wordId) => wordById.get(wordId))
    .filter((word): word is WordEntry => Boolean(word));
  const mistakeRecords = getActiveMistakes(records);
  const mistakeWords = mistakeRecords
    .map((record) => wordById.get(record.wordId))
    .filter((word): word is WordEntry => Boolean(word));
  const stats = calculateStats(records, today);

  function updateSettings(nextSettings: UserSettings) {
    setSettings(nextSettings);
    saveSettings(nextSettings).catch(() => setError('设置保存失败'));
  }

  function finishStudy(nextRecords: StudyRecord[]) {
    setRecords(nextRecords);
    saveRecords(nextRecords).catch(() => setError('学习记录保存失败'));
    setStudyWords(null);
    setActiveTab('today');
  }

  function openLibrary(mode: LibraryMode) {
    setLibraryMode(mode);
    setActiveTab('vocabulary');
  }

  function handleToggleFavorite(wordId: string) {
    const nextRecords = toggleFavorite(records, wordId, today);
    setRecords(nextRecords);
    saveRecords(nextRecords).catch(() => setError('收藏状态保存失败'));
  }

  function handleAddWord(input: NewWordInput) {
    const uniqueId = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${customWords.length}`;
    const customWord: WordEntry = {
      ...input,
      id: `custom-${uniqueId}`,
      difficulty: 'core',
      source: 'custom',
      createdAt: new Date().toISOString()
    };
    setCustomWords((current) => [customWord, ...current]);
    saveCustomWord(customWord).catch(() => setError('自定义单词保存失败'));
  }

  function handleMistakeMastered(wordId: string) {
    const nextRecords = setMistakeMastered(records, wordId, true);
    setRecords(nextRecords);
    saveRecords(nextRecords).catch(() => setError('错题状态保存失败'));
  }

  function exportRecords() {
    const backup = createBackup(records, settings, customWords);
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = `ielts-vocabulary-backup-${backup.exportedAt.slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function importRecords(file: File) {
    try {
      const backup = parseBackup(await file.text());
      await saveRecords(backup.records);
      await saveSettings(backup.settings);
      await saveCustomWords(backup.customWords);
      setRecords(backup.records);
      setSettings(backup.settings);
      setCustomWords(backup.customWords);
      setError(null);
    } catch {
      setError('导入文件格式不正确，当前记录未被覆盖');
    }
  }

  async function clearRecords() {
    if (window.confirm('确认清空本地学习记录？')) {
      await clearLocalData();
      setRecords([]);
      setCustomWords([]);
    }
  }

  if (loading) {
    return (
      <main className="app-main">
        <p>正在加载学习记录...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="app-main">
        <p>{error}</p>
        <button className="primary-button" type="button" onClick={() => window.location.reload()}>
          重试
        </button>
        <label className="secondary-button import-button">
          导入备份
          <input
            type="file"
            accept="application/json"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) {
                importRecords(file);
              }
            }}
          />
        </label>
        <button
          className="danger-button"
          type="button"
          onClick={() => {
            clearLocalData().then(() => {
              setRecords([]);
              setCustomWords([]);
              setError(null);
            });
          }}
        >
          重置本地数据
        </button>
      </main>
    );
  }

  if (studyWords) {
    return (
      <div className="app-shell">
        <main className="app-main">
          <StudyScreen
            words={studyWords}
            records={records}
            onFinish={finishStudy}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <main className="app-main">
        {activeTab === 'today' && (
          <HomeScreen
            dueCount={dailyPlan.dueWordIds.length}
            newCount={dailyPlan.newWordIds.length}
            stats={stats}
            onStart={() => setStudyWords(dailyWords)}
            onReviewMistakes={() =>
              mistakeWords.length > 0 ? setStudyWords(mistakeWords) : setActiveTab('mistakes')
            }
            onOpenFavorites={() => openLibrary('favorites')}
            onAddWord={() => openLibrary('add')}
          />
        )}
        {activeTab === 'vocabulary' && (
          <VocabularyScreen
            words={words}
            records={records}
            initialMode={libraryMode}
            onToggleFavorite={handleToggleFavorite}
            onAddWord={handleAddWord}
          />
        )}
        {activeTab === 'mistakes' && (
          <MistakesScreen
            words={words}
            records={records}
            onStart={() => setStudyWords(mistakeWords)}
            onMarkMastered={handleMistakeMastered}
          />
        )}
        {activeTab === 'stats' && <StatsScreen records={records} today={today} />}
        {activeTab === 'settings' && (
            <SettingsScreen
              settings={settings}
            onSettingsChange={updateSettings}
            onExport={exportRecords}
            onImport={importRecords}
            onClear={clearRecords}
          />
        )}
      </main>
      <BottomNav
        active={activeTab}
        onChange={(tab) => {
          if (tab === 'vocabulary') setLibraryMode('all');
          setActiveTab(tab);
        }}
      />
    </div>
  );
}

function getToday(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}
