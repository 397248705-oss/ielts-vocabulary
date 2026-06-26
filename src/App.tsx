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
