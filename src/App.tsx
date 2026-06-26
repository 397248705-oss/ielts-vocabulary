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
