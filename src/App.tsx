import { useEffect, useState } from 'react';
import { BottomNav, type TabId } from './components/BottomNav';
import { ieltsWords } from './data/ieltsWords';
import type { StudyRecord, UserSettings } from './domain/types';
import { HomeScreen } from './screens/HomeScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { StatsScreen } from './screens/StatsScreen';
import { StudyScreen } from './screens/StudyScreen';
import { VocabularyScreen } from './screens/VocabularyScreen';
import { clearLocalData, getRecords, getSettings, saveRecords, saveSettings } from './storage/db';
import { createBackup, parseBackup } from './storage/backup';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('today');
  const [studying, setStudying] = useState(false);
  const [records, setRecords] = useState<StudyRecord[]>([]);
  const [settings, setSettings] = useState<UserSettings>({ dailyNewWords: 20 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  function updateSettings(nextSettings: UserSettings) {
    setSettings(nextSettings);
    saveSettings(nextSettings).catch(() => setError('设置保存失败'));
  }

  function finishStudy(nextRecords: StudyRecord[]) {
    setRecords(nextRecords);
    saveRecords(nextRecords).catch(() => setError('学习记录保存失败'));
    setStudying(false);
    setActiveTab('today');
  }

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

  async function clearRecords() {
    if (window.confirm('确认清空本地学习记录？')) {
      await clearLocalData();
      setRecords([]);
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
              setError(null);
            });
          }}
        >
          重置本地数据
        </button>
      </main>
    );
  }

  if (studying) {
    return (
      <div className="app-shell">
        <main className="app-main">
          <StudyScreen
            words={ieltsWords.slice(0, settings.dailyNewWords)}
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
        {activeTab === 'today' && <HomeScreen onStart={() => setStudying(true)} />}
        {activeTab === 'vocabulary' && <VocabularyScreen words={ieltsWords} records={records} />}
        {activeTab === 'stats' && <StatsScreen records={records} />}
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
      <BottomNav active={activeTab} onChange={setActiveTab} />
    </div>
  );
}
