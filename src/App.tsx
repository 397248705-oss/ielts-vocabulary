import { useState } from 'react';
import { BottomNav, type TabId } from './components/BottomNav';
import { ieltsWords } from './data/ieltsWords';
import type { StudyRecord, UserSettings } from './domain/types';
import { HomeScreen } from './screens/HomeScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { StatsScreen } from './screens/StatsScreen';
import { StudyScreen } from './screens/StudyScreen';
import { VocabularyScreen } from './screens/VocabularyScreen';
import { createBackup, parseBackup } from './storage/backup';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('today');
  const [studying, setStudying] = useState(false);
  const [records, setRecords] = useState<StudyRecord[]>([]);
  const [settings, setSettings] = useState<UserSettings>({ dailyNewWords: 20 });

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
    const backup = parseBackup(await file.text());
    setRecords(backup.records);
    setSettings(backup.settings);
  }

  function clearRecords() {
    if (window.confirm('确认清空本地学习记录？')) {
      setRecords([]);
    }
  }

  if (studying) {
    return (
      <div className="app-shell">
        <main className="app-main">
          <StudyScreen
            words={ieltsWords.slice(0, settings.dailyNewWords)}
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
        {activeTab === 'vocabulary' && <VocabularyScreen words={ieltsWords} records={records} />}
        {activeTab === 'stats' && <StatsScreen records={records} />}
        {activeTab === 'settings' && (
          <SettingsScreen
            settings={settings}
            onSettingsChange={setSettings}
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
